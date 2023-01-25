<template>
  <header>
    <div class="work-space">
      <d-icon name="add-directory" color="gray"></d-icon>
      <span style="white-space: nowrap; margin: 0 5px">当前文件</span>
      <d-input
        size="sm"
        placeholder="请选择工作区"
        :value="`${filePath}\\${filename}`"
        disabled
      ></d-input>
    </div>
  </header>
  <div class="layout" v-loading="loadingState">
    <div class="paint-result">
      <canvas id="paintArea"></canvas>
    </div>
    <div style="overflow-y: scroll; height: calc(100vh - 34px * 2)">
      <CalcFormVue
        v-model="refsData"
        :variables="variables"
        :data="data"
        ref="calcRef"
      ></CalcFormVue>
      <CalcResult v-if="resultData.message" :data="resultData" />
    </div>
  </div>
  <footer>
    <d-button
      size="sm"
      icon="op-exit"
      style="margin-left: 5px"
      @click="handleClose"
    >
      退出面板
    </d-button>
    <div>
      <d-button
        size="sm"
        icon="code-editor-save"
        @click="handleSave"
        v-loading="loadingState"
      >
        保存文件
      </d-button>
      <d-button
        size="sm"
        style="margin: 0 5px"
        icon="icon-cancel-forbidden"
        variant="solid"
        @click="startCalc"
        v-loading="loadingState"
      >
        开始计算
      </d-button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import CalcFormVue from "./components/CalcForm.vue";
import CalcResult from "./components/CalcResult.vue";
import { onMounted, ref, getCurrentInstance } from "vue";
import { useResizeObserver } from "@vueuse/core";
import staticData from "./static/calc.json";
import titleMap from "../../static/title.json";
import { dataFormat } from "./common/dataFormat";
import paintHandler from "./common/paintHandler";
import {fabric} from 'fabric'

const { params, query } = useRoute();
const loadingState = ref(false);

const { id } = params as any;
const { filename, path: filePath } = query as any;
console.log(id);
const data = (staticData as any)[id];
const refsData: any = ref({});
const variables: any = {};
const categoryList: string[] = [];
const message =
  getCurrentInstance()?.appContext.config.globalProperties.$message;
const resultData: any = ref({
  result: {},
  resultTitle: [],
  message: "",
});

document.title = (titleMap as any)[id];

for (let k in data) {
  variables[k] = data[k].refs.map((v: any) => Object.keys(v)[0]);
  variables[k].forEach((v: any, i: number) => {
    refsData.value[v] = data[k].refs[i][v];
  });
  const current = data[k].ticks.map((v: any) => v);
  categoryList.push(...current);
}

const save2excel = async (msg: string, resMsg?: string) => {
  const resData = dataFormat(
    (titleMap as any)[id],
    { ...refsData.value, ...resultData.value.result },
    [...categoryList, ...resultData.value.resultTitle],
    resMsg
  );
  const isSaved = await (window as any).electronAPI.exportExcel(
    filePath,
    filename,
    resData
  );
  if (isSaved) {
    message({ type: "success", message: "操作成功" });
  } else {
    message({ type: "error", message: "出错了" });
  }
};

const calcRef = ref(null);
const startCalc = () => {
  (calcRef.value as any).formRef.validate(async (isValid: any) => {
    if (!isValid) return;
    loadingState.value = true;
    const result = await (window as any).electronAPI.prepareCalc({
      id,
      filePath,
      data: JSON.stringify(refsData.value),
    });
    const res = JSON.parse(result);

    resultData.value.message = res.status.message;
    if (!res.status.isFinish) {
      resultData.value.result = "";
      resultData.value.resultTitle = "";
      message({ type: "error", message: "存在参数取值有误" });
      loadingState.value = false;
      return;
    }

    resultData.value["result"] = res.result;
    resultData.value["resultTitle"] = res.resultTitle;

    await save2excel("计算并保存成功", resultData.value.message);
    loadingState.value = false;
  });
};

const handleSave = async () => {
  loadingState.value = true;
  await save2excel("保存成功");
  loadingState.value = false;
};

onMounted(async () => {
  const res = await (window as any).electronAPI.readCalcFile(
    filePath,
    filename
  );
  if (!res) {
    save2excel("初始化成功");
  } else {
    const [currentData] = JSON.parse(res);
    const { data } = currentData;
    const [title, newRefsData] = data;
    const keys = Object.keys(refsData.value);
    for (let i = 0; i < keys.length; i++) {
      refsData.value[keys[i]] = newRefsData[i + 1];
    }

    // 暂时处理，excel中拿到的key值有问题
    for (let i = keys.length + 1; i < title.length; i++) {
      resultData.value.resultTitle.push(
        title[i].replace(/(\w)([\w,]+)/, "$1<sub>$2</sub>")
      );
      resultData.value.result[title[i]] =
        i >= newRefsData.length ? NaN : newRefsData[i];
    }
    if (data.length > 2) {
      resultData.value.message = data[3][0]
        .replace(/([a-zA-Z])([\w,]+)/g, "$1<sub>$2</sub>")
        .replace(/设计.+要求/, "<b style='color: #dc143c'>$&</b>");
    }
  }

  const myCanvas = new fabric.Canvas('paintArea')
  // paint function
  if (myCanvas) {
    paintHandler(myCanvas, refsData);
  }
});

const handleClose = () => {
  (window as any).electronAPI.closeCalc();
};
</script>

<style scoped>
.layout {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  box-sizing: border-box;
}

.paint-result {
  border: 2px solid gray;
  height: calc(100vh - 34px * 2);
  width: 47vw;
  box-sizing: border-box;
  border-radius: 4px;
  position: sticky;
  display: flex;
  justify-content: center;
  align-items: center;
}

header {
  background-color: rgb(230, 227, 227);
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.work-space {
  padding: 5px 10px;
  display: flex;
  font-size: 12px;
  justify-content: flex-start;
  align-items: center;
}

footer {
  background-color: rgb(230, 227, 227);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}
</style>
