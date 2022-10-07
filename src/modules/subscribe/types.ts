export type Subscribe = ActivePaymentSubscribe | NoActivePaymentSubscribe;

export type TypeSubscribe = "1 month" | "6 month" | null;

export interface ActivePaymentSubscribe {
  dateNextPayment: Date;
  type: TypeSubscribe;
  autoPayment: boolean;
}

export interface NoActivePaymentSubscribe {
  dateEndSubscribe: Date;
}


export interface ApiSubscribeInformation 