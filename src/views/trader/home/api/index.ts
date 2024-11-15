import { http } from "@/utils/http";
import type { OnlineParams } from "../types";
export const getHomeDataApi = () => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/home"
  );
};
export const getOnlineSummaryApi = (params: OnlineParams = {}) => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/onlineSummary",
    { params }
  );
};
export const getOnlineApi = (params: OnlineParams = {}) => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/online",
    { params }
  );
};
export const getRankingListApi = (params: OnlineParams = {}) => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/rankingList",
    { params }
  );
};
