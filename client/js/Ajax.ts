import * as React from 'react';
import _ from 'lodash';
import { AxiosResponse } from 'axios';
import { FailedResponse, Response } from '../../common/types';

/** Error used to represent user-facing errors from the server */
export class ApplicationError extends Error {
  messages: React.ReactNode[];
  errTypes: string[];

  constructor(response: FailedResponse) {
    const message =
      response.messages instanceof Array
        ? response.messages.join('\n')
        : 'An unexpected error occurred';
    super(message);
    this.name = 'ApplicationError';
    super(message);
    this.messages = response.messages;
    this.errTypes = response.errTypes;
    this.stack = new Error().stack;
  }
}

/**
 * Process the response from the server, and return the .data on success,
 * or throw an ApplicationError otherwise
 */
export function processResponse(
  response: AxiosResponse<Response>,
  keys: string | string[] = 'data',
) {
  const data = response.data;

  if (data.success) {
    if (keys instanceof Array) {
      return _.pick(data, keys);
    } else {
      const key = keys;
      return data[key];
    }
  } else {
    throw new ApplicationError(data as FailedResponse);
  }
}

/**
 * Wrap the regular getCatch with an extra handler for ApplicationErrors
 */
export function getCatch(
  component: React.Component<any, any>,
  responseKey: string = 'response',
  loadingKey: string = 'loading',
) {
  return (err: Error | ApplicationError) => {
    if (err instanceof ApplicationError) {
      component.setState({
        [responseKey]: {
          success: false,
          messages: err.messages,
          errTypes: err.errTypes,
        },
        [loadingKey]: false,
      });
    } else {
      console.error(err.stack);
      component.setState({
        [responseKey]: {
          success: false,
          messages: [
            'An unexpected error has occurred. Please try again later.',
          ],
          error: err,
        },
        [loadingKey]: false,
      });
    }
  };
}

/** Get a response saying we ran into an unexpected error */
export function getUnexpectedErrorResponse(): FailedResponse {
  return {
    success: false,
    messages: [
      'Sorry, but we ran into an unexpected error. Please try again later',
    ],
    errTypes: ['unexpectedError'],
  };
}

/**
 * Get a response from a caught error from an AJAX call:
 * 1. If it was an unexpected error, log it and show that we got an unexpected error
 * 2. Otherwise, just get the raw response object
 */
export function getResponseFromError(
  err: Error | ApplicationError,
): FailedResponse {
  if (err instanceof ApplicationError) {
    return {
      success: false,
      messages: err.messages,
      errTypes: err.errTypes,
    };
  } else {
    console.error(err);
    return getUnexpectedErrorResponse();
  }
}

export default {
  ApplicationError,
  processResponse,
  getUnexpectedErrorResponse,
  getResponseFromError,
};
