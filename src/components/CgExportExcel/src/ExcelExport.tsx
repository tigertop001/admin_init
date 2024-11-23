import { utils, writeFile } from "xlsx";
import { message } from "@/utils/message";

export default {
  exportToExcel(props: { columns: any[]; data: any[]; fileName?: string }) {
    const formatColumnValue = (column: any, row: any): string => {
      if (column.cellRenderer) {
        // 获取 cellRenderer 函数的字符串形式
        const fnStr = column.cellRenderer.toString();

        // 提取 row.xxx 形式的字段引用
        const fieldMatches = fnStr.match(/row\.([\w_]+)/g) || [];
        const fields = fieldMatches.map(match => match.split(".")[1]);

        // 如果找到字段引用，直接拼接数据
        if (fields.length > 0) {
          return fields
            .map(field => {
              const value = row[field];
              // 处理布尔值和数字
              if (typeof value === "boolean") {
                return value ? "是" : "否";
              }
              return value || "--";
            })
            .join("/");
        }

        // 如果没找到字段引用，回退到JSX解析
        const rendered = column.cellRenderer({ row } as any);
        const extractTextContent = (element: any): string => {
          if (!element) return "--";
          if (typeof element === "string") return element;
          if (Array.isArray(element)) {
            return element.map(el => extractTextContent(el)).join("");
          }
          if (element.props) {
            const children = element.props.children;
            if (Array.isArray(children)) {
              return children.map(extractTextContent).join("");
            }
            return extractTextContent(children);
          }
          if (element.children) {
            return extractTextContent(element.children);
          }
          return String(element);
        };
        return extractTextContent(rendered);
      }

      if (column.formatter) {
        return column.formatter(row);
      }

      return row[column.prop] || "--";
    };

    const exportColumns = props.columns.filter(
      (col: any) => col.prop && col.prop !== "operation"
    );
    const res = props.data.map(row =>
      exportColumns.map(col => formatColumnValue(col, row))
    );

    const titleList = exportColumns.map((col: any) => col.label);
    res.unshift(titleList);

    const workSheet = utils.aoa_to_sheet(res);
    const workBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, "数据报表");
    writeFile(workBook, `${props.fileName || "table"}.xlsx`);
    message("导出成功", { type: "success" });
  }
};
