import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "@/store/globalUtils";
import {
  getLoginApi,
  refreshTokenApi,
  verifyGoogleCodeApi,
  getLogInfoApi
} from "../api";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

type TempLoginData = {
  username: string;
  roles: Array<string>;
  permissions: Array<string>;
  accessToken: string;
  refreshToken: string;
  expires: Date;
  // needGoogleAuth: boolean;
};

export const useUserStore = defineStore({
  id: "userInfo",
  state: (): userType => ({
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 存储第一步登录成功的数据
    tempLoginData: null
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },

    /** 验证码类型 //  0 图形验证码，1 谷歌验证码 */
    SET_VERIFITYPE(value: string) {
      this.verifiType = value;
    },
    /** 存储临时登录数据 */
    SET_TEMP_LOGIN_DATA(value: TempLoginData | null) {
      this.tempLoginData = value;
    },
    /** 登录流程 */
    async loginByUsername(data: { username: string; password: string }) {
      try {
        const response = await getLoginApi(data);
        if (response?.success) {
          if (1) {
            // 需要谷歌验证
            // this.SET_NEED_GOOGLE_AUTH(true);
            this.SET_TEMP_LOGIN_DATA(response.data);
            setToken(response.data);
            console.log("---001");
            return response;
          } else {
            // 不需要谷歌验证，直接登录成功
            setToken(response.data);
            console.log("---002");
          }
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    // async loginByUsername(data) {
    //   try {
    //     const response = await getLogin(data);
    //     if (response?.success) {
    //       if (response.data?.needGoogleAuth) {
    //         // 需要谷歌验证
    //         this.SET_NEED_GOOGLE_AUTH(true);
    //         this.SET_TEMP_LOGIN_DATA(response.data);

    //         if (response.data?.needBindGoogle) {
    //           // 首次登录需要绑定谷歌验证器
    //           this.SET_NEED_BIND_GOOGLE(true);
    //           const qrResponse = await getGoogleAuthQrCode({
    //             username: data.username
    //           });
    //           if (qrResponse.success) {
    //             this.SET_GOOGLE_QR_CODE(qrResponse.data.qrCodeUrl);
    //             this.SET_GOOGLE_SECRET_KEY(qrResponse.data.secretKey);
    //           }
    //         }
    //         return response;
    //       } else {
    //         // 不需要谷歌验证，直接登录成功
    //         setToken(response.data);
    //       }
    //     }
    //     return response;
    //   } catch (error) {
    //     throw error;
    //   }
    // },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      try {
        const response = await refreshTokenApi(data);
        if (response) {
          setToken(response.data);
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    /** 验证谷歌验证码 */
    async verifyGoogleAuthCode(code: string) {
      try {
        const response = await verifyGoogleCodeApi({
          username: this.tempLoginData?.username,
          code
        });

        if (response.success) {
          const loginData = {
            ...this.tempLoginData,
            ...response.data
          };
          setToken(loginData);
          // 清理临时数据
          this.SET_TEMP_LOGIN_DATA(null);
          // this.SET_NEED_GOOGLE_AUTH(false);
          // this.SET_NEED_BIND_GOOGLE(false);
          // this.SET_GOOGLE_QR_CODE("");
          // this.SET_GOOGLE_SECRET_KEY("");
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    /** 获取验证码类型 */
    async getLogInfo() {
      try {
        const response = await getLogInfoApi();
        if (response.success) {
        }
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
