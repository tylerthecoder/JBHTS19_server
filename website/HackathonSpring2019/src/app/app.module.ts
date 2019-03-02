import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core/core.umd';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { OfficeComponent } from './office/office.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WarehouseComponent,
    OfficeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCKNQq1mgU_-vqtOnnJxqK5UXhU3D7l-Vw'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
