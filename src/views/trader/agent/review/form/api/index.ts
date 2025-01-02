import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/agent/commission-review-list"
  },
  EDIT: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/agent/commission-review-edit"
  },
  INFO: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/agent/commission-review-stat"
  },
  OPT: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/agent/commission-review-operation"
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

export const editApi = data => {
  return http.request<Result>("post", getUrl("EDIT"), { data });
};

export const infoApi = () => {
  return http.request<Result>("post", getUrl("INFO"));
};

export const optApi = data => {
  return http.request<Result>("post", getUrl("OPT"), { data });
};
export const api = {
  list: listApi,
  edit: editApi,
  opt: optApi,
  info: infoApi
};
