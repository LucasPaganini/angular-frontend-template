import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HomePageComponent, HomePageModule } from './pages'

@NgModule({
  declarations: [],
  imports: [CommonModule, HomePageModule, RouterModule.forChild([{ path: '', component: HomePageComponent }])],
  exports: [],
})
export class HomeModule {}
