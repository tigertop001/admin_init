<script setup lang="ts">
import flippers from "./filpper";
import { ref, unref, nextTick, onUnmounted } from "vue";

defineOptions({
  name: "ReFlop"
});

const timer = ref(null);
const flipObjs = ref([]);

const flipperHour1 = ref();
const flipperHour2 = ref();
const flipperMinute1 = ref();
const flipperMinute2 = ref();
const flipperSecond1 = ref();
const flipperSecond2 = ref();

const init = () => {
  const now = new Date();
  const nowTimeStr = formatDate(new Date(now.getTime()), "hhiiss");
  for (let i = 0; i < flipObjs.value.length; i++) {
    flipObjs?.value[i]?.setFront(nowTimeStr[i]);
  }
};

const run = () => {
  timer.value = setInterval(() => {
    const now = new Date();
    const nowTimeStr = formatDate(new Date(now.getTime() - 1000), "hhiiss");
    const nextTimeStr = formatDate(now, "hhiiss");
    for (let i = 0; i < flipObjs.value.length; i++) {
      if (nowTimeStr[i] === nextTimeStr[i]) {
        continue;
      }
      flipObjs?.value[i]?.flipDown(nowTimeStr[i], nextTimeStr[i]);
    }
  }, 1000);
};

const formatDate = (date: Date, dateFormat: string) => {
  if (/(y+)/.test(dateFormat)) {
    dateFormat = dateFormat.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  const o = {
    "m+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "i+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(dateFormat)) {
      const str = o[k] + "";
      dateFormat = dateFormat.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return dateFormat;
};

const padLeftZero = (str: string | any[]) => {
  return ("00" + str).substr(str.length);
};

nextTick(() => {
  flipObjs.value = [
    unref(flipperHour1),
    unref(flipperHour2),
    unref(flipperMinute1),
    unref(flipperMinute2),
    unref(flipperSecond1),
    unref(flipperSecond2)
  ];

  init();
  run();
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});
</script>

<template>
  <div class="flip-clock">
    <flippers ref="flipperHour1" />
    <flippers ref="flipperHour2" />
    <em>:</em>
    <flippers ref="flipperMinute1" />
    <flippers ref="flipperMinute2" />
    <em>:</em>
    <flippers ref="flipperSecond1" />
    <flippers ref="flipperSecond2" />
  </div>
</template>

<style>
.flip-clock .m-flipper {
  margin: 0 3px;
}

.flip-clock em {
  display: inline-block;
  font-size: 66px;
  font-style: normal;
  line-height: 102px;
  vertical-align: top;
}
</style>
