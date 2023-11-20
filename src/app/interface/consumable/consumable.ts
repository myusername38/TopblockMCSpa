export interface Consumable {
  id: string;
  itemCreator: ItemCreator;
  givenToUUID: string;
  usedByUUID: string;
  created: number;
  used: number;
  itemType: ItemType;
  cached: boolean;
}

export enum ItemType {
  voteKey = 'vote-key',
  basicKey = 'basic-key',
  minionKey = 'minions-key',
  spawnerKey = 'spawner-key',
  godKey = 'god-key',
  voteVoucher = 'vote-voucher',
  pawnVoucher = 'pawn-voucher',
  knightVoucher = 'knight-voucher',
  rookVoucher = 'rook-voucher',
  bishopVoucher = 'bishop-voucher',
  kingVoucher = 'king-voucher',
}
export enum ItemCreator {
  store = "store",
  api = "api",
  voteReward = "vote-reward",
  crateReward = "crate-reward",
  referralReward = "referral-reward",
}
