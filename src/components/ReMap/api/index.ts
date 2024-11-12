import { http } from "@/utils/http";

/** 地图数据 */
export const mapJson = (params?: object) => {
  return http.request<Result>(
    "get",
    "/mock/672b55c8cb7443249e0150fe/account/get-map-info",
    { params }
  );
};
