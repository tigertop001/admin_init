<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import TypeIt from "@/components/ReTypeit";
import { debounce } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useEventListener } from "@vueuse/core";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import LoginUpdate from "./components/LoginUpdate.vue";
import { useUserStoreHook } from "@/views/comm/login/store/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { logo, lgam, rgam } from "./utils/static";
import { ReImageVerify } from "@/components/ReImageVerify";
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import globalization from "@/assets/svg/globalization.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import Check from "@iconify-icons/ep/check";
import User from "@iconify-icons/ri/user-3-fill";
import Info from "@iconify-icons/ri/information-line";

defineOptions({
  name: "Login"
});

const imgCode = ref("");
const router = useRouter();
const loading = ref(false);
const checked = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();
const currentPage = computed(() => useUserStoreHook().currentPage);

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);

const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
const {
  locale,
  translationCh,
  translationTw,
  translationEn,
  translationJa,
  translationKo
} = useTranslationLang();

const ruleForm = reactive({
  username: "admin",
  password: "admin123",
  verifyCode: "",
  googleCode: "" // 新增谷歌验证码字段
});

// // 从 store 中获取谷歌验证相关状态
const needGoogleAuth = 1; // 是否需要谷歌验证

onMounted(async () => {
  await useUserStoreHook().getLogInfo();
});

// 修改登录逻辑
const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      loading.value = true;
      try {
        if (needGoogleAuth && ruleForm.googleCode) {
          // 验证谷歌验证码
          const verifyRes = await useUserStoreHook().verifyGoogleAuthCode(
            ruleForm.googleCode
          );
          if (verifyRes.success) {
            // 验证成功，跳转到首页
            await initRouter();
            disabled.value = true;
            await router.push(getTopMenu(true).path);
            message("登录成功", { type: "success" });
          } else {
            message("谷歌验证码验证失败", { type: "error" });
          }
        } else {
          // 第一步登录
          const loginRes = await useUserStoreHook().loginByUsername({
            username: ruleForm.username,
            password: ruleForm.password
          });

          if (loginRes.success) {
            if (!needGoogleAuth) {
              // 不需要谷歌验证，直接登录成功
              await initRouter();
              disabled.value = true;
              await router.push(getTopMenu(true).path);
              message("登录成功", { type: "success" });
            }
            // 需要谷歌验证的情况会由 store 处理状态，等待用户输入验证码
          } else {
            message("登录失败", { type: "error" });
          }
        }
      } catch {
        message("登录失败", { type: "error" });
      } finally {
        loading.value = false;
        disabled.value = false;
      }
    }
  });
};

const immediateDebounce: any = debounce(
  formRef => onLogin(formRef),
  1000,
  true
);

// 优化 event listener 只在首次渲染时绑定
useEventListener(
  "keypress",
  ({ code }) => {
    if (
      ["Enter", "NumpadEnter"].includes(code) &&
      !disabled.value &&
      !loading.value
    ) {
      immediateDebounce(ruleFormRef.value);
    }
  },
  { once: true }
);

// 监听并更新 store 中的状态，避免不必要的深度监听
watch([imgCode, checked], ([imgCodeValue, checkedValue]) => {
  const userStore = useUserStoreHook();
  userStore.SET_VERIFYCODE(imgCodeValue);
  userStore.SET_ISREMEMBERED(checkedValue);
});
</script>

<template>
  <div class="select-none">
    <!-- <img :src="bg" class="wave" /> -->
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
      <!-- 国际化 -->
      <el-dropdown trigger="click">
        <globalization
          class="hover:text-primary hover:!bg-[transparent] w-[20px] h-[20px] ml-1.5 cursor-pointer outline-none duration-300"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <IconifyIconOffline
                v-show="locale === 'zh'"
                class="check-btn"
                :icon="Check"
              />
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'tw')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'tw')]"
              @click="translationTw"
            >
              <IconifyIconOffline
                v-show="locale === 'tw'"
                class="check-btn"
                :icon="Check"
              />
              繁體中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
              @click="translationEn"
            >
              <span v-show="locale === 'en'" class="check-btn">
                <IconifyIconOffline :icon="Check" />
              </span>
              English
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'ja')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'ja')]"
              @click="translationJa"
            >
              <span v-show="locale === 'ja'" class="check-btn">
                <IconifyIconOffline :icon="Check" />
              </span>
              日本語
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'ko')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'ko')]"
              @click="translationKo"
            >
              <span v-show="locale === 'ko'" class="check-btn">
                <IconifyIconOffline :icon="Check" />
              </span>
              한국어
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="login-container">
      <div class="flex items-center justify-right h-screen">
        <img :src="lgam" class="w-2/3" />
      </div>
      <div class="login-box flex justify-center items-center">
        <div class="login-form text-center">
          <!-- <avatar class="avatar" /> -->
          <img :src="logo" class="w-1/3" />
          <Motion>
            <h2 class="outline-none">
              <TypeIt
                :options="{ strings: [title], cursor: false, speed: 100 }"
              />
            </h2>
          </Motion>

          <!-- 登录表单 -->
          <el-form
            v-if="currentPage === 0"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item prop="verifyCode">
                <el-input
                  v-model="ruleForm.verifyCode"
                  clearable
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                >
                  <template v-slot:append>
                    <ReImageVerify v-model:code="imgCode" />
                  </template>
                </el-input>
              </el-form-item>
            </Motion>
            <!-- 谷歌验证码输入框 -->
            <Motion v-if="needGoogleAuth" :delay="200">
              <el-form-item prop="googleCode">
                <el-input
                  v-model="ruleForm.googleCode"
                  clearable
                  placeholder="请输入谷歌验证码"
                  :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                />
              </el-form-item>
            </Motion>
            <Motion :delay="250">
              <el-form-item>
                <div
                  class="w-full h-[20px] flex justify-between items-center mt-4"
                >
                  <el-checkbox v-model="checked">
                    <span class="flex">
                      记住密码
                      <IconifyIconOffline
                        v-tippy="{
                          content:
                            '勾选并登录后，清除缓存前无需输入用户名和密码会自动登入系统',
                          placement: 'top'
                        }"
                        :icon="Info"
                        class="ml-1"
                      />
                    </span>
                  </el-checkbox>
                  <el-button
                    link
                    type="primary"
                    @click="useUserStoreHook().SET_CURRENTPAGE(4)"
                  >
                    忘记密码?
                  </el-button>
                </div>
                <el-button
                  class="w-full mt-4"
                  size="default"
                  type="primary"
                  :loading="loading"
                  :disabled="disabled"
                  @click="onLogin(ruleFormRef)"
                >
                  登录
                </el-button>
              </el-form-item>
            </Motion>
          </el-form>
          <LoginUpdate v-if="currentPage === 4" />
        </div>
      </div>
      <div class="flex items-center h-screen">
        <img :src="rgam" class="w-2/3" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("./styles/login.css");

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-btn {
    position: absolute;
    left: 20px;
  }
}
</style>
