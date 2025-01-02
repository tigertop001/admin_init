import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

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

const getUrl = (api: keyof typeof API_URLS) => {
  let str = "";
  switch (apiTp) {
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

export const getLoginApi = (data?: object) => {
  return http.request<Result>("post", getUrl("LOGIN"), {
    data
  });
};
export const verifyGoogleCodeApi = (data?: object) => {
  return http.request<Result>("post", getUrl("VERIFY_GOOGLE"), {
    data
  });
};
export const getCodeApi = (data?: object) => {
  return http.request<Result<any>>("post", getUrl("GET_CODE"), {
    data
  });
};
export const refreshTokenApi = (data?: object) => {
  return http.request<Result>("post", getUrl("REFRESH_TOKEN"), {
    data
  });
};
export const getLogInfoApi = (data?: object) => {
  return http.request<Result<any>>("post", getUrl("LOGIN_INFO"), {
    data
  });
};

export const accountApi = {
  login: getLoginApi,
  verifyGoogleCode: verifyGoogleCodeApi,
  getCode: getCodeApi,
  refreshToken: refreshTokenApi,
  getLoginInfo: getLogInfoApi
};
