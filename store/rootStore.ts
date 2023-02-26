import userStore, { IUserStore } from './useStore';

export interface IStore {
  user: IUserStore;
}

export default function createStore(initValue: any): () => IStore {
  return () => {
    return {
      user: { ...userStore(), ...initValue?.user },
    };
  };
}
