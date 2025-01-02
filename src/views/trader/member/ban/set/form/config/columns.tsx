import { ref, watch, onMounted } from "vue";
import { useMemBanSet } from "../store";
import { message } from "@/utils/message";

export function useColumns() {
  const store = useMemBanSet();

  onMounted(() => {
    const loginSeconds = formData.value.loginPwdTimes;
    const loginUnit =
      timeOptions.find(
        option =>
          loginSeconds % option.value === 0 &&
          loginSeconds / option.value <= 999
      )?.value || 60;
    loginTimeUnit.value = loginUnit;
    displayLoginTime.value = loginSeconds / loginUnit;

    const orderSeconds = formData.value.orderCancelTimes;
    const orderUnit =
      timeOptions.find(
        option =>
          orderSeconds % option.value === 0 &&
          orderSeconds / option.value <= 999
      )?.value || 60;
    orderTimeUnit.value = orderUnit;
    displayOrderTime.value = orderSeconds / orderUnit;

    getInfo();
  });

  interface Option<T = any> {
    value: T;
    text: string;
  }
  interface BaseObject {
    [key: string]: Option | string | number | boolean | null;
  }
  const infoData = ref<BaseObject>({});

  const getInfo = async () => {
    try {
      const res = await store.info();
      if (res?.code === 0) {
        infoData.value = res.data;
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  const formData = ref({
    loginPwdChecked: true,
    loginPwdCounts: 5,
    loginPwdAuto: 1,
    loginPwdTimes: 300,
    loginPwdNotice: "账户已被锁定，请10分钟后再试。",

    orderCancelChecked: true,
    orderCancelCounts: 300,
    orderCancelAuto: 1,
    orderCancelTimes: 600,
    orderCancelNotice: "账户已被锁定，请联系在线客服处理。"
  });

  const timeOptions = [
    { label: "分钟", value: 60 },
    { label: "小时", value: 3600 },
    { label: "天", value: 86400 }
  ];

  const loginTimeUnit = ref(60);
  const orderTimeUnit = ref(60);

  const displayLoginTime = ref(5);
  const displayOrderTime = ref(10);

  watch([displayLoginTime, loginTimeUnit], () => {
    formData.value.loginPwdTimes = displayLoginTime.value * loginTimeUnit.value;
  });

  watch([displayOrderTime, orderTimeUnit], () => {
    formData.value.orderCancelTimes =
      displayOrderTime.value * orderTimeUnit.value;
  });

  const saveConfig = async () => {
    try {
      const subData: any = {};

      if (formData.value.loginPwdChecked) {
        subData.loginPwdCounts = Number(formData.value.loginPwdCounts);
        subData.loginPwdAuto = Number(formData.value.loginPwdAuto);
        subData.loginPwdTimes = Number(formData.value.loginPwdTimes);
        subData.loginPwdNotice = formData.value.loginPwdNotice;
      }

      if (formData.value.orderCancelChecked) {
        subData.orderCancelCounts = Number(formData.value.orderCancelCounts);
        subData.orderCancelAuto = Number(formData.value.orderCancelAuto);
        subData.orderCancelTimes = Number(formData.value.orderCancelTimes);
        subData.orderCancelNotice = formData.value.orderCancelNotice;
      }

      if (Object.keys(subData).length === 0) {
        message("请至少选择一项配置", { type: "warning" });
        return;
      }

      const res = await store.set(subData);
      if (res?.code === 0) {
        message("保存成功", { type: "success" });
      } else {
        message(res?.msg || "保存失败", { type: "error" });
      }
    } catch (error) {
      console.error("保存失败:", error);
      message("保存失败", { type: "error" });
    }
  };

  return {
    formData,
    timeOptions,
    loginTimeUnit,
    orderTimeUnit,
    displayLoginTime,
    displayOrderTime,
    saveConfig
  };
}
