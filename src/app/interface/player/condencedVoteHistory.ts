export interface VoteHistoryItem {
    date: number;
    voteVoucherId?: string;
  }
  
  export interface CondencedVoteHistory {
    date: number;
    voteVoucherId?: string;
    votes: number;
  }
  
  export interface VoteHistoryPain {
    i: number;
    date: number;
    voucherUsed: boolean;
    votes: number;
    today: boolean;
  }
  