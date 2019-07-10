/* eslint-disable import/no-unresolved */
import { StringValidator } from './Validation';

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    console.log('引入interface成功');
    return s.length === 5 && numberRegexp.test(s);
  }
}

//
