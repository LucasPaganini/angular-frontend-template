/** Load `$localize` onto the global scope - used if i18n tags appear in Angular templates. */
import '@angular/localize/init'
import 'zone.js/node'
import { APP_BASE_HREF } from '@angular/common'
import { LOCALE_ID } from '@angular/core'
import { ngExpressEngine } from '@nguniversal/express-engine'
import * as compression from 'compression'
import * as slashes from 'connect-slashes'
import * as express from 'express'
import { existsSync } from 'fs'
import * as helmet from 'helmet'
import { join } from 'path'
import { AppServerModule } from './src/main.server'

type Environment = 'development' | 'production'
const getENV = (): Environment =>
  ['development', 'production'].includes(process.env.NODE_ENV as string)
    ? (process.env.NODE_ENV as Environment)
    : 'development'

// The Express app is exported so that it can be used by serverless Functions.
export function app(lang?: string): express.Express {
  const PRODUCTION_HOST = process.env.PRODUCTION_HOST ?? null

  const ENV = getENV()
  console.log(`Running in ${ENV}`)

  const server = express()

  const DIST_FOLDER = join(process.cwd(), 'dist/todo/browser', lang ?? '')
  const INDEX_HTML = existsSync(join(DIST_FOLDER, 'index.original.html')) ? 'index.original.html' : 'index'

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
      providers: [{ provide: LOCALE_ID, useValue: lang }],
    }),
  )

  server.set('view engine', 'html')
  server.set('views', DIST_FOLDER)

  // Performance and security middlewares
  server.use(compression())
  server.use(helmet({ contentSecurityPolicy: false }))
  server.enable('trust proxy') // #96 and https://stackoverflow.com/a/46475726

  // Redirect requests from other hostnames when on production
  if (PRODUCTION_HOST !== null) {
    server.use((req, res, next) => {
      if (req.hostname !== PRODUCTION_HOST) {
        console.warn(`Invalid host "${req.hostname}" on production`)
        // With 301/302, some old clients were incorrectly changing the method to GET, that's why we use 307 if it's not GET
        const redirectStatus = req.method === 'GET' ? 301 : 307
        res.redirect(redirectStatus, 'https://' + PRODUCTION_HOST + req.path)
        return
      }

      if (req.protocol === 'http') {
        console.warn(`Correct host using insecure protocol "${req.protocol}" on production`)
        // With 301/302, some old clients were incorrectly changing the method to GET, that's why we use 307 if it's not GET
        const redirectStatus = req.method === 'GET' ? 301 : 307
        res.redirect(redirectStatus, 'https://' + PRODUCTION_HOST + req.path)
        return
      }

      return next()
    })
  }

  // Serve static files from /browser
  server.get('*.*', express.static(DIST_FOLDER, { maxAge: '1y' }))
  server.get('*.*', (req, res) => {
    console.log(`Could not find "${req.path}"`)
    res.sendStatus(404)
  })

  // Remove trailing slashes for canonical urls
  server.use(slashes(false))

  // Serve prerendered pages if they exist
  server.get('*', (req, res, next) => {
    const prerenderedFilePath = join(DIST_FOLDER, req.path, 'index.html')
    const prerenderedFileExists = existsSync(prerenderedFilePath)
    if (req.path === '/') {
      const mainIndexIsPrerendered = existsSync(join(DIST_FOLDER, 'index.original.html'))
      if (mainIndexIsPrerendered === false) return next()
    }
    if (prerenderedFileExists === false) return next()

    console.log(`Will serve a prerendered page for "${req.path}"`)
    res.sendFile(prerenderedFilePath)
  })

  // If the page is not prerendered, use the Universal engine
  server.get('*', (req, res) => {
    console.log(`Could not find a prerendered page for "${req.path}", will serve it with the Universal engine`)
    res.render(INDEX_HTML, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] })
  })

  return server
}

function run(): void {
  const PORT = process.env.PORT ?? 4000
  const ENV = getENV()
  const server = express()

  if (ENV === 'production') {
    const langRouters = {
      pt: app('pt'),
      en: app('en'),
    }

    server.use('/pt', langRouters.pt)
    server.use('', langRouters.en)
  } else {
    server.use('', app())
  }

  // Start up the Node server
  // const server = app()
  server.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`)
  })
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire
const mainModule = __non_webpack_require__.main
const moduleFilename = (mainModule && mainModule.filename) || ''
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) run()

export * from './src/main.server'
