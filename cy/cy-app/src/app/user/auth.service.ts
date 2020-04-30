import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession } from "amazon-cognito-identity-js";

import { User } from './user.model';
import { environment } from "../../environments/environment";

const POOL_DATA = {
  UserPoolId: environment.userPoolId,
  ClientId: environment.clientId
};

const userPool = new CognitoUserPool(POOL_DATA);

@Injectable()
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  registeredUser: CognitoUser;

  constructor(private router: Router) { }

  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password
    };

    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = new CognitoUserAttribute({
      Name: 'email',
      Value: user.email
    });

    attrList.push(emailAttribute);

    userPool.signUp(
      user.username,
      user.password,
      attrList,
      null,
      (err, result) => {
        if (err) {
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          return;
        }

        this.authDidFail.next(false);
        this.authIsLoading.next(false);
        this.registeredUser = result.user;
      }
    );
  }

  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }

      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.router.navigate(['/']);
    });
  }

  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);

    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result: CognitoUserSession) => {
        this.authStatusChanged.next(true);
        this.authDidFail.next(false);
        this.authIsLoading.next(false);
        console.log('Signin Result:', result);
      },
      onFailure: (err) => {
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        console.log('Signin Error:', err);
      }
    });

    this.authStatusChanged.next(true);
    return;
  }

  getAuthenticatedUser() {
    return null;
  }

  logout() {
    this.authStatusChanged.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
    return obs;
  }

  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }
}
