export function useColumns(data: any) {
  /**
   * 表格列配置
   */
  const columnData = [
    {
      id: 1,
      title: "手机号",
      value: data.phoneNum
    },
    {
      id: 4,
      title: "邮箱号",
      value: data.email
    }
  ];

  return {
    columnData
  };
}
