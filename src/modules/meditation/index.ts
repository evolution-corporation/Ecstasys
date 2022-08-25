import React, {FC, useRef} from 'react';
import {MeditationContext, useMeditationContext} from './context';
import * as API from './api';
import Screens from './screens';
import Routes from './routes';
import Components from './components';
import { Meditation } from './types'

const e = React.createElement;
const Meditation: FC<Props> = (props) => {
  const { children } = props;
  const meditation = useRef<Meditation>()
  if (meditation.current === undefined) {
    return null
  }

  return e(MeditationContext.Provider,
    { value: { meditation: meditation.current } },
    children
    )
}

interface Props{

}
export default Meditation



export {useMeditationContext, API, Routes, Screens, Components, Hooks}