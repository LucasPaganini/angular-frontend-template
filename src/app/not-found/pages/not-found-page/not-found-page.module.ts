import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NotFoundPageComponent } from './not-found-page.component'

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, RouterModule],
  exports: [NotFoundPageComponent],
})
export class NotFoundPageModule {}
