import * as InAppPurchases from 'expo-in-app-purchases';
import {SubscribeType} from "~types";


export type ResultPayment = "Success" | "Cancel" | "Error"
export interface BuySubscribeControllerInterface {
    readonly inAppPurchases: (type: SubscribeType) => Promise<ResultPayment>
    readonly inWeb: (type: SubscribeType) => Promise<ResultPayment>
}


enum SubscribeID {
    Month = "subscription.monthly",
    SemiAnnual = "subscription.semiAnnual",

    Week = "subscription.week"
}

export class BuySubscribeControllerGenerate implements BuySubscribeControllerInterface {
    private SubscribeTypeToSubscribeID(type: SubscribeType): SubscribeID {
       switch (type) {
           case SubscribeType.MONTH:
               return SubscribeID.Month
           case SubscribeType.HALF_YEAR:
               return SubscribeID.SemiAnnual
           case SubscribeType.WEEK:
               return SubscribeID.Month
       }
    }

    public async inAppPurchases (type: SubscribeType): Promise<ResultPayment> {
        try {
            //?
            await InAppPurchases.disconnectAsync()
            //?
            await InAppPurchases.connectAsync()
            await InAppPurchases.getProductsAsync([this.SubscribeTypeToSubscribeID(type)])
            await InAppPurchases.purchaseItemAsync(this.SubscribeTypeToSubscribeID(type))
            await InAppPurchases.disconnectAsync()
            return "Success"
        } catch (error) {
            alert(error)
            return "Error"
        }
    }

    public async inWeb(type: SubscribeType): Promise<ResultPayment> {
        return "Success" as ResultPayment
    }
}


export default new BuySubscribeControllerGenerate()