import useExperimentalFunction from "./use-experimental-function";
import {useEffect} from "react";

const useBaseMeditationInformation = (callbackCount: (count: number) => void): [boolean, {[key: string]: boolean}] => {
    const dotMeditation = useExperimentalFunction("baseMeditation_dotMeditation");
    const mandalaMeditation = useExperimentalFunction("baseMeditation_mandalaMeditation");
    const noseMeditation = useExperimentalFunction("baseMeditation_noseMeditation");

    const listStatus = [dotMeditation.status, mandalaMeditation.status, noseMeditation.status]

    useEffect(()=>{
        callbackCount(listStatus.filter(Boolean).length)
    }, listStatus)

    return [dotMeditation.status || mandalaMeditation.status || noseMeditation.status, {
        dotMeditation: dotMeditation.status,
        mandalaMeditation: mandalaMeditation.status,
        noseMeditation: noseMeditation.status
    }]
}

export default useBaseMeditationInformation