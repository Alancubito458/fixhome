/**
 * FixHome - Modelos de dominio
 * Angular 7 / TypeScript ~3.1
 */

// Estado de una solicitud de servicio.
// Usamos un string enum para que el valor sea legible en JSON / localStorage / API.
export enum ServiceRequestStatus {
  Pendiente = 'PENDIENTE',
  EnProceso = 'EN_PROCESO',
  Terminado = 'TERMINADO',
  Cancelado = 'CANCELADO'
}

// Tipo de servicio solicitado.
export enum ServiceType {
  Plomeria = 'PLOMERIA',
  Electricidad = 'ELECTRICIDAD',
  Pintura = 'PINTURA',
  Carpinteria = 'CARPINTERIA',
  Otro = 'OTRO'
}

// Etiquetas legibles para mostrar en la UI (evita hardcodear strings en los templates).
export const ServiceRequestStatusLabel: Record<ServiceRequestStatus, string> = {
  [ServiceRequestStatus.Pendiente]: 'Pendiente',
  [ServiceRequestStatus.EnProceso]: 'En proceso',
  [ServiceRequestStatus.Terminado]: 'Terminado',
  [ServiceRequestStatus.Cancelado]: 'Cancelado'
};

export const ServiceTypeLabel: Record<ServiceType, string> = {
  [ServiceType.Plomeria]: 'Plomería',
  [ServiceType.Electricidad]: 'Electricidad',
  [ServiceType.Pintura]: 'Pintura',
  [ServiceType.Carpinteria]: 'Carpintería',
  [ServiceType.Otro]: 'Otro'
};

export interface ServiceRequest {
  id: string;
  type: ServiceType;
  description: string;
  photoUrl?: string;          // foto de evidencia (base64 o URL) tomada con Capacitor Camera
  status: ServiceRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  technicianId?: string;
  rating?: number;            // 1-5, se completa cuando status === Terminado
  address?: string;
}
