<template>
  <div class="content">
    <div class="calc-form">
      <h1>计算参数信息</h1>
      <d-form
        ref="formRef"
        layout="vertical"
        :data="refsData"
        :pop-position="['left']"
      >
        <div v-for="v in Object.keys(data)" class="part">
          <span class="sub-title">{{ data[v].name }}</span>
          <d-form-item
            v-for="(tick, i) in data[v].ticks"
            :field="variables[v][i]"
            :rules="[{ validator: check }]"
            :show-feedback="false"
            class="every-item"
          >
            <d-input
              v-model="refsData[variables[v][i]]"
              placeholder="请输入"
              clearable
              size="sm"
            >
              <template #prepend>
                <span
                  v-html="tick.replace(/[^\u4e00-\u9fa5-]/, '<i>$&</i>')"
                  class="tick-prepend"
                ></span>
              </template>
            </d-input>
          </d-form-item>
        </div>
      </d-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  variables: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const refsData = useVModel(props, "modelValue", emit);
const formRef = ref(null);

defineExpose({
  formRef,
});

const check = (rule: any, value: any, callback: any) => {
  if (Number.isNaN(Number(value)) || value == "") {
    return callback(new Error("请输入正确的值"));
  }
  callback();
};
</script>

<style scoped>
.content {
  width: 50vw;
  height: auto;
  padding: 5px;
  box-sizing: border-box;
  border: 2px solid gray;
  border-radius: 4px;
}

.tick-prepend {
  width: 25vw;
  overflow-x: scroll;
}

::-webkit-scrollbar {
  height: 2px;
}

:deep() .devui-input-slot__prepend {
  padding: 4px 6px 2px 6px;
}

.part {
  margin: 5px 0;
}

.sub-title {
  font-weight: bold;
  margin-bottom: 10px;
  padding-left: 4px;
  font-size: 12px;
}

.calc-form > h1 {
  padding: 0;
  margin: 0;
  font-size: 14px;
}

.every-item {
  margin-top: -24px;
  margin-bottom: 0;
}
</style>
