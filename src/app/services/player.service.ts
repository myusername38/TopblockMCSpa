import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StaffRank } from '../enums/staff-rank.enum';
import { PlayerAction } from '../enums/player-actions/player-action.enum';
import { PlayerPunishment } from '../enums/player-actions/player-punishment.enum';
import { PlayerTempPunishment } from '../enums/player-actions/player-temp-punishment.enum';
import { CondencedVoteHistory } from '../interface/player/condencedVoteHistory';
import { ServerPlayer } from '../interface/player/serverPlayer';
import { Rank } from '../enums/rank.enum';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  url = environment.apiUrl;

  constructor(private http: HttpClient,) { }

  async updateStaffRank(uuid: string, staffRank: StaffRank): Promise<{ message: string }> {
    const request = this.http.post<{ message: string }>(`${this.url}/admin/set-staff-rank`, { uuid, staffRank });
    return await lastValueFrom(request);
  }

  async updateStaffRankByUsername(username: string, staffRank: StaffRank): Promise<{ message: string }> {
    const request = this.http.post<{ message: string }>(`${this.url}/admin/set-staff-rank-by-username`, { username, staffRank });
    return await lastValueFrom(request);
  }

  async playerAction(username: string, action: PlayerAction) {
    const request = this.http.post<{ message: string }>(`${this.url}/server-relay/action`, { username, action });
    return await lastValueFrom(request);
  }

  async playerPunishment(username: string, punishment: PlayerPunishment, reason: string) {
    console.log(punishment)
    const request = this.http.post<{ message: string }>(`${this.url}/server-relay/punish`, { username, punishment, reason });
    return await lastValueFrom(request);
  }

  async playerTempPunishment(username: string, punishment: PlayerTempPunishment, reason: string, hours: number) {
    const request = this.http.post<{ message: string }>(`${this.url}/server-relay/punish`, { username, punishment, reason, hours });
    return await lastValueFrom(request);
  }

  async getPlayerVoteRecord(uuid: string, ) {
    const request = this.http.get<CondencedVoteHistory[]>(`${this.url}/admin/player-vote-record/${ uuid }`);
    return await lastValueFrom(request);
  }

  async setPlayerRank(uuid: string, rank: Rank) {
    const request = this.http.put(`${this.url}/admin/set-rank`, { uuid, rank });
    return await lastValueFrom(request);
  }

  async getOnlinePlayers(): Promise<ServerPlayer[]> {
    const request = this.http.get<ServerPlayer[]>(`${this.url}/admin/online-players`);
    return await lastValueFrom(request);
  }
}
