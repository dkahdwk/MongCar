import React, { createContext, useContext, useRef } from 'react';
import { MobXProviderContext, ProviderProps } from 'mobx-react';
import { shallowEqual } from 'mobx-react/src/utils/utils';
import AuthStore from './AuthStore';
import MapStore from './MapStore';
import UIStore from './UIStore';

// eslint-disable-next-line import/prefer-default-export
export const RootStore = {
  uiStore: new UIStore(),
  authStore: new AuthStore(),
  mapStore: new MapStore(),
};

const CustomContext = createContext(RootStore);

// MobX와 Hook을 동시에 사용하기 위해서는 다음과 같은 Wrapper가 필요하다
export const useStore = () => useContext(CustomContext);

/**
 * @param props : 기본 Mobx Provider에서 사용하는 props를 가져옵니다. 직접 value를 넣어주는 경우가 아니라면
 * (이 프로젝트 같은경우엔) 직접적으로 사용할 일은 없습니다.
 */
export const MobxProvider = ({ children, ...stores }: ProviderProps) => {
  // 위 선언되었던 컨텍스트를 할당 후, 사용합니다.
  const parentContext = useContext(CustomContext);
  const previousStores = { ...stores };
  const previousContext = useRef({ ...parentContext, ...previousStores }).current;

  if (__DEV__) {
    const comparingContext = { ...previousContext, ...previousStores };
    if (!shallowEqual(previousContext, comparingContext)) {
      console.info('Mobx 스토어가 변경되었습니다. 정상작동을 위해서 재구동이 필요합니다.');
    }
  }

  return (
    <MobXProviderContext.Provider value={parentContext}>{children}</MobXProviderContext.Provider>
  );
};
