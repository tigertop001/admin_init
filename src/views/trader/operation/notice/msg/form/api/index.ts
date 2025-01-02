import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/sysmanager/message-list"
  },
  ADD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/sysmanager/message-create"
  },
  EDIT: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/sysmanager/message-edit"
  },
  DEL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/sysmanager/message-delete"
  },
  PUB: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/release"
  },
  INFO: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/sysmanager/message-info"
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

export const addApi = data => {
  return http.request<Result>("post", getUrl("ADD"), { data });
};
export const editlApi = data => {
  return http.request<Result>("post", getUrl("EDIT"), { data });
};
export const delApi = data => {
  return http.request<Result>("post", getUrl("DEL"), { data });
};
export const pubApi = data => {
  return http.request<Result>("post", getUrl("PUB"), { data });
};
export const infoApi = data => {
  return http.request<Result>("post", getUrl("INFO"), { data });
};
export const api = {
  list: listApi,
  add: addApi,
  edit: editlApi,
  del: delApi,
  pub: pubApi,
  info: infoApi
};
