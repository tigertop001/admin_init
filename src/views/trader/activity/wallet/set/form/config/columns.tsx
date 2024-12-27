import { ref } from "vue";
import type { PlusColumn, FieldValues } from "plus-pro-components";
import { useWalSet } from "../store";
import { message } from "@/utils/message";

const store = useWalSet();
export function useColumns() {
  // 定义初始状态
  const initialState = {
    isManualReview: null,
    auditMultiple: null,
    convertMode: null,
    minConvertAmount: null
  };

  // 使用初始状态初始化 state
  const state = ref<FieldValues>({ ...initialState });

  /**
   * 新增
   */
  const onAdd = async () => {
    try {
      // 直接使用 state.value 作为参数
      const params = state.value;
      const res = await store.add(params);
      let str = "新增";
      if (type) {
        str = "修改";
      }
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

  /**
   * 详情
   */
  const getInfo = async () => {
    try {
      const res = await store.info();
      if (res?.code === 0) {
        console.log("---");
        setData(res.data || {});
      } else {
        message(res?.msg || "获取信息失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取信息失败:", error);
      message("获取信息失败", { type: "error" });
    }
  };

  // 设置表格数据
  let type = false;
  const setData = data => {
    // 判断对象是否为空或者对象的值是否都为空
    const isEmptyObject = Object.keys(data).length === 0;
    const isAllValuesEmpty = Object.values(data).every(
      val => val == null || val === ""
    );

    if (isEmptyObject || isAllValuesEmpty) {
      console.log("数据为空或所有值为空");
      type = false; // Reset type to false if data is empty
    } else {
      console.log("数据有效，更新type");
      type = true; // Set type to true if data is not empty
      state.value = data;
    }
  };

  const onErr = (err: any) => {
    console.log(err, "err");
  };
  const onReset = () => {
    // 重置为初始值
    state.value = { ...initialState };
    // 可以添加重置成功的提示
    message("重置成功", { type: "success" });
  };

  const rules = {
    isManualReview: [
      {
        required: true,
        message: "请输入名称"
      }
    ]
  };

  const columns: PlusColumn[] = [
    {
      label: "是否人工审核",
      prop: "isManualReview",
      labelWidth: 120,
      valueType: "radio",
      options: [
        {
          label: "是(后台人工审核)",
          value: true
        },
        {
          label: "否(系统自动审核)",
          value: false
        }
      ]
    },
    {
      label: "稽核倍数",
      prop: "auditMultiple",
      labelWidth: 120,
      valueType: "input",
      tooltip: "活动钱包余额提款至账户主钱包稽核倍数"
    },
    {
      label: "提取方式",
      prop: "convertMode",
      labelWidth: 120,
      valueType: "radio",
      tooltip: "达到最低提取金额系统自动为玩家提取至账户主钱包",
      options: [
        {
          label: "系统全额自动提取",
          value: 1
        },
        {
          label: "系统部分自动提取",
          value: 2
        }
      ]
    },
    {
      label: "最低提取金额",
      prop: "minConvertAmount",
      labelWidth: 120,
      valueType: "input",
      tooltip: "提取方式为全额提取，该配置失效。"
    }
  ];

  return {
    columns,
    state,
    rules,
    onAdd,
    onErr,
    onReset,
    getInfo
  };
}
