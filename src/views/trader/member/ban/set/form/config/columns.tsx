import { ref, watch, onMounted } from "vue";
import { useMemBanSet } from "../store";
import { message } from "@/utils/message";

export function useColumns() {
  const store = useMemBanSet();

  // 初始化显示时间
  onMounted(() => {
    // 登录密码封禁时间初始化
    const loginSeconds = formData.value.loginPwdTimes;
    const loginUnit =
      timeOptions.find(
        option =>
          loginSeconds % option.value === 0 &&
          loginSeconds / option.value <= 999
      )?.value || 60;
    loginTimeUnit.value = loginUnit;
    displayLoginTime.value = loginSeconds / loginUnit;

    // 订单取消封禁时间初始化
    const orderSeconds = formData.value.orderCancelTimes;
    const orderUnit =
      timeOptions.find(
        option =>
          orderSeconds % option.value === 0 &&
          orderSeconds / option.value <= 999
      )?.value || 60;
    orderTimeUnit.value = orderUnit;
    displayOrderTime.value = orderSeconds / orderUnit;
  });

  // 表单数据
  const formData = ref({
    // 登录密码相关
    loginPwdChecked: true, // 选中状态，改用 boolean
    loginPwdCounts: 5,
    loginPwdAuto: 1, // 1:是 2:否
    loginPwdTimes: 300, // 存储秒数
    loginPwdNotice: "账户已被锁定，请10分钟后再试。",

    // 订单取消相关
    orderCancelChecked: true, // 选中状态，改用 boolean
    orderCancelCounts: 300,
    orderCancelAuto: 1, // 1:是 2:否
    orderCancelTimes: 600, // 存储秒数
    orderCancelNotice: "账户已被锁定，请联系在线客服处理。"
  });

  // 时间选择
  const timeOptions = [
    { label: "分钟", value: 60 },
    { label: "小时", value: 3600 },
    { label: "天", value: 86400 }
  ];

  // 选中的时间单位
  const loginTimeUnit = ref(60); // 默认分钟
  const orderTimeUnit = ref(60);

  // 实际显示的时间数值
  const displayLoginTime = ref(5);
  const displayOrderTime = ref(10);

  // 监听时间单位变化，转换秒数
  watch([displayLoginTime, loginTimeUnit], () => {
    formData.value.loginPwdTimes = displayLoginTime.value * loginTimeUnit.value;
  });

  watch([displayOrderTime, orderTimeUnit], () => {
    formData.value.orderCancelTimes =
      displayOrderTime.value * orderTimeUnit.value;
  });

  // 保存配置
  const saveConfig = async () => {
    try {
      const subData: any = {};

      // 如果登录密码错误选中
      if (formData.value.loginPwdChecked) {
        subData.loginPwdCounts = Number(formData.value.loginPwdCounts);
        subData.loginPwdAuto = Number(formData.value.loginPwdAuto);
        subData.loginPwdTimes = Number(formData.value.loginPwdTimes);
        subData.loginPwdNotice = formData.value.loginPwdNotice;
      }

      // 如果连续取消订单选中
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
