import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestStatusLabel,
  ServiceTypeLabel
} from '../../models/service-request.model';
import { ServiceRequestService } from '../../services/service-request.service';

@Component({
  selector: 'app-service-request-card',
  templateUrl: './service-request-card.component.html',
  styleUrls: ['./service-request-card.component.scss']
})
export class ServiceRequestCardComponent implements OnChanges {

  @Input() request: ServiceRequest;
  @Output() statusChanged = new EventEmitter<{ id: string; status: ServiceRequestStatus }>();

  statusLabel: string;
  typeLabel: string;
  nextStatuses: ServiceRequestStatus[] = [];
  statusLabels = ServiceRequestStatusLabel;

  constructor(private requestService: ServiceRequestService) {}

  ngOnChanges(): void {
    if (this.request) {
      this.statusLabel = ServiceRequestStatusLabel[this.request.status];
      this.typeLabel = ServiceTypeLabel[this.request.type];
      this.nextStatuses = this.requestService.getNextPossibleStatuses(this.request.status);
    }
  }

  get statusCssClass(): string {
    switch (this.request.status) {
      case ServiceRequestStatus.Pendiente: return 'badge badge-pendiente';
      case ServiceRequestStatus.EnProceso: return 'badge badge-en-proceso';
      case ServiceRequestStatus.Terminado: return 'badge badge-terminado';
      case ServiceRequestStatus.Cancelado: return 'badge badge-cancelado';
      default: return 'badge';
    }
  }

  onAdvanceStatus(next: ServiceRequestStatus): void {
    try {
      this.requestService.changeStatus(this.request.id, next);
      this.statusChanged.emit({ id: this.request.id, status: next });
    } catch (error) {
      console.error(error.message);
    }
  }
}
