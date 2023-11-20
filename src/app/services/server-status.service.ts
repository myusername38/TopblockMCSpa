import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingData } from '../interface/misc/loading-data';
import { ServerStatusReport } from '../interface/server/server-status';

@Injectable({
  providedIn: 'root'
})
export class ServerStatusService {

  constructor(private http: HttpClient) { }

  
  async getServerStatus(): Promise<ServerStatusReport> {
    const request = this.http.get<ServerStatusReport>('https://mcapi.us/server/status?ip=play.TopblockMc.com');
    return await lastValueFrom(request);
  }
}
