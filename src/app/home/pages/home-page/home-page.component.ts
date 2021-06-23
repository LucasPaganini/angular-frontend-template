import type { OnInit } from '@angular/core'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  constructor(private readonly _title: Title, private readonly _meta: Meta) {}

  public async ngOnInit(): Promise<void> {
    this._title.setTitle($localize`Home | TODO`)
    this._meta.removeTag('name=description')
  }
}
