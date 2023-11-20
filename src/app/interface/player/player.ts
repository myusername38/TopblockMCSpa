import { Rank } from "src/app/enums/rank.enum";
import { StaffRank } from "src/app/enums/staff-rank.enum";

export interface Player {
    uuid: string;
    rank: Rank;
    purchases: string[];
    totalVotes: number;
    voteCounter: number; // votes since last reward given
    username: string;
    staffRank: StaffRank;
    referredBy: string;
    referralCode: string;
    lastActive: number;
    firstJoined: number;
    highestVoteStreak: number;
    currentStreak: number;
  }
  