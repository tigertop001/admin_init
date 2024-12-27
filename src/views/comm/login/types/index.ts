export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TokenInfo {
  token: string;
  refreshToken: string;
  expireAt: Date;
}
