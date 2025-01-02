import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;
import { API_CONFIG, type PullType } from "./config";

const getUrl = (type: PullType) => {
  const config = API_CONFIG[type];
  return apiTp === "1" ? config.urls.mock : config.urls.real;
};

export const pullApi = (type: PullType, data: Record<string, any>) => {
  return http.request<Result>("post", getUrl(type), { data });
};

export const api = {
  pull: pullApi
};
