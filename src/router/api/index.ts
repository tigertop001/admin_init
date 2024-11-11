import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>(
    "get",
    "/mock/672b55c8cb7443249e0150fe/account/get-async-routes"
  );
};