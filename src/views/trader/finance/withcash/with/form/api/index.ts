import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/pay/withdrawList"
  },
  CXL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/pay/confirmWithdrawOrder"
  },
  BLACK: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/check/userOparatorBlack"
  },
  PASS: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/check/userOparatorPass"
  },
  CANCEL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/check/userOparatorCancle"
  },
  CLEAR: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/check/userOparatorClear"
  },
  BETCXL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/pay/confirmWithdrawOrder"
  },
  BETVER: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/pay/confirmWithdrawOrder"
  },
  BETPAY: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/pay/confirmWithdrawOrder"
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

export const listApi = data => {
  return http.request<Result>("post", getUrl("LIST"), { data });
};
export const cxlApi = data => {
  return http.request<Result>("post", getUrl("CXL"), { data });
};
export const blackApi = data => {
  return http.request<Result>("post", getUrl("BLACK"), { data });
};
export const passApi = data => {
  return http.request<Result>("post", getUrl("PASS"), { data });
};
export const clearApi = data => {
  return http.request<Result>("post", getUrl("CLEAR"), { data });
};
export const betCxlApi = data => {
  return http.request<Result>("post", getUrl("BETCXL"), { data });
};
export const betVerApi = data => {
  return http.request<Result>("post", getUrl("BETVER"), { data });
};
export const betPayApi = data => {
  return http.request<Result>("post", getUrl("BETPAY"), { data });
};
export const api = {
  list: listApi,
  cxl: cxlApi,
  black: blackApi,
  pass: passApi,
  clear: clearApi,
  betcxl: betCxlApi,
  betver: betVerApi,
  betpay: betPayApi
};
