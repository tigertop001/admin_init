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

const toolbarConfig = {
  toolbarKeys: [
    "bold",
    "italic",
    "underline",
    "|",
    "fontSize",
    "color",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "uploadImage",
    "|",
    "clearStyle"
  ]
};

const editorConfig = {
  placeholder: "请输入内容...",
  autoFocus: false,
  MENU_CONF: {
    uploadImage: {
      server: "/api/upload",
      fieldName: "file",
      maxFileSize: 10 * 1024 * 1024,
      maxNumberOfFiles: 10,
      allowedFileTypes: ["image/*"],
      onBeforeUpload(file: any) {
        return file;
      },
      onSuccess(file: any, res: any) {
        console.log("图片上传成功", file, res);
      },
      onFailed(file: any, res: any) {
        console.log("图片上传失败", file, res);
      },
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
