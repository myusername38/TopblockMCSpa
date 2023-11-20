import { StaffRank } from 'src/app/enums/staff-rank.enum';

export interface CustomClaims {
  minecraftUUID: string;
  staffRank: StaffRank;
}
