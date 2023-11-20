import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemType } from '../interface/consumable/consumable';

@Injectable({
  providedIn: 'root'
})
export class McServerService {

  url = environment.apiUrl;

  constructor(private http: HttpClient,) { }

  async restart(): Promise<any> {
    const request = this.http.post(`${this.url}/server-relay/restart`, {});
    return await lastValueFrom(request);
  }

  async getWebsocketPassword(): Promise<{message: string}> {
    const request = this.http.get<{message: string}>(`${this.url}/server-relay/get-websocket-key`);
    return await lastValueFrom(request);
  }

}
