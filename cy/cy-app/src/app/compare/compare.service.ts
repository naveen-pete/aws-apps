import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

import { CompareData } from './compare-data.model';
import { AuthService } from '../user/auth.service';
import { environment } from "../../environments/environment";

@Injectable()
export class CompareService {
  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  dataLoaded = new Subject<CompareData[]>();
  dataLoadFailed = new Subject<boolean>();
  userData: CompareData;

  constructor(private http: HttpClient,
    private authService: AuthService) {
  }

  onStoreData(data: CompareData) {
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);
    this.dataEdited.next(false);
    this.userData = data;

    this.authService.getAuthenticatedUser().getSession((err, session: CognitoUserSession) => {
      if (err) {
        console.log('Get session for user failed! Error:', err);
        this.dataIsLoading.next(false);
        this.dataLoadFailed.next(true);
        this.dataEdited.next(false);
        return;
      }

      this.http.post<CompareData>(environment.apiBaseUrl, data, {
        headers: new HttpHeaders({ 'Authorization': session.getIdToken().getJwtToken() })
      })
        .subscribe(
          (result) => {
            this.dataLoadFailed.next(false);
            this.dataIsLoading.next(false);
            this.dataEdited.next(true);
            console.log('Store data for user successful!');
          },
          (error) => {
            this.dataIsLoading.next(false);
            this.dataLoadFailed.next(true);
            this.dataEdited.next(false);
            console.log('Store data for user failed! Error:', error);
          }
        );
    });
  }

  onRetrieveData(all = true) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);

    this.authService.getAuthenticatedUser().getSession((err, session: CognitoUserSession) => {
      if (err) {
        console.log('Get session for user failed! Error:', err);

        this.dataLoadFailed.next(true);
        this.dataIsLoading.next(false);
        return;
      }

      const queryParam = `accessToken=${session.getAccessToken().getJwtToken()}`;
      let urlParam = 'all';
      if (!all) {
        urlParam = 'single';
      }
      this.http.get<CompareData[]>(`${environment.apiBaseUrl}/${urlParam}?${queryParam}`, {
        headers: new HttpHeaders({ 'Authorization': session.getIdToken().getJwtToken() })
      })
        .subscribe(
          (data) => {
            if (all) {
              console.log('Returning all data.');
              this.dataLoaded.next(data);
              this.dataIsLoading.next(false);
            } else {
              console.log('Returning single data.');
              if (!data) {
                this.dataLoadFailed.next(true);
                this.dataIsLoading.next(false);
                return;
              }
              this.userData = data[0];
              this.dataEdited.next(true);
              this.dataIsLoading.next(false);
            }
          },
          (error) => {
            console.log('Get data failed. Error:', error);
            this.dataLoadFailed.next(true);
            this.dataIsLoading.next(false);
            this.dataLoaded.next(null);
          }
        );
    });
  }

  onDeleteData() {
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);

    this.authService.getAuthenticatedUser().getSession((err, session: CognitoUserSession) => {
      if (err) {
        console.log('Get session for user failed! Error:', err);
        this.dataIsLoading.next(false);
        this.dataLoadFailed.next(true);
        return;
      }

      this.http.delete(environment.apiBaseUrl, {
        headers: new HttpHeaders({ 'Authorization': session.getIdToken().getJwtToken() })
      })
        .subscribe(
          (data) => {
            console.log('Delete user data successful!');
            this.dataIsLoading.next(false);
            this.dataEdited.next(false);
          },
          (error) => {
            console.log('Delete user data failed! Error:', error);
            this.dataLoadFailed.next(true);
            this.dataIsLoading.next(false);
          }
        );
    });
  }
}
