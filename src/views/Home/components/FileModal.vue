<template>
  <d-modal v-model="visible">
    <template #header>
      <d-modal-header>
        <d-icon name="add-file"></d-icon>
        <span style="vertical-align: text-bottom; margin-left: 5px"
          >添加新的计算</span
        >
      </d-modal-header>
    </template>
    <d-form
      ref="formRef"
      layout="vertical"
      :data="{ workspace, filename }"
      :pop-position="['right']"
    >
      <d-form-item
        field="workspace"
        :rules="[
          { required: true, message: '文件名不能为空', trigger: 'blur' },
        ]"
        :show-feedback="false"
        label="工作目录"
      >
        <d-input v-model="workspace" disabled placeholder="未选择工作目录" />
      </d-form-item>
      <d-form-item
        field="filename"
        :rules="[
          { required: true, message: '文件名不能为空', trigger: 'blur' },
        ]"
        :show-feedback="false"
        label="文件名"
      >
        <d-input v-model="filename">
          <template #append>
            <span>.xlsx</span>
          </template>
        </d-input>
      </d-form-item>
    </d-form>
    <template #footer>
      <d-modal-footer style="text-align: right; padding-right: 20px">
        <d-button @click="hidden">取消</d-button>
        <d-button @click="handleConfirm">确认</d-button>
      </d-modal-footer>
    </template>
  </d-modal>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { getCurrentInstance, ref } from "vue";

const formRef = ref(null);
const props = defineProps({
  modelValue: {
    required: true,
    type: Boolean,
  },
  currentMenu: {
    required: true,
    type: String,
  },
  currentWorkSpace: {
    required: true,
    type: String,
  },
});
const emit = defineEmits(["update:modelValue", "updata:currentWorkSpace"]);

const visible = useVModel(props, "modelValue", emit);
const filename = ref("");
const workspace = useVModel(props, "currentWorkSpace", emit);
const message =
  getCurrentInstance()?.appContext.config.globalProperties.$message;

const hidden = () => {
  visible.value = false;
};
const handleConfirm = () => {
  (formRef.value as any).validate(async (isValid: any, invalidFields: any) => {
    if (!isValid) return;
    const res = await (window as any).electronAPI.readCalcFile(
      workspace.value,
      filename.value + ".xlsx"
    );
    if (res) {
      message({ type: "warning", message: "文件名重复" });
      return;
    }
    await (window as any).electronAPI.openCalcWin(
      props.currentMenu,
      workspace.value,
      filename.value + ".xlsx",
      "calc"
    );
    visible.value = false;
    workspace.value = workspace.value;
  });
};
</script>
