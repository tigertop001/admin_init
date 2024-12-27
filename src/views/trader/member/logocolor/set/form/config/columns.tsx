import { ref, Fragment } from "vue";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemLGSet } from "../store";
const store = useMemLGSet();

// 初始查询参数
import { useSearch, crtDFS } from "./searchConfig";
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

const clrMap = {
  1: { text: "红色", color: "bg-red-500", texclr: "text-white" },
  2: { text: "蓝色", color: "bg-blue-500", texclr: "text-white" },
  3: { text: "绿色", color: "bg-green-500", texclr: "text-white" },
  4: { text: "紫色", color: "bg-purple-500", texclr: "text-white" },
  5: { text: "黄色", color: "bg-yellow-500", texclr: "text-white" },
  6: { text: "黑色", color: "bg-black", texclr: "text-white" },
  7: { text: "褐色", color: "bg-amber-600", texclr: "text-white" }
};

export function useColumns() {
  // 使用分页 hook
  const {
    loading,
    pagination,
    lodConf,
    adapConf,
    onSzChg,
    onCurChg,
    setLd,
    setTotal
  } = usePagination({
    onPageChange: params => {
      searchParam.value = {
        ...searchParam.value,
        ...params
      };
      getList(searchParam.value);
    }
  });

  /**
   * 基础数据
   */
  const dataList = ref([]);
  const editData = ref();
  const addVis = ref(false);
  const recVis = ref(false);
  const currRow = ref(null);

  // 更新状态
  const onStatChg = async (row: any, value: number) => {
    const oldValue = row.satus;
    try {
      row.satus = value; // 立即更新UI显示
      const params = {
        id: row.id,
        status: value
      };
      const res = await store.up(params);
      if (res?.code !== 0) {
        row.satus = oldValue;
        message(res?.msg || "更新失败", { type: "error" });
      }
    } catch (error) {
      row.satus = oldValue;
      message("更新失败", { type: "error" });
    }
  };

  // 记录当前正在编辑的行ID
  const editingId = ref<number | null>(null);

  // 临时存储编辑的值
  const tempRemark = ref("");

  // 开始编辑
  const stEdt = (row: any) => {
    editingId.value = row.id;
    tempRemark.value = row.remark || "";
  };

  // 更新备注
  const onRmkChg = async (row: any) => {
    try {
      const params = {
        id: row.id,
        remark: tempRemark.value
      };
      const res = await store.up(params);
      if (res?.code === 0) {
        message("备注更新成功", { type: "success" });
        row.remark = tempRemark.value;
        editingId.value = null; // 退出编辑状态
      } else {
        message(res?.msg || "更新失败", { type: "error" });
      }
    } catch (error) {
      console.error("更新失败:", error);
      message("更新失败", { type: "error" });
    }
  };

  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "序号",
      prop: "id",
      width: 100,
      cellRenderer: ({ index }) => <p>{index + 1}</p>
    },
    {
      label: "会员标识颜色",
      prop: "color",
      cellRenderer: ({ row }) => {
        const colorInfo = clrMap[row.color] || { color: "#808080" };
        return (
          <div class={`rounded ${colorInfo.color} ${colorInfo.texclr}`}>
            {colorInfo.text}
          </div>
        );
      }
    },
    {
      label: "用户数",
      prop: "users",
      formatter: row => `${row.users || "--"}`
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: ({ row }) => (
        <el-switch
          modelValue={row.satus === 1}
          onChange={value => onStatChg(row, value ? 1 : 2)}
          inlinePrompt
          activeText="正常"
          inactiveText="禁止"
          class="ml-2"
        />
      )
    },
    {
      label: "颜色备注",
      prop: "remark",
      cellRenderer: ({ row }) => {
        const isEditing = editingId.value === row.id;
        return (
          <div class="flex items-center gap-2">
            {isEditing ? (
              <Fragment>
                <el-input v-model={tempRemark.value} placeholder="请输入备注" />
                <el-button type="primary" link onClick={() => onRmkChg(row)}>
                  保存
                </el-button>
              </Fragment>
            ) : (
              <Fragment>
                <span>{row.remark}</span>
                <el-button type="primary" link onClick={() => stEdt(row)}>
                  修改
                </el-button>
              </Fragment>
            )}
          </div>
        );
      }
    },
    {
      label: "操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "操作时间",
      prop: "oprateTime",
      formatter: row =>
        `${fmtTs(row.oprateTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  /**
   * 数据处理方法
   */
  const getList = async (params = searchParam.value) => {
    try {
      const res = await store.list(params as object);
      if (res?.code === 0) {
        setData(res.data.list || [], res.data.total || 0);
      } else {
        setData([], 0);
        message("未找到数据", { type: "error" });
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  // 搜索参数更新
  const onPrmUp = (newParam: any) => {
    searchParam.value = newParam;
    getList(newParam);
  };

  /**
   * 弹窗相关方法
   */
  const shwAdd = () => {
    editData.value = null;
    setTimeout(() => {
      addVis.value = true;
    }, 0);
  };

  // 显示用户列表
  const shwUsrLst = (row: any) => {
    console.log("父组件: 显示用户列表", row);
    currRow.value = { ...row }; // 设置当前选中行
    recVis.value = true; // 显示弹窗
  };
  /**
   * CRUD 操作方法
   */
  const onUp = async (formValues: FieldValues) => {
    try {
      const params = {
        id: formValues.id
      };
      let res;
      res = await store.up(params);

      if (res?.code === 0) {
        message("操作成功", { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message("操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
    addVis.value = false;
  };

  /**
   * 设置表格数据
   */
  const setData = (data: any[], total: number) => {
    dataList.value = data;
    setTotal(total);
    setLd(false);
  };

  const fetchData = (row: any) => {
    const params = {
      id: row?.id,
      account: row?.account
    };
    getList(params);
  };
  return {
    loading,
    columns,
    dataList,
    pagination,
    lodConf,
    adapConf,
    editData,
    addVis,
    recVis,
    currRow,
    onSzChg,
    onCurChg,
    getList,
    onPrmUp,
    shwAdd,
    shwUsrLst,
    setData,
    onUp,
    fetchData
  };
}
