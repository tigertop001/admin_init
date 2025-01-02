import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/virtrualAccountList"
  },
  ADD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/addNewAccount"
  },
  ADDNOW: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/addExistccount"
  },
  ADD3RD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/AddThirdAccount"
  },
  QT3RD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/quitThirdAccount"
  },
  GETMONEY: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/getMoneyByAccount"
  },
  ENT3RD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/isEnterThird"
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

export const addNowApi = data => {
  return http.request<Result>("post", getUrl("ADDNOW"), { data });
};

export const add3rdApi = data => {
  return http.request<Result>("post", getUrl("ADD3RD"), { data });
};

export const qt3rdApi = data => {
  return http.request<Result>("post", getUrl("QT3RD"), { data });
};

export const getMnyApi = data => {
  return http.request<Result>("post", getUrl("GETMONEY"), { data });
};

export const ent3rdApi = data => {
  return http.request<Result>("post", getUrl("ENT3RD"), { data });
};
export const api = {
  list: listApi,
  add: addApi,
  addNow: addNowApi,
  add3rd: add3rdApi,
  qt3rd: qt3rdApi,
  getMny: getMnyApi,
  ent3rd: ent3rdApi
};
