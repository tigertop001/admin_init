import { defineComponent, ref } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "QuickSearch",
  props: {
    value: {
      type: String as PropType<string>,
      default: ""
    },
    onChange: {
      type: Function as PropType<(value: string) => void>,
      required: true
    }
  },
  setup(props) {
    const searchType = ref("name");

    return () => (
      <div class="flex">
        <el-select
          v-model={searchType.value}
          style="width: 100px; margin-right: 8px"
        >
          <el-option label="名称" value="name" />
          <el-option label="地区" value="place" />
          <el-option label="城市" value="city" />
        </el-select>
        <el-input
          value={props.value}
          onInput={props.onChange}
          placeholder="请输入搜索内容"
          style="width: 400px"
        />
      </div>
    );
  }
});
