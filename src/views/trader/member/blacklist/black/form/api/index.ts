import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/black/blackList"
  },
  CKLIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/user/getTenantInfoByStype"
  },
  ADD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/black/addBlack"
  },
  FRZN: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/black/blackUnfrozen"
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
export const ckListApi = data => {
  return http.request<Result>("post", getUrl("CKLIST"), { data });
};

export const addApi = data => {
  return http.request<Result>("post", getUrl("ADD"), { data });
};

export const frznApi = data => {
  return http.request<Result>("post", getUrl("FRZN"), { data });
};

export const api = {
  list: listApi,
  ckList: ckListApi,
  add: addApi,
  frzn: frznApi
};
