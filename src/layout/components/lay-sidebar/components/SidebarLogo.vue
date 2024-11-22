<script setup lang="ts">
import { getTopMenu } from "@/router/utils";
import { useNav } from "@/layout/hooks/useNav";
import Logo from "@/assets/svg/logo.svg?component";
import { useDark } from "@pureadmin/utils";

defineProps({
  collapse: Boolean
});

const { title } = useNav();
const { isDark } = useDark();
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapses: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        :title="title"
        class="sidebar-logo-link"
        :to="getTopMenu()?.path ?? '/'"
      >
        <div class="w-10 h-full flex items-center justify-center">
          <Logo
            :style="{
              fill: isDark ? 'rgb(209 213 219)' : 'rgb(59 130 246)',
              color: isDark ? 'rgb(209 213 219)' : 'rgb(59 130 246)',
              width: '30px'
            }"
          />
        </div>
        <span class="sidebar-title">{{ title }}</span>
      </router-link>
      <router-link
        v-else
        key="expand"
        :title="title"
        class="sidebar-logo-link"
        :to="getTopMenu()?.path ?? '/'"
      >
        <div class="w-8 h-8 ml-2 flex items-center justify-center">
          <Logo
            :style="{
              fill: isDark ? 'rgb(209 213 219)' : 'rgb(59 130 246)',
              color: isDark ? 'rgb(209 213 219)' : 'rgb(59 130 246)'
            }"
          />
        </div>
        <span class="sidebar-title">{{ title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;

  .sidebar-logo-link {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 100%;
    padding-left: 10px;

    img {
      display: inline-block;
      height: 32px;
    }

    .sidebar-title {
      display: inline-block;
      height: 32px;
      margin: 2px 0 0 12px;
      overflow: hidden;
      font-size: 18px;
      font-weight: 600;
      line-height: 32px;
      color: $subMenuActiveText;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
