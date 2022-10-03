export interface Subscribe {
  nextPayment: Date;
  type: typeSubscribe;
  autoPayment: boolean;
}

export type SubscribeInfoNew = Subscribe | null;

export type typeSubscribe = "1 month" | "6 month" | null;
