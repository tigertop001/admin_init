import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  BIND: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/agent/bind"
  },
  CK: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/agent/bind-query"
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

export const bindApi = data => {
  return http.request<Result>("post", getUrl("BIND"), { data });
};

// 检查
export const ckApi = data => {
  return http.request<Result>("post", getUrl("CK"), { data });
};

export const api = {
  bind: bindApi,
  ck: ckApi
};
