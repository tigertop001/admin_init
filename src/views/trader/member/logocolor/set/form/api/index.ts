import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/color/colorConfigList"
  },
  UP: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/color/colorConfigListUpdate"
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
// 解冻
export const upApi = data => {
  return http.request<Result>("post", getUrl("UP"), { data });
};

export const api = {
  list: listApi,
  up: upApi
};
