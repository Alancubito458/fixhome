import { Pipe, PipeTransform } from '@angular/core';
import { ServiceRequest, ServiceRequestStatus } from '../models/service-request.model';

@Pipe({
  name: 'requestFilter'
})
export class RequestFilterPipe implements PipeTransform {

  transform(requests: ServiceRequest[], status: ServiceRequestStatus | 'TODOS' = 'TODOS'): ServiceRequest[] {
    if (!requests) {
      return [];
    }
    if (status === 'TODOS') {
      return requests;
    }
    return requests.filter(r => r.status === status);
  }
}
