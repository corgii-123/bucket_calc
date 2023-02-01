<template>
  <div class="container">
    <d-card class="paint-area">
      <canvas id="paintArea" style="border-radius: 8px"></canvas>
    </d-card>
    <div class="result-container">
      <d-card
        class="result-card"
        v-for="(v, i) in results?.resultTitle"
        :key="v"
      >
        <d-statistic
          :value="(Object.values(results?.result)[i] as number)"
          :value-from="0"
          :animation-duration="1500"
          animation
          :precision="2"
        >
          <template #title>
            <b v-html="v.replace(/[^\u4e00-\u9fa5\-]/, '<i>$&</i>')"></b>
          </template>
          <template #suffix>
            <span v-html="results?.units[i]"></span>
          </template>
        </d-statistic>
      </d-card>
    </div>
    <div class="message-container">
      <d-card class="message-card">
        <template #content>
          <b
            style="font-size: 16px"
            v-html="results?.message.replace(/(\w)<sub>/g, '<i>$1</i><sub>')"
          ></b>
        </template>
      </d-card>
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
  </footer>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { fabric } from "fabric";
import paintHandler from "../../utils/paintHandler";
import { resizeWin } from "../../utils/resizeWin";

let results: Ref<any> = ref(null);
(window as any).electronAPI.handleResult((e: any, resultParams: any) => {
  results.value = JSON.parse(resultParams);
  console.log(results.value);
});

const handleClose = () => {
  (window as any).electronAPI.closeCalc();
};

document.title = "计算结果";

onMounted(() => {
  const myCanvas = new fabric.Canvas("paintArea");
  if (myCanvas) {
    paintHandler(myCanvas, results, { width: 0.75, height: 0.55 });
  }

  requestIdleCallback(() => {
    resizeWin(ref(document.getElementById("app")));
  });
});
</script>

<style scoped>
.result-container {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  overflow-x: scroll;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
}

.result-card {
  margin: 5px;
}

footer {
  position: absolute;
  height: 34px;
  width: 100%;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #335485;
  opacity: 0.9;
  padding-left: 20px;
}

.paint-area {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.message-card {
  margin: 5px 10px;
  padding: 0 15px;
}
.message-card > :deep() .devui-card__header {
  height: 0;
  margin-bottom: 2px;
}
</style>
