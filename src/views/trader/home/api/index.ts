import { http } from "@/utils/http";

export const getHomeDataApi = () => {
  return http.request<Result>(
    "get",
    "/mock/6732dee691c574cfa14065dc/home/home"
  );
};
