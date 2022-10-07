import { useCallback, useEffect, useRef, useState } from "react";
import { generateNickname } from "src/api/middleware";

export type StatusCheck = null | "FREE" | "USED" | "INCORRECT";

export function useCheckUniqueNickname(defaultValue?: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusCheck, setStatusCheck] = useState<StatusCheck>(null);
  const [nickname, setNickname] = useState<string>("");
  const timerID = useRef<NodeJS.Timer>();
  const isActivate = useRef<boolean>(false);

  useEffect(() => {
    isActivate.current = true;
    return () => {
      isActivate.current = false;
    };
  }, [setIsLoading, setStatusCheck]);

  useEffect(() => {
    if (nickname.length > 0) {
      if (!!defaultValue && defaultValue === nickname) {
        if (timerID.current) clearTimeout(timerID.current);
        setStatusCheck(null);
      }
      setIsLoading(true);
      if (timerID.current) clearTimeout(timerID.current);
      if (!/^[a-z\d\._]*$/.test(nickname) || nickname.length > 16) {
        setStatusCheck("INCORRECT");
        setIsLoading(false);
      } else {
        timerID.current = setTimeout(
          async (_nickname) => {
            const result = true; //await checkNickname(_nickname);
            if (isActivate.current) {
              if (result) {
                setStatusCheck("FREE");
              } else {
                setStatusCheck("USED");
              }
              setIsLoading(false);
            }
          },
          1000,
          nickname
        );
      }
    } else {
      if (timerID.current) clearTimeout(timerID.current);
      setStatusCheck(null);
      setIsLoading(false);
    }
  }, [nickname]);

  return { isLoading, statusCheck, setNickname };
}

export function useGenerateUniqueNickname() {
  const [nicknameVariableList, setNicknameVariableList] = useState<string[]>(
    []
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const setNickname = useCallback(async (nickname: string | null) => {
    setIsLoaded(false);
    if (nickname === null || nickname.length === 0) {
      setNicknameVariableList([]);
    } else {
      const listNickname = await generateNickname(nickname);
      if (listNickname.length > 0) {
        setNicknameVariableList([...listNickname]);
      }
    }
    setIsLoaded(true);
  }, []);

  return {
    nicknameVariableList,
    setNickname,
    isLoaded,
  };
}
