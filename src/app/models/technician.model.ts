import { ServiceType } from './service-request.model';

export interface Technician {
  id: string;
  name: string;
  specialties: ServiceType[];
  phone: string;
  photoUrl?: string;
  averageRating: number;   // 0-5
  reviewsCount: number;
  available: boolean;
}
