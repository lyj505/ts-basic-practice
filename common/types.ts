export const serializedUserAttributes = [
  'id',
  'email',
  'username',
  'activated',
];

export interface SerializedUser {
  id: number;
  email: string;
  username: string;
  activated: boolean;
}

export interface SuccessResponse {
  success: true;
  messages: React.ReactNode[];
  data?: any;
}

export interface FailedResponse {
  success: false;
  messages: React.ReactNode[];
  errTypes: string[];
}

export type Response = SuccessResponse | FailedResponse;
