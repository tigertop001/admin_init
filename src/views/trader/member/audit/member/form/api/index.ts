import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/check/userOparatorList"
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
  REJECT: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/check/AdminCheckReject"
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

// 黑名单
export const blackApi = data => {
  return http.request<Result>("post", getUrl("BLACK"), { data });
};
// 通过
export const passApi = data => {
  return http.request<Result>("post", getUrl("PASS"), { data });
};
// 撤销审核
export const cancelApi = data => {
  return http.request<Result>("post", getUrl("CANCEL"), { data });
};
// 一键清除
export const clearApi = data => {
  return http.request<Result>("post", getUrl("CLEAR"), { data });
};
// 驳回
export const rejectApi = data => {
  return http.request<Result>("post", getUrl("REJECT"), { data });
};
export const api = {
  list: listApi,
  black: blackApi,
  pass: passApi,
  cancel: cancelApi,
  clear: clearApi,
  reject: rejectApi
};
