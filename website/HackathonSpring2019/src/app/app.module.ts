import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core/core.umd';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { OfficeComponent } from './office/office.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'office', component: OfficeComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WarehouseComponent,
    OfficeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCKNQq1mgU_-vqtOnnJxqK5UXhU3D7l-Vw'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
