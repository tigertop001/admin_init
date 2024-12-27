<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { onBeforeUnmount, ref, shallowRef } from "vue";

defineOptions({
  name: "BaseEditor"
});

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue"]);

const mode = "default";
const editorRef = shallowRef();
const valueHtml = ref("");

// 工具栏配置，添加图片上传
const toolbarConfig = {
  toolbarKeys: [
    "bold", // 加粗
    "italic", // 斜体
    "underline", // 下划线
    "|", // 分割线
    "fontSize", // 字号
    "color", // 文字颜色
    "|",
    "bulletedList", // 无序列表
    "numberedList", // 有序列表
    "|",
    "uploadImage", // 图片上传
    "|",
    "clearStyle" // 清除格式
  ]
};

// 编辑器配置，添加图片上传配置
const editorConfig = {
  placeholder: "请输入内容...",
  autoFocus: false,
  MENU_CONF: {
    uploadImage: {
      server: "/api/upload", // 图片上传接口
      fieldName: "file", // 上传图片时的参数名
      maxFileSize: 10 * 1024 * 1024, // 限制大小10M
      maxNumberOfFiles: 10, // 最多上传10张
      allowedFileTypes: ["image/*"],
      // 上传之前触发
      onBeforeUpload(file: any) {
        return file;
      },
      // 上传成功后触发
      onSuccess(file: any, res: any) {
        console.log("图片上传成功", file, res);
      },
      // 上传失败后触发
      onFailed(file: any, res: any) {
        console.log("图片上传失败", file, res);
      },
      // 上传错误后触发
      onError(file: any, err: any, res: any) {
        console.log("图片上传错误", file, err, res);
      }
    }
  }
};

const onCreat = editor => {
  editorRef.value = editor;
  editor.setHtml(props.modelValue);
};

// 处理编辑器内容变化
const onEditChg = (html: string) => {
  emit("update:modelValue", html);
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<template>
  <div class="wangeditor">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      style="height: 300px; overflow-y: hidden"
      @onCreated="onCreat"
      @update:modelValue="onEditChg"
    />
  </div>
</template>
