import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {AuthorizedGuard} from './authorized.guard';

@Injectable()
export class CanActivateLocale implements CanActivate {
  constructor(private authorized: AuthorizedGuard) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let projectId = route.parent.params['projectId'];
    return this.authorized.canActivate(projectId, 'CanViewLocales');
  }
}
