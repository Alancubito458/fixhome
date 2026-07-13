import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceType
} from '../models/service-request.model';

export type SortField = 'createdAt' | 'updatedAt' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface RequestFilter {
  status?: ServiceRequestStatus | 'TODOS';
  type?: ServiceType | 'TODOS';
  technicianId?: string;
}

// Mapa de transiciones válidas: reto técnico "manejo de estados con enumeraciones TypeScript".
// Evita que la UI o un bug muevan una solicitud a un estado inválido (ej. de Terminado a Pendiente).
const ALLOWED_TRANSITIONS: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
  [ServiceRequestStatus.Pendiente]: [ServiceRequestStatus.EnProceso, ServiceRequestStatus.Cancelado],
  [ServiceRequestStatus.EnProceso]: [ServiceRequestStatus.Terminado, ServiceRequestStatus.Cancelado],
  [ServiceRequestStatus.Terminado]: [],
  [ServiceRequestStatus.Cancelado]: []
};

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  private requestsSubject = new BehaviorSubject<ServiceRequest[]>([]);
  public requests$: Observable<ServiceRequest[]> = this.requestsSubject.asObservable();

  constructor() {}

  // --- CRUD básico ---------------------------------------------------

  getAll(): ServiceRequest[] {
    return this.requestsSubject.value;
  }

  create(data: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): ServiceRequest {
    const now = new Date();
    const newRequest: ServiceRequest = {
      ...data,
      id: this.generateId(),
      status: ServiceRequestStatus.Pendiente,
      createdAt: now,
      updatedAt: now
    };
    this.requestsSubject.next([newRequest, ...this.requestsSubject.value]);
    return newRequest;
  }

  update(id: string, changes: Partial<ServiceRequest>): void {
    const list = this.requestsSubject.value.map(r =>
      r.id === id ? { ...r, ...changes, updatedAt: new Date() } : r
    );
    this.requestsSubject.next(list);
  }

  // --- Transición de estado -------------------------------------------
  // Lanza un error si la transición no está permitida; el componente que
  // llame a este método debe capturarlo y mostrar feedback al usuario.
  changeStatus(id: string, nextStatus: ServiceRequestStatus): void {
    const request = this.requestsSubject.value.find(r => r.id === id);
    if (!request) {
      throw new Error(`Solicitud ${id} no encontrada`);
    }

    const allowed = ALLOWED_TRANSITIONS[request.status];
    if (!allowed.includes(nextStatus)) {
      throw new Error(
        `Transición inválida: no se puede pasar de "${request.status}" a "${nextStatus}"`
      );
    }

    this.update(id, { status: nextStatus });
  }

  canTransitionTo(current: ServiceRequestStatus, next: ServiceRequestStatus): boolean {
    return ALLOWED_TRANSITIONS[current].includes(next);
  }

  getNextPossibleStatuses(current: ServiceRequestStatus): ServiceRequestStatus[] {
    return ALLOWED_TRANSITIONS[current];
  }

  // --- Filtrado y ordenación -------------------------------------------
  // Reto técnico: "filtrado y ordenación de solicitudes por estado y fecha".
  filterAndSort(
    filter: RequestFilter = {},
    sortField: SortField = 'createdAt',
    sortDirection: SortDirection = 'desc'
  ): ServiceRequest[] {
    let list = [...this.requestsSubject.value];

    if (filter.status && filter.status !== 'TODOS') {
      list = list.filter(r => r.status === filter.status);
    }
    if (filter.type && filter.type !== 'TODOS') {
      list = list.filter(r => r.type === filter.type);
    }
    if (filter.technicianId) {
      list = list.filter(r => r.technicianId === filter.technicianId);
    }

    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else {
        comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }

  private generateId(): string {
    return `sr_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }
}
