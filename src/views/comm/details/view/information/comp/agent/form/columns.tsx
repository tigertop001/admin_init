import type { AdaptiveConfig } from "@pureadmin/table";

export function useColumns() {
  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "代理UID",
      prop: "uid",
      width: 120,
      formatter: row => `${row.uid || "--"}`
    },
    {
      label: "代理账号",
      prop: "account",
      width: 200,
      formatter: row => `${row.account || "--"}`
    },
    {
      label: "层级",
      prop: "levelId",
      width: 140,
      formatter: row => `${row.levelId || "--"}`
    },
    {
      label: "直属下级",
      prop: "sons",
      width: 140,
      formatter: row => `${row.sons || "--"}`
    }
  ];

  /**
   * 自适应高度配置
   */
  const adapConf: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  return {
    columns,
    adapConf
  };
}
