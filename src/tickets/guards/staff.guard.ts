import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    const staffkey = request.headers['x-staff-key'];
    if (staffkey !== 'helpdesk-staff-secret') {
      throw new ForbiddenException('Required staff access key is missing or invalid');
    }
    return true;
  }
}
