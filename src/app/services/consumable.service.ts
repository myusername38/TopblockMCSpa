import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StaffRank } from '../enums/staff-rank.enum';
import { ItemType } from '../interface/consumable/consumable';

@Injectable({
  providedIn: 'root'
})
export class ConsumableService {

  url = environment.apiUrl;

  constructor(private http: HttpClient,) { }

  async deleteConsumable(id): Promise<any> {
    const request = this.http.delete(`${this.url}/consumables/${ id }`);
    console.log('sup')
    return await lastValueFrom(request);
  }

  async generateConsumable(playerUUID: string, item: ItemType, quantity: number): Promise<any> {
    const request = this.http.post(`${this.url}/consumables/generate-consumable`, { playerUUID, item, quantity });
    console.log('sup')
    return await lastValueFrom(request);
  }
}
