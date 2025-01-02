import { ref } from "vue";
import type { PlusColumn, FieldValues } from "plus-pro-components";
import { useFwSet } from "../store";
import { message } from "@/utils/message";

const store = useFwSet();

export function useColumns() {
  // 初始化状态
  const initialState = {
    withdrawEnabled: 2,
    auditNotPass: 2,
    minWithdrawAmount: "",
    feeRate: "",
    feeCap: "",
    exemptAuditAmount: "",
    maxWithdrawAmount: "",
    rechargeAuditMultiple: 1,
    withdrawDesc: ""
  };

  const state = ref<FieldValues>({ ...initialState });

  // 获取设置信息
  const getInfo = async () => {
    try {
      const res = await store.info();
      if (res?.code === 0) {
        state.value = res.data || initialState;
      } else {
        message(res?.msg || "获取信息失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取信息失败:", error);
      message("获取信息失败", { type: "error" });
    }
  };

  // 保存设置
  const onAdd = async () => {
    try {
      const res = await store.add(state.value);
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

  const columns: PlusColumn[] = [
    {
      label: "稽核未通过提款",
      prop: "auditNotPass",
      labelWidth: 140,
      valueType: "radio",
      rules: [{ required: true, message: "请选择设置开关" }],
      options: [
        { label: "启用", value: 1 },
        { label: "关闭", value: 2 }
      ]
    },
    {
      label: "充值稽核倍数",
      prop: "rechargeAuditMultiple",
      labelWidth: 140,
      valueType: "input-number",
      rules: [{ required: true, message: "请设置充值稽核倍数" }],
      fieldProps: {
        min: 0,
        precision: 0,
        controlsPosition: "right"
      }
    },
    {
      label: "最低提款金额",
      prop: "minWithdrawAmount",
      labelWidth: 140,
      valueType: "input-number",
      rules: [{ required: true, message: "请设置最低提款金额" }],
      fieldProps: {
        min: 0,
        precision: 2,
        controlsPosition: "right"
      }
    },
    {
      label: "最高提款金额",
      prop: "maxWithdrawAmount",
      labelWidth: 140,
      valueType: "input-number",
      rules: [{ required: true, message: "请设置最高提款金额" }],
      fieldProps: {
        min: 0,
        precision: 2,
        controlsPosition: "right"
      }
    },
    {
      label: "行政费率(%)",
      prop: "feeRate",
      labelWidth: 140,
      valueType: "input-number",
      rules: [{ required: true, message: "请设置行政费率" }],
      fieldProps: {
        min: 0,
        max: 100,
        precision: 2,
        controlsPosition: "right"
      }
    },
    {
      label: "行政费上限",
      prop: "feeCap",
      labelWidth: 140,
      valueType: "input-number",
      rules: [{ required: true, message: "请设置行政费上限" }],
      fieldProps: {
        min: 0,
        precision: 2,
        controlsPosition: "right"
      }
    },
    {
      label: "免稽核额度",
      prop: "exemptAuditAmount",
      labelWidth: 140,
      valueType: "input-number",
      rules: [{ required: true, message: "请设置免稽核额度" }],
      fieldProps: {
        min: 0,
        precision: 2,
        controlsPosition: "right"
      }
    },
    {
      label: "提现说明",
      prop: "withdrawDesc",
      labelWidth: 140,
      valueType: "textarea",
      fieldProps: {
        rows: 4,
        maxlength: 500,
        showWordLimit: true,
        placeholder: "请输入提现说明"
      }
    }
  ];

  const onErr = function (err: any) {
    console.error("表单验证失败:", err);
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
