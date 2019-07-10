import { observable } from 'mobx';
import { AuthStore, AuthStoreData } from './Auth';

interface MainStoreData {
  auth: AuthStoreData;
}

/** A store to rule them all: top-level store */
export class MainStore {
  @observable
  auth: AuthStore;

  constructor(data?: MainStoreData | null) {
    if (!data) {
      return;
    }

    this.auth = new AuthStore(data.auth);
  }
}

export type InjectedProps = {};
