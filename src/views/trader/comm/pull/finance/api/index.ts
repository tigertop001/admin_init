import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/wallet/logs/list"
  },
  MTP: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/wallet/transaction/types"
  },
  STP: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/wallet/transaction/sub/types"
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

export const mtpApi = () => {
  return http.request<Result>("post", getUrl("MTP"));
};
export const stpApi = data => {
  return http.request<Result>("post", getUrl("STP"), { data });
};
export const api = {
  list: listApi,
  mpt: mtpApi,
  spt: stpApi
};
