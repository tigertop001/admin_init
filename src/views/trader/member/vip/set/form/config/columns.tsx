import { ref, onMounted, Fragment } from "vue";
import { clone } from "@pureadmin/utils";
import { useMemVipSet } from "../store";
import { message } from "@/utils/message";
import { get } from "lodash";

export function useColumns() {
  const store = useMemVipSet();
  const editMap = ref({});
  const dtLst = ref([]);

  const getList = async () => {
    try {
      const res = await store.list({});
      if (res?.code === 0) {
        dtLst.value = res.data?.list || [];
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
        <Fragment>
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
        </Fragment>
      )
    },
    {
      label: "晋级条件(累计有效投注)",
      prop: "config",
      cellRenderer: ({ row, index }) => (
        <Fragment>
          {editMap.value[index]?.editable ? (
            <el-input
              modelValue={editMap.value[index].config.betUpgrade}
              onUpdate:modelValue={val => {
                editMap.value[index].config.betUpgrade = val;
                row.config.betUpgrade = val;
              }}
            />
          ) : (
            <p>{row.config.betUpgrade}</p>
          )}
        </Fragment>
      )
    },
    {
      label: "VIP奖金",
      prop: "reward",
      children: [
        {
          label: "晋级奖金",
          prop: "reward",
          cellRenderer: ({ row, index }) => (
            <Fragment>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={
                    editMap.value[index].config.reward.levelReward.amount
                  }
                  onUpdate:modelValue={val => {
                    // 保持原有的 amountCode
                    editMap.value[index].config.reward.levelReward = {
                      amount: val,
                      amountCode: row.config.reward.levelReward.amountCode
                    };
                    row.config.reward.levelReward = {
                      amount: val,
                      amountCode: row.config.reward.levelReward.amountCode
                    };
                  }}
                />
              ) : (
                <p>{row.config.reward.levelReward.amount}</p>
              )}
            </Fragment>
          )
        },
        {
          label: "周礼金",
          prop: "weekMoney",
          cellRenderer: ({ row, index }) => (
            <Fragment>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={
                    editMap.value[index].config.reward.weeklyReward.amount
                  }
                  onUpdate:modelValue={val => {
                    editMap.value[index].config.reward.weeklyReward = {
                      amount: val,
                      amountCode: row.config.reward.weeklyReward.amountCode
                    };
                    row.config.reward.weeklyReward = {
                      amount: val,
                      amountCode: row.config.reward.weeklyReward.amountCode
                    };
                  }}
                />
              ) : (
                <p>{row.config.reward.weeklyReward.amount}</p>
              )}
            </Fragment>
          )
        },
        {
          label: "月礼金",
          prop: "monthMoney",
          cellRenderer: ({ row, index }) => (
            <Fragment>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={
                    editMap.value[index].config.reward.monthlyReward.amount
                  }
                  onUpdate:modelValue={val => {
                    editMap.value[index].config.reward.monthlyReward = {
                      amount: val,
                      amountCode: row.config.reward.monthlyReward.amountCode
                    };
                    row.config.reward.monthlyReward = {
                      amount: val,
                      amountCode: row.config.reward.monthlyReward.amountCode
                    };
                  }}
                />
              ) : (
                <p>{row.config.reward.monthlyReward.amount}</p>
              )}
            </Fragment>
          )
        }
      ]
    },
    {
      label: "VIP特权",
      prop: "config",
      children: [
        {
          label: "日提款次数",
          prop: "dailyWithdrawTimes",
          cellRenderer: ({ row, index }) => (
            <Fragment>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={editMap.value[index].config.dailyWithdrawTimes}
                  onUpdate:modelValue={val => {
                    editMap.value[index].config.dailyWithdrawTimes = val;
                    row.config.dailyWithdrawTimes = val;
                  }}
                />
              ) : (
                <p>{row.config.dailyWithdrawTimes}</p>
              )}
            </Fragment>
          )
        },
        {
          label: "日提款金额",
          prop: "dailyWithdrawQuota",
          cellRenderer: ({ row, index }) => (
            <Fragment>
              {editMap.value[index]?.editable ? (
                <el-input
                  modelValue={editMap.value[index].config.dailyWithdrawQuota}
                  onUpdate:modelValue={val => {
                    editMap.value[index].config.dailyWithdrawQuota = val;
                    row.config.dailyWithdrawQuota = val;
                  }}
                />
              ) : (
                <p>{row.config.dailyWithdrawQuota}</p>
              )}
            </Fragment>
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
    const newIndex = dtLst.value.length;
    const level = dtLst.value.length + 1;

    const newRow = {
      id: newIndex + 1,
      bizId: `VIP${level}`,
      level: level,
      config: {
        betUpgrade: "",
        rechargeUpgrade: "",
        dailyWithdrawTimes: "",
        dailyWithdrawQuota: "",
        reward: {
          levelReward: { amount: "", amountCode: 1 },
          weeklyReward: { amount: "", amountCode: 1 },
          monthlyReward: { amount: "", amountCode: 1 }
        }
      }
    };

    dtLst.value.push(newRow);
    editMap.value[newIndex] = { ...newRow, editable: true, isNew: true };
  }

  async function onDel(row) {
    try {
      const res = await store.del({ id: Number(row.id) });
      if (res?.code === 0) {
        message("删除成功", { type: "success" });
        getList();
      } else {
        message(res?.msg || "删除失败", { type: "error" });
      }
    } catch (error) {
      console.error("删除失败:", error);
      message("删除失败", { type: "error" });
    }
  }

  function onEdit(row, index) {
    editMap.value[index] = Object.assign({ ...row, editable: true });
  }

  async function onSave(index) {
    const currentData = editMap.value[index];

    if (!currentData.level) {
      message("请填写VIP等级", { type: "warning" });
      return;
    }

    // 构建提交数据，使用编辑框中的值
    const subData = {
      bizId: `VIP${currentData.level}`,
      level: Number(currentData.level),
      config: {
        betUpgrade: currentData.config.betUpgrade || "0",
        rechargeUpgrade: currentData.config.rechargeUpgrade || "0",
        dailyWithdrawTimes: Number(currentData.config.dailyWithdrawTimes || 0),
        dailyWithdrawQuota: currentData.config.dailyWithdrawQuota || "0",
        reward: {
          levelReward: {
            amount: currentData.config.reward.levelReward.amount || "0",
            amountCode: currentData.config.reward.levelReward.amountCode
          },
          weeklyReward: {
            amount: currentData.config.reward.weeklyReward.amount || "0",
            amountCode: currentData.config.reward.weeklyReward.amountCode
          },
          monthlyReward: {
            amount: currentData.config.reward.monthlyReward.amount || "0",
            amountCode: currentData.config.reward.monthlyReward.amountCode
          }
        }
      }
    };

    if (!subData.level) {
      message("请填写VIP等级", { type: "warning" });
      return;
    }

    const requiredFields = {
      "config.betUpgrade": "晋级条件",
      "config.dailyWithdrawTimes": "日提款次数",
      "config.dailyWithdrawQuota": "日提款金额",
      "config.reward.levelReward.amount": "晋级奖金",
      "config.reward.weeklyReward.amount": "周礼金",
      "config.reward.monthlyReward.amount": "月礼金"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      const value = get(currentData, field);
      if (value === undefined || value === "" || value === null) {
        message(`请填写${label}`, { type: "warning" });
        return;
      }
    }
    try {
      let res;
      if (currentData.isNew) {
        res = await store.add(subData);
      } else {
        res = await store.edit({
          ...subData,
          id: currentData.id
        });
      }

      if (res?.code === 0) {
        message(`${currentData.isNew ? "新增" : "修改"}成功`, {
          type: "success"
        });
        await getList();
        editMap.value[index] = {
          ...currentData,
          isNew: false,
          editable: false
        };
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

  function onCxl(index) {
    if (editMap.value[index].isNew) {
      dtLst.value.splice(index, 1);
    } else {
      dtLst.value[index] = clone(dtLst.value[index], true);
    }
    editMap.value[index] = undefined;
  }

  onMounted(() => {
    getList();
  });

  return {
    editMap,
    columns,
    dtLst,
    onAdd,
    onDel,
    onEdit,
    onSave,
    onCxl
  };
}
