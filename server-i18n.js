const express = require('express')
const { join } = require('path')

const getTranslatedServer = lang => {
  const DIST_FOLDER = join(process.cwd(), 'dist/todo/server', lang)
  const server = require(`${DIST_FOLDER}/main.js`)
  return server.app(lang)
}

function run() {
  const PORT = process.env.PORT || 4000

  const langRouters = {
    pt: getTranslatedServer('pt'),
    en: getTranslatedServer('en'),
  }

  const server = express()
  server.use('/pt', langRouters.pt)
  server.use('', langRouters.en)

  server.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`)
  })
}

run()
