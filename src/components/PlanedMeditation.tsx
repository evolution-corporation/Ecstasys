import React, { FC } from 'react'
import { ViewProps } from 'react-native'
import { useAppSelector } from '~store';


const PlanetMeditation: FC<Props> = (props) => {
    const isServerAccess = useIsServerAccess();

    const meditation = useAppSelector((state) => ({
        meditationRecommend: state.meditation.meditationRecommendToDay,
        isHavePlanMeditation: !!state.meditation.parametersMeditation,
        isLoading: !state.meditation.meditationPopularToDay,
      }));

    if (!isServerAccess) {
        return null
    }
    return (
        
    )
}

interface Props extends ViewProps {
    type: 'card'
}