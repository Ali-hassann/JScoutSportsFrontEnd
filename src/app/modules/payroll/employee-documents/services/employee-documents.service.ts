import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeDocument } from '../models/employee-document.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDocumentsService {

  constructor(private _http: HttpClient,) { }
  public saveEmployeeDocuments(documentsRequest: EmployeeDocument[]): Observable<EmployeeDocument[]> {
    let url = `Employee/SaveEmployeeDocuments`;
    return this._http.post(url, documentsRequest) as Observable<EmployeeDocument[]>;
  }
  public getEmployeeDocuments(documentsRequest: EmployeeDocument): Observable<EmployeeDocument[]> {
    let url = `Employee/GetEmployeeDocuments`;
    return this._http.post(url, documentsRequest) as Observable<EmployeeDocument[]>;
  }
  
}
