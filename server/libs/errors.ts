import _ from 'lodash';
import { FailedResponse } from '../../common/types';
import { Response } from 'express';
import { ValidationErrorItem, ValidationError } from 'sequelize';
import { logger } from './logger';

export interface ErrorField {
  message: string;
  type: string;
}

/**
 * An internal error type for outputting expected error messages
 * and errTypes in catch() statements
 * @param errors  array of [{ message: '...', type: '...'}, ...]
 */
export class ApplicationError extends Error {
  messages: string[];
  errTypes: string[];
  stack: string;

  constructor(errors: ErrorField[]) {
    const messages = errors.map(err => {
      return err.message;
    });
    const errTypes = errors.map(err => {
      return err.type;
    });
    const message = messages.join('\n');
    super(message);

    this.name = 'ApplicationError';
    this.messages = messages;
    this.errTypes = errTypes;
  }
}

/**
 * An internal error for throwing an error as a response
 * @param response   response object
 */
export class ResponseError extends ApplicationError {
  response: FailedResponse;

  constructor(response: FailedResponse) {
    const errorFields = _.values(
      response.messages.map((message, index) => ({
        message,
        type: response.errTypes[index],
      })),
    );

    super(errorFields as any);
    this.response = response;
  }
}

/**
 * LogError extends Error with an additional data field, used for passing
 * extra data for logging
 */
export class LogError extends Error {
  data: any;
  stack: string;

  constructor(message: string, data: any) {
    super(message);
    this.data = data;
  }
}

/**
 * Process Sequelize validation messages so that we only display
 * the last one for each field
 * @param errors .errors from a sequelize.validate() or .save()
 * @return list of error messages
 */
function oneMessagePerField(errors: ValidationErrorItem[]) {
  const hasError = {};
  const messages = [];

  for (let i = 0; i !== errors.length; i++) {
    const error = errors[i];
    if (!hasError[error.path]) {
      hasError[error.path] = true;
      messages.push(error.message);
    }
  }

  return messages;
}

const isTest = process.env.NODE_ENV === 'test';

/** Make a curried function to catch/log application and other errors */
export function defaultCatch(res: Response) {
  return (err: Error) => {
    if (err instanceof Array) {
      // By convention, this is an error that we threw
      // ourselves, so we should actually output the error
      // messages to the client
      res.json({
        success: false,
        messages: err,
      });
    } else if (err instanceof ResponseError) {
      res.json(err.response);
    } else if (err instanceof ApplicationError) {
      // This is also an internally-generated error similar
      // to the above, except with details and futureproofing
      res.json({
        success: false,
        messages: err.messages,
        errTypes: err.errTypes,
      });
    } else if (err.name === 'SequelizeValidationError') {
      const validationError: ValidationError = err as any;
      res.json({
        success: false,
        messages: oneMessagePerField(validationError.errors),
      });
    } else {
      if (err instanceof LogError) {
        logger.error(err.stack, err.data);
      } else {
        logger.error('Caught unusual exception', err.stack);
      }
      if (isTest) {
        console.error(err.stack);
      }
      res.json({
        success: false,
        messages: ['An unexpected error has occurred'],
        error: err,
      });
    }
  };
}

export default {
  ApplicationError,
  ResponseError,
  LogError,
  defaultCatch,
};
