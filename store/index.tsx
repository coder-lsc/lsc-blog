import React, { createContext, ReactElement, useContext } from 'react';
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite';
import createStore, { IStore } from './rootStore';

interface IProps {
  initValue: Record<any, any>;
  children: ReactElement;
}

enableStaticRendering(true);

const StoreContext = createContext({});

export const StoreProvider = ({ initValue, children }: IProps) => {
  const store: IStore = useLocalObservable(createStore(initValue));
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore;
  if (!store) {
    throw new Error('数据不存在');
  }
  return store;
};
