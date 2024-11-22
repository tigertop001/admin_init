import { utils, writeFile } from "xlsx";
import { message } from "@/utils/message";

export default {
  exportToExcel(props: { columns: any[]; data: any[]; fileName?: string }) {
    const formatColumnValue = (column: any, row: any): string => {
      if (column.cellRenderer) {
        const rendered = column.cellRenderer({ row } as any);
        const extractTextContent = (element: any): string => {
          if (!element) return "--";
          if (typeof element === "string") return element;
          if (Array.isArray(element)) {
            return element.map(el => extractTextContent(el)).join("/");
          }
          if (element.children) {
            return extractTextContent(element.children);
          }
          if (element.props?.children) {
            return extractTextContent(element.props.children);
          }
          return "--";
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
