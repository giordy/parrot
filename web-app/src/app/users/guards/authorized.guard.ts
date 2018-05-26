
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from './../services/user.service';

@Injectable()
export class AuthorizedGuard {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(projectId: string, grant: string): Observable<boolean> {
    return this.userService.isAuthorized(projectId, grant).pipe(
      map(ok => {
        if (ok) {
          return true;
        }
        this.router.navigate(['/error'], { queryParams: { error: 'Unauthorized', message: 'You are not authorized to access this resource.' } });
        return false;
      }))
  }
}
