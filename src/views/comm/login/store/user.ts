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
    // 用户名，若用户未登录，默认为空
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.account ?? "",
    // 用户角色列表，用户在系统中的角色
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限列表，控制用户能够访问的具体操作权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 前端生成的验证码，通常是图形验证码，用于登录时验证
    verifyCode: "",
    // 判断登录页面当前展示的组件，默认为登录页面（0：登录，1：其他页面）
    currentPage: 0,
    // 是否勾选记住密码（免登录）
    isRemembered: false,
    // 存储临时登录数据，通常在第一次登录时存储
    tempLoginData: null,
    // 验证码类型（1:图片，2:google，3:不用验证码）
    verifiType: 1
  }),
  actions: {
    /** 设置用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 设置角色列表 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 设置按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 设置验证码（图形验证码） */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 设置当前显示的登录组件（用于控制登录页面的显示逻辑） */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 设置是否勾选了记住密码（免登录） */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置验证码类型（0：图形验证码，1：谷歌验证码） */
    SET_VERIFITYPE(value: string) {
      this.verifiType = value; // 1为谷歌验证码，0为图形验证码
    },
    /** 存储临时登录数据 */
    SET_TEMP_LOGIN_DATA(value: TempLoginData | null) {
      this.tempLoginData = value;
    },
    /** 通过用户名和密码登录 */
    async loginByUsername(data) {
      try {
        let response = await getLoginApi(data);
        if (response?.code === 0) {
          console.log("---response.data01--", response.data);
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
          console.log("---response.data02--", response.data);
          setToken(res); // 登录成功后存储 token
          return response;
        } else {
          throw new Error(response?.msg || "登录失败");
        }
      } catch (error) {
        console.error("登录失败:", error); // 捕获并打印错误信息
        throw error; // 将错误抛出以便外部处理
      }
    },
    /** 用户登出 */
    logOut() {
      // 清除用户信息、权限、token，并跳转到登录页面
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken(); // 清除 token
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]); // 重置多标签页
      resetRouter(); // 重置路由
      router.push("/login"); // 跳转到登录页
    },
    /** 刷新 token */
    async handRefreshToken(data) {
      try {
        const response = await refreshTokenApi(data);
        if (response) {
          setToken(response.data); // 更新 token
        }
        return response;
      } catch (error) {
        throw error; // 错误处理
      }
    },
    /** 验证谷歌验证码 */
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
          setToken(loginData); // 设置新的 token
          // 清除临时登录数据
          this.SET_TEMP_LOGIN_DATA(null);
        }
        return response;
      } catch (error) {
        throw error; // 错误处理
      }
    },
    /** 获取登录信息（包括验证码类型等） */
    async getLogInfo(params) {
      try {
        const response = await getLogInfoApi(params);
        if (response?.code === 0) {
          // 获取验证码类型并存储
          this.SET_VERIFITYPE(response.data?.codeType); // 默认值为图形验证码
          if (response.data?.codeType == 1) {
            await this.getCode({ len: 6 });
          }

          return response;
        }
        throw new Error("获取登录信息失败");
      } catch (error) {
        console.error("获取登录信息失败:", error); // 捕获并打印错误信息
        throw error;
      }
    },
    /** 获取图片验证码  */
    async getCode(params) {
      try {
        const response = await getCodeApi(params);
        if (response?.code === 0) {
          this.SET_VERIFYCODE(response.data?.code); // 默认值为图形验证码
          return response;
        }
        throw new Error("获取登录信息失败");
      } catch (error) {
        console.error("获取登录信息失败:", error); // 捕获并打印错误信息
        throw error;
      }
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
