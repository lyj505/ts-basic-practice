import express, { Request, Response } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import stringify from 'json-stringify-safe';

import { logger } from '../libs/logger';
import { getUserOutput } from '../libs/auth';
import { MainStore } from '../../client/js/stores/Main';
import MainPage from '../../client/templates/MainPage';
import { SerializedUser } from '../../common/types';

const router = express.Router();

/**
 * Asynchronously load all the data required on a render by reading renderProps
 * @param req           express request object
 * @param res           express response object (used for redirects)
 * @return store to use, or null if redirected
 */
async function loadData(req: Request) {
  const storeData = {
    auth: {
      user: req.user && (getUserOutput(req.user) as SerializedUser),
    },
  };

  const store = new MainStore(storeData);

  return {
    store,
    title: null,
    keywords: null,
    description: null,
    fbImage: null,
  };
}

function handleRequest(req: Request, res: Response) {
  const loadDataStart = Date.now();

  loadData(req)
    .then(result => {
      if (!result) return; // We got redirected
      const { store, title, keywords, description, fbImage } = result;

      res.type('text/html');

      const context: any = {};
      const rendered = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.originalUrl} context={context}>
            <MainPage />
          </StaticRouter>
        </Provider>,
      );

      res.status(context.is404 ? 404 : 200);

      const bodyClass = '';

      if (context.url) {
        res.redirect(302, context.url);
      } else {
        res.render('index', {
          title,
          keywords,
          description,
          fbImage,
          react: rendered,
          bodyClass,

          // We use json-stringify-safe here because stores
          // often refer to their parents, but we don't need
          // those circular references
          storeJSON: stringify(store),
        });
      }
    })
    .catch(err => {
      logger.error(err.stack);
      res
        .status(500)
        .send('An unexpected error occurred; please try again later');
    });
}

router.get('*', handleRequest);

export default router;
