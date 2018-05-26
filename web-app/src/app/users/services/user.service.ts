
import {share, take, map, filter} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable ,  Subject ,  BehaviorSubject } from 'rxjs';







import { APIService } from './../../shared/api.service';
import { ProjectsService } from './../../projects/services/projects.service';
import { User, UpdateUserPasswordPayload, UpdateUserNamePayload, UpdateUserEmailPayload } from './../model';

@Injectable()
export class UserService {

    private _userSelf = new BehaviorSubject<User>(null);
    public userSelf = this._userSelf.asObservable();

    constructor(
        private api: APIService,
        private route: ActivatedRoute,
        private projects: ProjectsService,
    ) {
        this.getUserSelf().subscribe();
    }

    isAuthorized(projectId: string, grant: string): Observable<boolean> {
        return this.getUserSelf().pipe(
            filter(user => {
                return !!user;
            }),
            map(user => {
                let projectGrants: Map<string, string[]> = user.projectGrants;
                if (!projectGrants) {
                    return false;
                }
                let grants: string[] = projectGrants[projectId];
                if (!grants) {
                    return false;
                }

                let allowed: boolean = !!grants.find(current => current === grant);

                return allowed;
            }),
            take(1),);
    }

    // TODO cache API call
    getUserSelf(): Observable<User> {
        let request = this.api.request({
            uri: `/users/self?include=projectGrants`,
            method: 'GET',
        }).pipe(
            map(res => {
                let user = res.payload;
                if (!user) {
                    throw new Error("no user in response");
                }

                this._userSelf.next(user);

                return user;
            }),share(),);

        return request;
    }

    updatePassword(payload: UpdateUserPasswordPayload): Observable<User> {
        let request = this.api.request({
            uri: `/users/self/password`,
            method: 'PATCH',
            body: JSON.stringify(payload),
        }).pipe(
            map(res => {
                let user = res.payload;
                if (!user) {
                    throw new Error("no user in response");
                }

                this._userSelf.next(user);

                return user;
            }),share(),);

        return request;
    }

    updateName(payload: UpdateUserNamePayload): Observable<User> {
        let request = this.api.request({
            uri: `/users/self/name`,
            method: 'PATCH',
            body: JSON.stringify(payload),
        }).pipe(
            map(res => {
                let user = res.payload;
                if (!user) {
                    throw new Error("no user in response");
                }

                this._userSelf.next(user);

                return user;
            }),share(),);

        return request;
    }

    updateEmail(payload: UpdateUserEmailPayload): Observable<User> {
        let request = this.api.request({
            uri: `/users/self/email`,
            method: 'PATCH',
            body: JSON.stringify(payload),
        }).pipe(
            map(res => {
                let user = res.payload;
                if (!user) {
                    throw new Error("no user in response");
                }

                this._userSelf.next(user);

                return user;
            }),share(),);

        return request;
    }
}
