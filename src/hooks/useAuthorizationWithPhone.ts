import { Dispatch, SetStateAction, useState } from "react";
import { checkSMSCode, requestSMSCode } from "~api/user";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type AuthorizationWithPhone = {
  requestSMSCode: (_numberPhone?: string) => Promise<void>;
  checkSMSCode: (code: string) => Promise<void>;
  setNumberPhone: Dispatch<SetStateAction<string | null>>;
};

export default function useAuthorizationWithPhone(): AuthorizationWithPhone {
  const [numberPhone, setNumberPhone] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  return {
    requestSMSCode: async (_numberPhone?: string) => {
      if (!!_numberPhone) {
        setNumberPhone(_numberPhone);
        setVerificationCode(await requestSMSCode(_numberPhone));
      } else if (!!numberPhone) {
        setVerificationCode(await requestSMSCode(numberPhone));
      }
    },
    checkSMSCode: async (code: string) => {
      if (verificationCode) {
        checkSMSCode(code, verificationCode);
      }
    },
    setNumberPhone,
  };
}
