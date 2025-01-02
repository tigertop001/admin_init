import { ref } from "vue";
import type { PlusColumn, FieldValues } from "plus-pro-components";
import { useFdSet } from "../store";
import { message } from "@/utils/message";

const store = useFdSet();
export function useColumns() {
  const initialState = {
    rechargeEnabled: null,
    rechargeRequirePhone: 2,
    rechargeRequireName: 2,
    rechargeRequireAccount: 2,
    rechargeDesc: ""
  };

  const state = ref<FieldValues>({ ...initialState });

  const onCbChg = (values: any) => {
    state.value.rechargeRequirePhone = 2;
    state.value.rechargeRequireName = 2;
    state.value.rechargeRequireAccount = 2;

    if (values.includes(1)) state.value.rechargeRequirePhone = 1;
    if (values.includes(2)) state.value.rechargeRequireName = 1;
    if (values.includes(3)) state.value.rechargeRequireAccount = 1;
  };

  const onAdd = async () => {
    try {
      const res = await store.add(state.value);
      const str = type ? "修改" : "新增";

      if (res?.code === 0) {
        message(`${str}成功`, { type: "success", showClose: true });
      } else {
        message(`${str}失败`, { type: "error" });
      }
    } catch (error) {
      console.error("失败:", error);
      message("失败", { type: "error" });
    }
  };

  const getInfo = async () => {
    try {
      const res = await store.info();
      if (res?.code === 0) {
        setData(res.data || {});
      } else {
        message(res?.msg || "获取信息失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取信息失败:", error);
      message("获取信息失败", { type: "error" });
    }
  };

  let type = false;
  const setData = (data: any) => {
    const isEmptyObject = Object.keys(data).length === 0;
    const isAllValuesEmpty = Object.values(data).every(
      val => val == null || val === ""
    );

    if (isEmptyObject || isAllValuesEmpty) {
      type = false;
    } else {
      type = true;
      const checkboxValues = [];
      if (data.rechargeRequirePhone === 1) checkboxValues.push(1);
      if (data.rechargeRequireName === 1) checkboxValues.push(2);
      if (data.rechargeRequireAccount === 1) checkboxValues.push(3);

      state.value = {
        ...data,
        auditMultiple: checkboxValues
      };
    }
  };

  const columns: PlusColumn[] = [
    {
      label: "设置开关",
      prop: "rechargeEnabled",
      labelWidth: 120,
      valueType: "radio",
      rules: [{ required: true, message: "请选择设置开关" }],
      options: [
        { label: "启用", value: 1 },
        { label: "关闭", value: 2 }
      ]
    },
    {
      label: "设置开关",
      prop: "auditMultiple",
      labelWidth: 120,
      valueType: "checkbox",
      options: [
        { label: "绑定手机号", value: 1 },
        { label: "绑定姓名", value: 2 },
        { label: "绑定提现账户", value: 3 }
      ],
      onChange: onCbChg
    },
    {
      label: "充值说明",
      prop: "rechargeDesc",
      labelWidth: 120,
      valueType: "textarea",
      tooltip: "提取方式为全额提取，该配置失效。"
    }
  ];

  const onErr = function (err: any) {
    console.log(err, "err");
  };
  return {
    columns,
    state,
    onAdd,
    onErr,
    onReset: () => {
      state.value = { ...initialState };
      message("重置成功", { type: "success" });
    },
    getInfo
  };
}
