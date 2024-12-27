import type { AdaptiveConfig } from "@pureadmin/table";
import { ref } from "vue";

export function useColumns() {
  /**
   * 基础数据
   */
  const dataList = ref([
    { real_name: "909090", address: "fdferere", invite_memberid: "uiuieruio" }
  ]);

  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "游戏名称",
      prop: "real_name",
      width: 120,
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "游戏帐号",
      prop: "address",
      width: 200,
      formatter: row => `${row.address || "--"}`
    },
    {
      label: "余额",
      prop: "invite_memberid",
      width: 140,
      formatter: row => `${row.invite_memberid || "--"}`
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  /**
   * 自适应高度配置
   */
  const adapConf: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  // 设置表格数据
  const setData = (data: any[]) => {
    dataList.value = data;
  };

  return {
    columns,
    dataList,
    adapConf,
    setData
  };
}
