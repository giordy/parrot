
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';




import { environment } from './../../environments/environment';
import { TokenService } from './../auth/services/token.service';

export interface RequestOptions {
    uri: string;
    method: string;
    body?: any;
    headers?: Headers;
    withAuthorization?: boolean;
}

@Injectable()
export class APIService {
    private apiUrl: string;

    constructor(
        private http: Http,
        private token: TokenService
    ) {
        this.apiUrl = environment.apiEndpoint;
    }

    getHeaders(withAuthorization: boolean) {
        if (withAuthorization === undefined) {
            withAuthorization = true;
        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('Accept', 'application/json');
        if (withAuthorization) {
            headers.append('Authorization', `Bearer ${this.token.getToken()}`);
        }
        return headers;
    }

    request(options: RequestOptions): Observable<any> {
        return this.http.request(
            `${this.apiUrl}${options.uri}`, {
                method: options.method || 'GET',
                headers: options.headers || this.getHeaders(options.withAuthorization),
                body: options.body,
            }).pipe(
            map(res => res.json()),
            catchError(err => {
                if (err.status <= 0) {
                    console.error(err);
                    return observableThrowError('internal error');
                }
                return observableThrowError(err.json().meta.error);
            }),);
    }

    requestDownload(options: RequestOptions): Observable<any> {
        return this.http.request(
            `${this.apiUrl}${options.uri}`, {
                method: options.method || 'GET',
                headers: options.headers || this.getHeaders(options.withAuthorization),
                body: options.body,
                responseType: ResponseContentType.Blob,
            }).pipe(
            map(res => res.blob()),
            catchError(err => { console.error(err); return observableThrowError(err); }),);
    }

    mapErrors(error: any): string[] {
        switch (error.type) {
            case "ValidationFailure":
                return error.errors.map(err => err.message);
            case "AlreadyExists":
                return [error.message];
            case "Unauthorized":
                return [error.message];
            default:
                return ['Something went wrong. That\'s all we know\'.'];
        }
    }
}
