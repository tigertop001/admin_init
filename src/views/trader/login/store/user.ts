import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "@/store/global-utils";
import {
  getLoginApi,
  refreshTokenApi,
  verifyGoogleCodeApi,
  getLogInfoApi,
  getCodeApi
} from "../api";
import { useMultiTagsStoreHook } from "@/store/modules/multi-tags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

type TempLoginData = {
  username: string;
  roles: Array<string>;
  permissions: Array<string>;
  token: string;
  refreshToken: string;
  expireAt: Date;
};

export const useUserStore = defineStore({
  id: "userInfo",
  state: (): userType => ({
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.account ?? "",
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    verifyCode: "",
    currentPage: 0,
    isRemembered: false,
    tempLoginData: null,
    verifiType: 1
  }),
  actions: {
    SET_USERNAME(username: string) {
      this.username = username;
    },
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    SET_VERIFITYPE(value: string) {
      this.verifiType = value;
    },
    SET_TEMP_LOGIN_DATA(value: TempLoginData | null) {
      this.tempLoginData = value;
    },
    async loginByUsername(data) {
      try {
        let response = await getLoginApi(data);
        if (response?.code === 0) {
          const res = {
            ...response.data,
            roles: ["trader"],
            permissions: ["*:*:*"],
            nickname: "小铭01",
            avatar: "https://avatars.githubusercontent.com/u/44761321",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
            expireAt: "2029/11/7 14:36:00",
            currency: "BRL"
          };
          setToken(res);
          return response;
        } else {
          throw new Error(response?.msg || "登录失败");
        }
      } catch (error) {
        console.error("登录失败:", error);
        throw error;
      }
    },
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
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
    async verifyGoogleAuthCode(code: any) {
      try {
        const response = await verifyGoogleCodeApi({
          username: this.tempLoginData?.username,
          code
        });

        if (response.code === 0) {
          const loginData = {
            ...this.tempLoginData,
            ...response.data
          };
          setToken(loginData);
          this.SET_TEMP_LOGIN_DATA(null);
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    async getLogInfo(params) {
      try {
        const response = await getLogInfoApi(params);
        if (response?.code === 0) {
          this.SET_VERIFITYPE(response.data?.codeType);
          if (response.data?.codeType == 1) {
            await this.getCode({ len: 6 });
          }

          return response;
        }
        throw new Error("获取登录信息失败");
      } catch (error) {
        console.error("获取登录信息失败:", error);
        throw error;
      }
    },
    async getCode(params) {
      try {
        const response = await getCodeApi(params);
        if (response?.code === 0) {
          this.SET_VERIFYCODE(response.data?.code);
          return response;
        }
        throw new Error("获取登录信息失败");
      } catch (error) {
        console.error("获取登录信息失败:", error);
        throw error;
      }
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
