import { http } from "@/utils/http";

// export type UserResult = {
//   success: boolean;
//   message: string;
//   data: {
//     /** 头像 */
//     // avatar: string;
//     /** 用户名 */
//     username: string;
//     /** 昵称 */
//     /** 当前登录用户的角色 */
//     roles: Array<string>;
//     /** 按钮级别权限 */
//     permissions: Array<string>;
//     /** `token` */
//     token: string;
//     /** 用于调用刷新`token`的接口时所需的`token` */
//     refreshToken: string;
//     /** `token`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
//     expireAt: Date;
//     // /** 是否需要谷歌验证器验证 */
//     // needGoogleAuth: boolean;
//     // /** 是否需要绑定谷歌验证器 */
//     // needBindGoogle: boolean;
//   };
// };

export type RefreshTokenResult = {
  success: boolean;
  message: string;
  data: {
    /** `token` */
    token: string;
    /** 用于调用刷新`token`的接口时所需的`token` */
    refreshToken: string;
    /** `token`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expireAt: Date;
  };
};

export type UserInfo = {
  // /** 头像 */
  // avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = {
  success: boolean;
  message: string;
  data: UserInfo;
};

/** 登录 */
export const getLoginApi = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672b55c8cb7443249e0150fe/account/login",
    // "/api/user/login",
    { data }
  );
};

// /** 获取谷歌验证器二维码 */
// export const getGoogleAuthQrCodeApi = (data?: object) => {
//   return http.request<{
//     success: boolean;
//     data: {
//       qrCodeUrl: string;
//       secretKey: string;
//     };
//   }>("post", "/api/auth/google/generate", { data });
// };

/** 验证谷歌验证码 */
export const verifyGoogleCodeApi = (data?: object) => {
  return http.request<RefreshTokenResult>(
    "post",
    "/mock/672b55c8cb7443249e0150fe/account/auth/google/verify",
    {
      data
    }
  );
};
/** 获取图片验证码 */
export const getCodeApi = () => {
  return http.request<Result>(
    "get",
    "/mock/672b55c8cb7443249e0150fe/account/user/getCode"
  );
};
/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>(
    "post",
    "/mock/672b55c8cb7443249e0150fe/account/refresh-token",
    { data }
  );
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfoResult>(
    "get",
    "/mock/672b55c8cb7443249e0150fe/account/mine",
    { data }
  );
};

// /** 账户设置-个人安全日志 */
// export const getMineLogs = (data?: object) => {
//   return http.request<ResultTable>(
//     "get",
//     "/mock/672b55c8cb7443249e0150fe/account/mine-logs",
//     { data }
//   );
// };

/** 获取验证码类型 */
export const getLogInfoApi = (params?: object) => {
  console.log("---data---", params);
  return http.request<Result>(
    "get",
    "/mock/672b55c8cb7443249e0150fe/account/logininfo",
    { params }
  );
};
