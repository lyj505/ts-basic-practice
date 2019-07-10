import { inject } from 'mobx-react';
import { observable, action } from 'mobx';
import { SerializedUser } from '../../../common/types';
import {
  getLoggedInUser,
  logout,
  login,
  RegistrationData,
  register,
} from '../User';

export interface AuthStoreData {
  user?: SerializedUser;
}

export class AuthStore {
  @observable
  user?: SerializedUser | null;
  @observable
  userLoading: boolean;
  @observable
  userError: string | null = null;

  constructor(store?: AuthStoreData | null) {
    if (store) {
      Object.assign(this, store);
    }
  }

  private async withLoading<T>(action: () => Promise<T>) {
    this.userLoading = true;
    this.userError = null;
    try {
      const result = await action();
      this.userLoading = false;
      return result;
    } catch (err) {
      this.userLoading = false;
      this.userError = err.message;
      throw err;
    }
  }

  @action
  refreshUser = async () => {
    return this.withLoading(async () => {
      const user = await getLoggedInUser();
      this.user = user;
      return user;
    });
  };

  @action
  login = async (usernameOrEmail: string, password: string) => {
    return this.withLoading(async () => {
      const user = await login(usernameOrEmail, password);
      this.user = user;
      return user;
    });
  };

  @action
  register = (userData: RegistrationData) => {
    return this.withLoading(async () => {
      const user = await register(userData);
      this.user = user;
      return user;
    });
  };

  @action
  logout = async () => {
    return this.withLoading(async () => {
      await logout();
      this.user = null;
    });
  };
}

export interface AuthInjectedProps {
  user?: SerializedUser | null;
  userLoading: boolean;
  userError: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  refreshUser: () => Promise<SerializedUser | null>;
  register: (user: RegistrationData) => Promise<SerializedUser | null>;
  logout: () => Promise<void>;
}

export const withAuth = inject(
  ({ store: { auth } }): AuthInjectedProps => {
    const authStore = auth as AuthStore;
    const {
      user,
      userLoading,
      userError,
      refreshUser,
      login,
      register,
      logout,
    } = authStore;
    return {
      user,
      userLoading,
      userError,
      refreshUser,
      login,
      register,
      logout,
    };
  },
);
