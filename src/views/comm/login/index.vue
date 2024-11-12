<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import TypeIt from "@/components/ReTypeit";
import { debounce } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useEventListener } from "@vueuse/core";
import type { FormInstance } from "element-plus";
// import { $t, transformI18n } from "@/plugins/i18n";
import { operates, thirdParty } from "./utils/enums";
import { useLayout } from "@/layout/hooks/useLayout";
// import LoginPhone from "./components/LoginPhone.vue";
// import LoginRegist from "./components/LoginRegist.vue";
import LoginUpdate from "./components/LoginUpdate.vue";
// import LoginQrCode from "./components/LoginQrCode.vue";
import { useUserStoreHook } from "@/views/comm/login/store/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { ReImageVerify } from "@/components/ReImageVerify";
import { ref, toRaw, reactive, watch, computed } from "vue";
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
import Tenant from "@iconify-icons/ri/home-gear-line";

defineOptions({
  name: "Login"
});

const imgCode = ref("");
const loginDay = ref(7);
const router = useRouter();
const loading = ref(false);
const checked = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();
const currentPage = computed(() => useUserStoreHook().currentPage);

const { t } = useI18n();
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
const { VITE_ENABLE_TENANT } = import.meta.env;

const ruleForm = reactive({
  // tenant: "admin",
  username: "admin",
  password: "admin123",
  verifyCode: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({ username: ruleForm.username, password: "admin123" })
        .then(res => {
          if (res.success) {
            return initRouter().then(() => {
              disabled.value = true;
              router
                .push(getTopMenu(true).path)
                .then(() => {
                  message("登录成功", { type: "success" });
                })
                .finally(() => (disabled.value = false));
            });
          } else {
            message("登录失败", { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
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
watch(
  [imgCode, checked, loginDay],
  ([imgCodeValue, checkedValue, loginDayValue]) => {
    const userStore = useUserStoreHook();
    userStore.SET_VERIFYCODE(imgCodeValue);
    userStore.SET_ISREMEMBERED(checkedValue);
    userStore.SET_LOGINDAY(loginDayValue);
  }
);
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
      <div class="flex items-end h-screen">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box flex justify-center items-center">
        <div class="login-form text-center">
          <avatar class="avatar" />
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
            <!-- <Motion v-if="VITE_ENABLE_TENANT === 'true'">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '租户名',
                    trigger: 'blur'
                  }
                ]"
                prop="tenant"
              >
                <el-input
                  v-model="ruleForm.tenant"
                  clearable
                  placeholder="租户名"
                  :prefix-icon="useRenderIcon(Tenant)"
                />
              </el-form-item>
            </Motion> -->

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

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-checkbox v-model="checked">
                    <span class="flex">
                      <select
                        v-model="loginDay"
                        :style="{
                          width: loginDay < 10 ? '10px' : '16px',
                          outline: 'none',
                          background: 'none',
                          appearance: 'none'
                        }"
                      >
                        <option value="1">1</option>
                        <option value="7">7</option>
                        <option value="30">30</option>
                      </select>
                      天内免登录
                      <IconifyIconOffline
                        v-tippy="{
                          content:
                            '勾选并登录后，规定天数内无需输入用户名和密码会自动登入系统',
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

            <!-- <Motion :delay="300">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button
                    v-for="(item, index) in operates"
                    :key="index"
                    class="w-full mt-4"
                    size="default"
                    @click="useUserStoreHook().SET_CURRENTPAGE(index + 1)"
                  >
                    {{ t(item.title) }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion> -->
          </el-form>

          <!-- <Motion v-if="currentPage === 0" :delay="350">
            <el-form-item>
              <el-divider>
                <p class="text-gray-500 text-xs">第三方登录</p>
              </el-divider>
              <div class="w-full flex justify-evenly">
                <span
                  v-for="(item, index) in thirdParty"
                  :key="index"
                  :title="t(item.title)"
                >
                  <IconifyIconOnline
                    :icon="`ri:${item.icon}-fill`"
                    width="20"
                    class="cursor-pointer text-gray-500 hover:text-blue-400"
                  />
                </span>
              </div>
            </el-form-item>
          </Motion> -->
          <!-- 手机号登录  -->
          <!-- <LoginPhone v-if="currentPage === 1" /> -->
          <!-- 二维码登录  -->
          <!-- <LoginQrCode v-if="currentPage === 2" /> -->
          <!-- 注册 -->
          <!-- <LoginRegist v-if="currentPage === 3" /> -->
          <!-- 忘记密码 -->
          <LoginUpdate v-if="currentPage === 4" />
        </div>
      </div>
      <div class="flex items-end h-screen">
        <component :is="toRaw(illustration)" />
      </div>
    </div>

    <!-- <div
      class="w-full flex-c absolute bottom-3 text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(220,220,242,0.8)]"
    >
      Copyright © 2024-admin
      <a
        class="hover:text-primary"
        href="https://github.com/pure-admin"
        target="_blank"
      >
        &nbsp;{{ title }}
      </a>
    </div> -->
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
