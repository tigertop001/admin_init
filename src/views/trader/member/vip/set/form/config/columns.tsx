import { ref, onMounted } from "vue";
import { clone } from "@pureadmin/utils";
import { useMemVipSet } from "../store";
import { message } from "@/utils/message";

export function useColumns() {
  const store = useMemVipSet();
  const editMap = ref({});
  const dataList = ref([]);

  // 获取列表数据
  const getList = async () => {
    try {
      const res = await store.list({});
      if (res?.code === 0) {
        dataList.value = res.data?.list || [];
      } else {
        message(res?.msg || "获取数据失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取列表失败:", error);
      message("获取列表失败", { type: "error" });
    }
  };

  const columns: columns = [
    {
      label: "序号",
      width: 60,
      cellRenderer: ({ index }) => <p>{index + 1}</p>
    },
    {
      label: "VIP等级",
      prop: "level",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input
              modelValue={editMap.value[index].level}
              onUpdate:modelValue={val => {
                editMap.value[index].level = val;
                row.level = val;
              }}
            />
          ) : (
            <p>{row.level}</p>
          )}
        </>
      )
    },
    {
      label: "晋级条件(累计有效投注)",
      prop: "upgradeCon",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input
              modelValue={editMap.value[index].upgradeCon}
              onUpdate:modelValue={val => {
                editMap.value[index].upgradeCon = val;
                row.upgradeCon = val;
              }}
            />
          ) : (
            <p>{row.upgradeCon}</p>
          )}
        </>
      )
    },
    {
      label: "VIP奖金",
      prop: "upgradeMoney",
      children: [
        {
          label: "晋级奖金",
          prop: "upgradeMoney",
          cellRenderer: ({ row, index }) => (
            <>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={editMap.value[index].upgradeMoney}
                  onUpdate:modelValue={val => {
                    editMap.value[index].upgradeMoney = val;
                    row.upgradeMoney = val;
                  }}
                />
              ) : (
                <p>{row.upgradeMoney}</p>
              )}
            </>
          )
        },
        {
          label: "周礼金",
          prop: "weekMoney",
          cellRenderer: ({ row, index }) => (
            <>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={editMap.value[index].weekMoney}
                  onUpdate:modelValue={val => {
                    editMap.value[index].weekMoney = val;
                    row.weekMoney = val;
                  }}
                />
              ) : (
                <p>{row.weekMoney}</p>
              )}
            </>
          )
        },
        {
          label: "月礼金",
          prop: "monthMoney",
          cellRenderer: ({ row, index }) => (
            <>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={editMap.value[index].monthMoney}
                  onUpdate:modelValue={val => {
                    editMap.value[index].monthMoney = val;
                    row.monthMoney = val;
                  }}
                />
              ) : (
                <p>{row.monthMoney}</p>
              )}
            </>
          )
        }
      ]
    },
    {
      label: "VIP特权",
      prop: "dayDrawTimes",
      children: [
        {
          label: "日提款次数",
          prop: "dayDrawTimes",
          cellRenderer: ({ row, index }) => (
            <>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={editMap.value[index].dayDrawTimes}
                  onUpdate:modelValue={val => {
                    editMap.value[index].dayDrawTimes = val;
                    row.dayDrawTimes = val;
                  }}
                />
              ) : (
                <p>{row.dayDrawTimes}</p>
              )}
            </>
          )
        },
        {
          label: "日提款金额",
          prop: "dayDrawMoney",
          cellRenderer: ({ row, index }) => (
            <>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={editMap.value[index].dayDrawMoney}
                  onUpdate:modelValue={val => {
                    editMap.value[index].dayDrawMoney = val;
                    row.dayDrawMoney = val;
                  }}
                />
              ) : (
                <p>{row.dayDrawMoney}</p>
              )}
            </>
          )
        }
      ]
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  function onAdd() {
    const newIndex = dataList.value.length;
    const newRow = {
      id: newIndex + 1,
      level: "",
      upgradeCon: "",
      upgradeMoney: "",
      weekMoney: "",
      monthMoney: "",
      dayDrawTimes: "",
      dayDrawMoney: ""
    };
    dataList.value.push(newRow);
    editMap.value[newIndex] = { ...newRow, editable: true, isNew: true };
  }

  // 删除行
  async function onDel(row) {
    try {
      const res = await store.del({ id: Number(row.id) });
      if (res?.code === 0) {
        message("删除成功", { type: "success" });
        getList(); // 重新获取列表
      } else {
        message(res?.msg || "删除失败", { type: "error" });
      }
    } catch (error) {
      console.error("删除失败:", error);
      message("删除失败", { type: "error" });
    }
  }

  // 编辑行
  function onEdit(row, index) {
    editMap.value[index] = Object.assign({ ...row, editable: true });
  }

  // 保存编辑或新增
  async function onSave(index) {
    const currentData = editMap.value[index];
    const subData = {
      level: String(currentData.level).trim(),
      upgradeCon: Number(currentData.upgradeCon),
      upgradeMoney: Number(currentData.upgradeMoney),
      weekMoney: Number(currentData.weekMoney),
      monthMoney: Number(currentData.monthMoney),
      dayDrawTimes: Number(currentData.dayDrawTimes),
      dayDrawMoney: Number(currentData.dayDrawMoney)
    };

    // 验证必填字段
    if (!subData.level) {
      message("请填写VIP等级", { type: "warning" });
      return;
    }

    // 验证其他数字类型字段
    const numberFields = {
      upgradeCon: "晋级条件",
      upgradeMoney: "晋级奖金",
      weekMoney: "周礼金",
      monthMoney: "月礼金",
      dayDrawTimes: "日提款次数",
      dayDrawMoney: "日提款金额"
    };

    for (const [field, label] of Object.entries(numberFields)) {
      if (!subData[field] && subData[field] !== 0) {
        message(`请填写${label}`, { type: "warning" });
        return;
      }
    }

    try {
      let res;
      if (currentData.isNew) {
        // 新增
        res = await store.add(subData);
      } else {
        // 编辑
        res = await store.edit({
          ...subData,
          id: currentData.id
        });
      }

      if (res?.code === 0) {
        message(`${currentData.isNew ? "新增" : "修改"}成功`, {
          type: "success"
        });
        await getList(); // 刷新列表

        // 重置编辑状态
        if (currentData.isNew) {
          editMap.value[index] = {
            ...currentData,
            isNew: false, // 新增成功后设置为非新增状态
            editable: false // 关闭编辑状态
          };
        }
      } else {
        message(res?.msg || `${currentData.isNew ? "新增" : "修改"}失败`, {
          type: "error"
        });
      }
    } catch (error) {
      console.error(`${currentData.isNew ? "新增" : "修改"}失败:`, error);
      message(`${currentData.isNew ? "新增" : "修改"}失败`, { type: "error" });
    }
  }

  // 取消编辑或新增
  function onCxl(index) {
    if (editMap.value[index].isNew) {
      dataList.value.splice(index, 1);
    } else {
      dataList.value[index] = clone(dataList.value[index], true);
    }
    editMap.value[index] = undefined;
  }

  onMounted(() => {
    getList();
  });

  return {
    editMap,
    columns,
    dataList,
    onAdd,
    onDel,
    onEdit,
    onSave,
    onCxl
  };
}
