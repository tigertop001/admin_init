import { ref, watch, onMounted } from "vue";
import { useMemBanSet } from "../store";
import { message } from "@/utils/message";

export function useColumns() {
  const store = useMemBanSet();

  const formData = ref({
    loginPwdChecked: true,
    loginPwdCounts: null,
    loginPwdAuto: 1,
    loginPwdTimes: null,
    loginPwdNotice: null,

    orderCancelChecked: true,
    orderCancelCounts: null,
    orderCancelAuto: 1,
    orderCancelTimes: null,
    orderCancelNotice: null
  });

  const timeOptions = [
    { label: "分钟", value: 60 },
    { label: "小时", value: 3600 },
    { label: "天", value: 86400 }
  ];

  const loginTimeUnit = ref(60);
  const orderTimeUnit = ref(60);
  const displayLoginTime = ref(null);
  const displayOrderTime = ref(null);

  const updateDisplayTimes = () => {
    const loginSeconds = formData.value.loginPwdTimes;
    if (loginSeconds) {
      const loginUnit =
        timeOptions.find(
          option =>
            loginSeconds % option.value === 0 &&
            loginSeconds / option.value <= 999
        )?.value || 60;
      loginTimeUnit.value = loginUnit;
      displayLoginTime.value = loginSeconds / loginUnit;
    }

    const orderSeconds = formData.value.orderCancelTimes;
    if (orderSeconds) {
      const orderUnit =
        timeOptions.find(
          option =>
            orderSeconds % option.value === 0 &&
            orderSeconds / option.value <= 999
        )?.value || 60;
      orderTimeUnit.value = orderUnit;
      displayOrderTime.value = orderSeconds / orderUnit;
    }
  };

  const getInfo = async () => {
    try {
      const res = await store.info();
      if (res?.code === 0 && res.data?.list) {
        const { login, cancleOrder } = res.data.list;

        if (login) {
          formData.value.loginPwdCounts = login.counts || null;
          formData.value.loginPwdAuto = login.isAuto || 1;
          formData.value.loginPwdTimes = login.times || null;
          formData.value.loginPwdNotice = login.notice || null;
        }

        if (cancleOrder) {
          formData.value.orderCancelCounts = cancleOrder.counts || null;
          formData.value.orderCancelAuto = cancleOrder.isAuto || 1;
          formData.value.orderCancelTimes = cancleOrder.times || null;
          formData.value.orderCancelNotice = cancleOrder.notice || null;
        }

        updateDisplayTimes();
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  watch([displayLoginTime, loginTimeUnit], () => {
    if (displayLoginTime.value && loginTimeUnit.value) {
      formData.value.loginPwdTimes =
        displayLoginTime.value * loginTimeUnit.value;
    }
  });

  watch([displayOrderTime, orderTimeUnit], () => {
    if (displayOrderTime.value && orderTimeUnit.value) {
      formData.value.orderCancelTimes =
        displayOrderTime.value * orderTimeUnit.value;
    }
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

  onMounted(() => {
    getInfo();
  });

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
