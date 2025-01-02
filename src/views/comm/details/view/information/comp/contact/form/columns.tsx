export function useColumns(data: any) {
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
