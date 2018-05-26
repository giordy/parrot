
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';




@Injectable()
export class AuthSericeMock {
    public result: boolean = true;
    public userModel = {
        email: 'test@testdomain.com', 
        password: 'testpass'
    }
    constructor(  ){

    }
    login( user: any ){
        if ( user.email === this.userModel.email ) {
            return observableOf( this.result );
        }else{
            return observableThrowError( new Error('no payload in response') );
        }
    }

    register(user: any): Observable<boolean> {
        if ( user.email === this.userModel.email ) {
            return observableOf( true );
        }else{
            return observableThrowError( new Error('no meta in response') );
        }
    }
}
