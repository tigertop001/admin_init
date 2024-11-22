import { http } from "@/utils/http";
import type { OnlineParams } from "../types";
export const getMembershipListApi = (params: OnlineParams = {}) => {
  return http.request<ResultTable>(
    "get",
    "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    { params }
  );
};
