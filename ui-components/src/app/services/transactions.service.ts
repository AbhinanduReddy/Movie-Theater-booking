import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private http: HttpClient) {}

  getTransactions(headers: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>('/api/theaters/transactions', { headers: headers });
}
}
