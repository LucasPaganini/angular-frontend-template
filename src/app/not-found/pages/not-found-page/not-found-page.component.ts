import { isPlatformBrowser } from '@angular/common'
import type { OnInit } from '@angular/core'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Optional, PLATFORM_ID } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { UnsubscriberService } from '@lucaspaganini/angular-utils'
import { RESPONSE } from '@nguniversal/express-engine/tokens'
import type { Response } from 'express'
import { timer } from 'rxjs'

@Component({
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  providers: [UnsubscriberService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent implements OnInit {
  public secondsToRedirect = 10

  constructor(
    @Optional() @Inject(RESPONSE) private readonly _response: Response | null,
    @Inject(PLATFORM_ID) private readonly _platformID: object,
    private readonly _cd: ChangeDetectorRef,
    private readonly _router: Router,
    private readonly _unsubscriber: UnsubscriberService,
    private readonly _title: Title,
    private readonly _meta: Meta,
  ) {}

  public ngOnInit(): void {
    this._title.setTitle($localize`Not found | TODO`)
    this._meta.removeTag('name=description')

    if (this._response) this._response.status(404)

    if (isPlatformBrowser(this._platformID)) {
      timer(0, 1000)
        .pipe(this._unsubscriber.takeUntilDestroy)
        .subscribe(() => {
          this.secondsToRedirect -= 1
          this._cd.markForCheck()
          if (this.secondsToRedirect <= 0) this._router.navigateByUrl('/')
        })
    }
  }
}
