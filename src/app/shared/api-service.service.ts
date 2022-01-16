import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Time-Stamp': 'test',
      // 'user_id': localStorage.getItem('user_id')
    })
  };
  bvp_endpoint: any;
  currentDate;
  currentYear;

  constructor(private http: HttpClient) {
    this.bvp_endpoint = environment.bvp_endpoint;
    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear().toString();
   }

  loginService(request): Observable<any> {
    const url = `${this.bvp_endpoint}/bvp/login`;
    const body = request;
    return this.http.post(url, body, this.httpOptions);
  }

  registrationService(request): Observable<any> {
    const url = `${this.bvp_endpoint}/bvp/user/register`;
    const body = request;
    return this.http.post(url, body, this.httpOptions);
  }

  getQuestionData(): Observable<any> {
    const url = 'assets/json/questions.json';
    return this.http.get(url);
  }

  getQuestionnaireData(queryParam, criteria): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Time-Stamp': new Date().toString(),
        'user_id': localStorage.getItem('user_id'),
        'year': this.currentYear,
        'q_no': queryParam,
        'criteria': criteria.toString()
      })
    };
    const url = `${this.bvp_endpoint}/bvp/question`;
    return this.http.get(url, httpOptions);
  }

  saveQuestionnaireData(request): Observable<any> {
    const url = `${this.bvp_endpoint}/bvp/question`;
    let httpOptions = {
      headers: new HttpHeaders({
        'Time-Stamp': new Date().toString(),
        'user_id': localStorage.getItem('user_id')
      })
    };
    const body = request;
    return this.http.post(url, body, httpOptions);
  }

  uploadFile(files, serial): Observable<any> {
    const url = `${this.bvp_endpoint}/bvp/question/files_upload`;
    let httpOptions = {
      headers: new HttpHeaders({
        'Time-Stamp': new Date().toString(),
        'user_id': localStorage.getItem('user_id'),
        'serial_number': serial.toString(),
        'criteria': localStorage.getItem('criteria'),
        'q_no': localStorage.getItem('question'),
        'year': localStorage.getItem('year')
      })
    };
    let finalData: FormData = new FormData();
    finalData.append('files[]', files);
    return this.http.post(url, finalData, httpOptions);
  }

  getAllUsers(): Observable<any> {
    const url = `${this.bvp_endpoint}/bvp/all_users`;
    let httpOptions = {
      headers: new HttpHeaders({
        'Time-Stamp': new Date().toString(),
        'User-ID': localStorage.getItem('user_id'),
      })
    };
    return this.http.get(url, httpOptions);
  }

  getYearList(userId): Observable<any> {
    const url = `${this.bvp_endpoint}/bvp/user/year`;
    let httpOptions = {
      headers: new HttpHeaders({
        'Time-Stamp': new Date().toString(),
        'user_id': userId,
      })
    };
    return this.http.get(url, httpOptions)
  }

  downloadReport(data): Observable<any> {
    const url = `${this.bvp_endpoint}/bvp/generate/report`;
    let httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Time-Stamp': new Date().toString(),
        'user_id': data['user_id'],
        'year': data['year'],
        'college_name': data['college_name']
      })
    };
    return this.http.get(url, httpOptions);
  }
}
