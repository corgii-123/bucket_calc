<template>
  <div class="content">
    <h3>计算结果</h3>
    <ul class="result-content">
      <li v-for="(v, idx) of data.resultTitle" style="margin: 2px 0">
        <div
          v-html="
            v.replace(/[^\u4e00-\u9fa5-]/, '<i>$&</i>') +
            ' = <b>' +
            result[idx] +
            '</b>'
          "
        ></div>
      </li>
    </ul>
    <div class="result">
      <div v-html="data.message.replace(/(\w)<sub>/g, '<i>$1</i><sub>')"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const getResult = () =>
  Object.values(props.data.result).map((v: any) =>
    v ? Number(v).toFixed(2) : "输入参数有问题"
  );

const result = ref(getResult());
watch(
  () => [props.data.result],
  () => {
    result.value = getResult();
  }
);
</script>

<style scoped>
.content {
  border-radius: 4px;
  border: 2px solid gray;
  padding: 8px;
  box-sizing: border-box;
  width: 50vw;
}

.result-content {
  padding-bottom: 10px;
  border-bottom: 1px solid #404040;
}

.result {
  padding-top: 5px;
}

h3 {
  margin: 0;
  margin-bottom: 5px;
}
</style>
