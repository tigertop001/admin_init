import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

/** 文件上传 */
export const formUpload = data => {
  return http.request<Result>(
    "post",
    "https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
