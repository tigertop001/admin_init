import { http } from "@/utils/http";

// 读取环境变量判断是否使用 mock
const isApiType = import.meta.env.VITE_APITYPE;

// API 路径配置
const API_URLS = {
  LOGIN: {
    mock: "/mock/672b55c8cb7443249e0150fe/account/login",
    real: "/api/v1/tenant/usercenter/user/login"
  },
  VERIFY_GOOGLE: {
    mock: "/mock/672b55c8cb7443249e0150fe/account/auth/google/verify",
    real: "/api/auth/google/verify"
  },
  GET_CODE: {
    mock: "/mock/672b55c8cb7443249e0150fe/account/user/getCode",
    real: "/api/v1/tenant/usercenter/user/getCode"
  },
  REFRESH_TOKEN: {
    mock: "/mock/672b55c8cb7443249e0150fe/account/refresh-token",
    real: "/refresh-token"
  },
  LOGIN_INFO: {
    mock: "/mock/672b55c8cb7443249e0150fe/account/logininfo",
    real: "/api/v1/tenant/usercenter/user/getCodeType"
  }
} as const;

// 获取URL
const getUrl = (api: keyof typeof API_URLS) => {
  let str = "";
  switch (isApiType) {
    case "1":
      str = API_URLS[api].mock;
      break;
    case "2":
      str = API_URLS[api].real;
      break;
    default:
      break;
  }
  return str;
};

//登入接口
export const getLoginApi = (data?: object) => {
  return http.request<Result>("post", getUrl("LOGIN"), {
    data
  });
};
// 获取谷歌验证码
export const verifyGoogleCodeApi = (data?: object) => {
  return http.request<Result>("post", getUrl("VERIFY_GOOGLE"), {
    data
  });
};
// 获取图片验证码
export const getCodeApi = (data?: object) => {
  return http.request<Result<any>>("post", getUrl("GET_CODE"), {
    data
  });
};
// token刷新接口
export const refreshTokenApi = (data?: object) => {
  return http.request<Result>("post", getUrl("REFRESH_TOKEN"), {
    data
  });
};
// 获取登入信息
export const getLogInfoApi = (data?: object) => {
  return http.request<Result<any>>("post", getUrl("LOGIN_INFO"), {
    data
  });
};

// 同时导出整个API对象
export const accountApi = {
  login: getLoginApi,
  verifyGoogleCode: verifyGoogleCodeApi,
  getCode: getCodeApi,
  refreshToken: refreshTokenApi,
  getLoginInfo: getLogInfoApi
};
