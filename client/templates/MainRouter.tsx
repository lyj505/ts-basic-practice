import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import { MainStore } from '../js/stores/Main';
import MainPage from './MainPage';

declare global {
  interface Window {
    __MOBX_STATE__: any;
  }
}

const mobxState = window.__MOBX_STATE__;

const store = new MainStore(mobxState);

export default class MainRouter extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ScrollContext>
            <MainPage />
          </ScrollContext>
        </BrowserRouter>
      </Provider>
    );
  }
}
