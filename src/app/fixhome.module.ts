import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ServiceRequestCardComponent } from './components/service-request-card/service-request-card.component';
import { ServiceRequestListComponent } from './components/service-request-list/service-request-list.component';
import { RequestFilterPipe } from './pipes/request-filter.pipe';

@NgModule({
  declarations: [
    ServiceRequestCardComponent,
    ServiceRequestListComponent,
    RequestFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ServiceRequestListComponent
  ]
})
export class FixHomeModule {}
