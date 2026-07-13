import { Component, OnInit } from '@angular/core';
import {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceType,
  ServiceTypeLabel,
  ServiceRequestStatusLabel
} from '../../models/service-request.model';
import {
  ServiceRequestService,
  RequestFilter,
  SortField,
  SortDirection
} from '../../services/service-request.service';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-service-request-list',
  templateUrl: './service-request-list.component.html',
  styleUrls: ['./service-request-list.component.scss']
})
export class ServiceRequestListComponent implements OnInit {

  requests: ServiceRequest[] = [];

  statusOptions = Object.values(ServiceRequestStatus);
  typeOptions = Object.values(ServiceType);
  statusLabels = ServiceRequestStatusLabel;
  typeLabels = ServiceTypeLabel;

  selectedStatus: ServiceRequestStatus | 'TODOS' = 'TODOS';
  selectedType: ServiceType | 'TODOS' = 'TODOS';
  sortField: SortField = 'createdAt';
  sortDirection: SortDirection = 'desc';

  newDescription = '';
  newType: ServiceType = ServiceType.Plomeria;
  newPhotoUrl: string | null = null;
  cameraError: string | null = null;

  constructor(
    private requestService: ServiceRequestService,
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {
    this.requestService.requests$.subscribe(() => this.refresh());
  }

  refresh(): void {
    const filter: RequestFilter = {
      status: this.selectedStatus,
      type: this.selectedType
    };
    this.requests = this.requestService.filterAndSort(filter, this.sortField, this.sortDirection);
  }

  onFilterChange(): void {
    this.refresh();
  }

  onSortChange(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.refresh();
  }

  async onCapturePhoto(): Promise<void> {
    this.cameraError = null;
    const hasPermission = await this.cameraService.ensurePermissions();
    if (!hasPermission) {
      this.cameraError = 'Se necesita permiso de cámara para adjuntar evidencia.';
      return;
    }
    try {
      this.newPhotoUrl = await this.cameraService.takeEvidencePhoto();
    } catch (error) {
      this.cameraError = 'No se pudo tomar la foto. Intenta de nuevo.';
    }
  }

  onCreateRequest(): void {
    if (!this.newDescription.trim()) {
      return;
    }
    this.requestService.create({
      type: this.newType,
      description: this.newDescription.trim(),
      photoUrl: this.newPhotoUrl
    });

    this.newDescription = '';
    this.newPhotoUrl = null;
    this.newType = ServiceType.Plomeria;
  }
}
