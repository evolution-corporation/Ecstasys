/** @format */

import { useAppSelector } from "src/store/index";

const useIsNewUser = () => useAppSelector(store => store.account.isNewUser);

export default useIsNewUser;
