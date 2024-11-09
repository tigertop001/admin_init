import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

/** 地图数据 */
export const mapJson = (params?: object) => {
  return http.request<Result>(
    "get",
    "/mock/672b55c8cb7443249e0150fe/account/get-map-info",
    { params }
  );
};
