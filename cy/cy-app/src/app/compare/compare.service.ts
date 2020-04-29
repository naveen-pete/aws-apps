import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CompareData } from './compare-data.model';
import { AuthService } from '../user/auth.service';

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
    this.http.post<CompareData>('https://API_ID.execute-api.REGION.amazonaws.com/dev/', data, {
      headers: new HttpHeaders({ 'Authorization': 'XX' })
    })
      .subscribe(
        (result) => {
          this.dataLoadFailed.next(false);
          this.dataIsLoading.next(false);
          this.dataEdited.next(true);
        },
        (error) => {
          this.dataIsLoading.next(false);
          this.dataLoadFailed.next(true);
          this.dataEdited.next(false);
        }
      );
  }

  onRetrieveData(all = true) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);
    let queryParam = '';
    let urlParam = 'all';
    if (!all) {
      urlParam = 'single';
    }
    this.http.get<CompareData[]>('https://API_ID.execute-api.REGION.amazonaws.com/dev/' + urlParam + queryParam, {
      headers: new HttpHeaders({ 'Authorization': 'XXX' })
    })
      .subscribe(
        (data) => {
          if (all) {
            this.dataLoaded.next(data);
          } else {
            console.log(data);
            if (!data) {
              this.dataLoadFailed.next(true);
              return;
            }
            this.userData = data[0];
            this.dataEdited.next(true);
          }
        },
        (error) => {
          this.dataLoadFailed.next(true);
          this.dataLoaded.next(null);
        }
      );
  }

  onDeleteData() {
    this.dataLoadFailed.next(false);
    this.http.delete('https://API_ID.execute-api.REGION.amazonaws.com/dev/', {
      headers: new HttpHeaders({ 'Authorization': 'XXX' })
    })
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => this.dataLoadFailed.next(true)
      );
  }
}
