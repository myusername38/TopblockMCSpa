export interface ServerPlayer {
  uuid: string;
  displayName: string;
  address: string;
  port: number;
  exhaustion: number;
  exp: number;
  whitelisted: boolean;
  banned: boolean;
  op: boolean;
  balance: number;
  location: number[];
  dimension: string;
  health: number;
  hunger: number;
  saturation: number;
  gamemode: string;
  lastPlayed: number;
}
