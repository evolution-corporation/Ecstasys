import { useAppSelector } from "src/store/index";

const useAccountStatus = () => useAppSelector(store => store.account.status);

export default useAccountStatus;
