<template>
  <div v-if="currentMenu !== ''" class="list" v-loading="loadingState">
    <div class="add-file" @click="addNewCalc">
      <d-avatar
        :imgSrc="addFile"
        :width="50"
        :height="50"
        :isRound="false"
      ></d-avatar>
      <d-button size="md" variant="outline">点击添加计算</d-button>
    </div>

    <div v-for="v in excelFileList" class="add-file file">
      <d-avatar
        :imgSrc="sheet"
        :width="100"
        :height="100"
        :isRound="false"
      ></d-avatar>

      <strong style="font-size: 20px">{{ v }}</strong>
      <div style="display: flex; justify-content: center; align-items: center">
        <d-button
          style="flex: 1"
          @click="handleEdit(v)"
          size="sm"
          icon="edit"
          color="secondary"
          >编辑</d-button
        >
        <d-button
          @click="handleOpen(v)"
          size="sm"
          icon="connect"
          color="primary"
          title="excel打开"
        ></d-button>
        <d-button
          @click="handleDelete(v)"
          size="sm"
          icon="delete"
          color="danger"
          title="删除"
        ></d-button>
      </div>
    </div>
  </div>
  <div v-else class="empty">
    <d-avatar
      :imgSrc="marine"
      :width="100"
      :height="100"
      :isRound="false"
    ></d-avatar>
    <b style="font-size: 20px">请选择右侧菜单面板</b>
  </div>
</template>

<script setup lang="ts">
import addFile from "../../../assets/add-file.svg";
import marine from "../../../assets/marine.svg";
import sheet from "../../../assets/sheet.svg";
import { ref, watch } from "vue";
import titleMap from "../../../static/title.json";

const props = defineProps({
  currentMenu: {
    type: String,
    required: true,
  },
  workspace: {
    type: String,
    required: true,
  },
  addFileTimes: {
    type: Number,
  },
});
const emit = defineEmits(["openModal"]);

const addNewCalc = () => {
  emit("openModal");
};

const excelFileList = ref([]);
const loadingState = ref(false);
const changeState = async () => {
  loadingState.value = true;
  const res = await (window as any).electronAPI.readFileList(
    props.workspace,
    (titleMap as any)[props.currentMenu]
  );
  loadingState.value = false;
  console.log(res);
  if (!res) {
    excelFileList.value = [];
  }
  excelFileList.value = JSON.parse(res);
};

watch(
  () => [props.workspace, props.currentMenu, props.addFileTimes],
  async (oldData, newData) => {
    if (oldData[2] !== newData[2]) {
      await new Promise((resolve: any) => setTimeout(resolve, 3500));
    }
    await changeState();
  }
);

const handleEdit = async (v: string) => {
  await (window as any).electronAPI.openCalcWin(
    props.currentMenu,
    props.workspace,
    v,
    "calc"
  );
};

const handleDelete = async (v: string) => {
  loadingState.value = true;
  await (window as any).electronAPI.deleteFile(props.workspace, v);
  await changeState();
  loadingState.value = false;
};

const handleOpen = async (v: string) => {
  loadingState.value = true;
  await (window as any).electronAPI.openExcelFile(props.workspace, v);
  loadingState.value = false;
};
</script>

<style scoped>
.list {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  overflow: scroll;
  padding: 10px;
}

.list > span {
  margin: 10px;
}

.add-file {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  /* background-color: #335485; */
  border-radius: 5px;
  padding: 5px;
  border: 2px dashed #5e86c1;
  cursor: pointer;
  margin: 10px;
  transition: all 0.8s ease;
  width: 100%;
}
.add-file:hover {
  border: 2px solid #5e86c1;
}

.add-file.file {
  width: unset;
  height: unset;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  cursor: auto;
  transition: all 0.5s ease;
  box-sizing: border-box;
  padding: 10px;
}
.add-file.file:hover {
  box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px,
    rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
