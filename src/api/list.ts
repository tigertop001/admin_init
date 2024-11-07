import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
  };
};

/** 卡片列表 */
export const getCardList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672b55c8cb7443249e0150fe/account/get-card-list",
    { data }
  );
};
