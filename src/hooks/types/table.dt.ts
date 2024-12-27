import type { ElTable } from "element-plus";

export interface TableInstance {
  getTableRef: () => InstanceType<typeof ElTable>;
}
