import { http } from "@/utils/http";
import type { OnlineParams } from "../types/home";
export const getHomeDataApi = () => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/home"
  );
};
export const getOnlineSummaryApi = () => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/onlineSummary"
  );
};
export const getOnlineApi = (params: OnlineParams = {}) => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/online",
    { params }
  );
};
