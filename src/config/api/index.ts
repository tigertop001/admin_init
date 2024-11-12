import { http } from "@/utils/http";

export const platformConfig = () => {
  return http.request<Result>(
    "get",
    "/mock/672b55c8cb7443249e0150fe/account/platformConfig"
  );
};
