import { http } from "@/utils/http";

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
export const getOnlineApi = () => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/online"
  );
};
