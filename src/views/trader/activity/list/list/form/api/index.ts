import { http } from "@/utils/http";

// 读取环境变量判断是否使用 mock
const isApiType = import.meta.env.VITE_APITYPE;

// API 路径配置
const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/list"
  },
  ADD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/create"
  },
  EDIT: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/create"
  },
  DEL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/delete"
  },
  PUB: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/release"
  },
  INFO: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/get"
  },
  END: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/ending"
  },
  UPLOAD: {
    mock: "/mock/upload",
    real: "/api/v1/tenant/tenant/file-upload"
  }
} as const;

// 获取URL
export const getUrl = (api: keyof typeof API_URLS) => {
  let str = "";
  switch (isApiType) {
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

// 列表
export const listApi = data => {
  return http.request<Result>("post", getUrl("LIST"), { data });
};

// 添加
export const addApi = data => {
  return http.request<Result>("post", getUrl("ADD"), { data });
};
// 编辑
export const editlApi = data => {
  return http.request<Result>("post", getUrl("EDIT"), { data });
};
// 删除
export const delApi = data => {
  return http.request<Result>("post", getUrl("DEL"), { data });
};
// 删除
export const pubApi = data => {
  return http.request<Result>("post", getUrl("PUB"), { data });
};
// 详情
export const infoApi = data => {
  return http.request<Result>("post", getUrl("INFO"), { data });
};
// 结束
export const endApi = data => {
  return http.request<Result>("post", getUrl("END"), { data });
};
// 文件睛传
export const uploadApi = (formData: FormData) => {
  return http.request<Result>("post", getUrl("UPLOAD"), {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const api = {
  list: listApi,
  add: addApi,
  edit: editlApi,
  del: delApi,
  pub: pubApi,
  info: infoApi,
  end: endApi,
  upload: uploadApi
};
