import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NotFoundPageComponent, NotFoundPageModule } from './pages'

@NgModule({
  declarations: [],
  imports: [CommonModule, NotFoundPageModule, RouterModule.forChild([{ path: '', component: NotFoundPageComponent }])],
  exports: [],
})
export class NotFoundModule {}
