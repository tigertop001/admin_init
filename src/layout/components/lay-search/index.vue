<script setup lang="ts">
import { useBoolean } from "../../hooks/useBoolean";
import SearchModal from "./components/SearchModal.vue";
import { useDark } from "@pureadmin/utils";

const { bool: show, toggle } = useBoolean();
const { isDark } = useDark();

function handleSearch() {
  toggle();
}
</script>

<template>
  <div>
    <div
      class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover"
      :class="isDark ? 'text-gray-300' : ''"
      @click="handleSearch"
    >
      <IconifyIconOffline icon="ri:search-line" />
    </div>
    <SearchModal v-model:value="show" />
  </div>
</template>
