<template>
  <d-layout v-loading="loadingState">
    <header class="dheader">
      <div class="work-space" @click="changeWorkSpace">
        <d-icon name="add-directory" color="#faf0e6"></d-icon>
        <span style="white-space: nowrap; margin-right: 5px">工作目录</span>
        <d-input v-model="workSpaceFolder" size="sm" placeholder="请选择工作区" readonly></d-input>
      </div>
      <div class="source-book">
        <d-icon name="connect-code" color="#faf0e6" style="line-height: 10vh"></d-icon>
        <span style="white-space: nowrap; line-height: 10vh; margin-right: 5px">参考规范材料</span>
        <div style="display: flex; justify-content: center; width: 100%; flex-direction: column">
          <d-input v-model="Object.keys(sourceBook)[0]" size="sm" readonly @click="openReference(Object.values(sourceBook)[0])" class="reference-input"></d-input>
          <d-input v-model="Object.keys(sourceBook)[1]" size="sm" readonly @click="openReference(Object.values(sourceBook)[1])" class="reference-input"></d-input>
        </div>
      </div>
      <div class="logo-wrap">
        <div class="ccs-wrap">
          <img :src="ccs1" alt="" class="logo" />
          <img :src="ccs2" alt="" class="logo" style="height: 37%" />
        </div>
        <img :src="logo" alt="" class="logo" />
      </div>
    </header>
    <content class="dcontent">
      <section>
        <d-splitter class="splitter-border" :orientation="orientation" :splitBarSize="splitBarSize" style="height: 86vh">
          <template v-slot:DSplitterPane>
            <d-splitter-pane collapseDirection="before" :size="size" :minSize="minSize" :maxSize="maxSize" :collapsible="true" @sizeChange="sizeChange" @collapsedChange="collapsedChange">
              <Menu v-model="currentMenu"></Menu>
            </d-splitter-pane>
            <d-splitter-pane>
              <div class="pane-content">
                <FileList :currentMenu="currentMenu" @openModal="openModal" :workspace="workSpaceFolder" :addFileTimes="addFileTimes"></FileList>
                <footer>
                  <d-button variant="solid" icon="help" @click="handleHelper">帮助</d-button>
                  <d-button variant="solid" icon="exit" @click="handleClose">退出</d-button>
                </footer>
              </div>
            </d-splitter-pane>
          </template>
        </d-splitter>
      </section>
    </content>
  </d-layout>
  <FileModal v-model="visible" :currentMenu="currentMenu" :currentWorkSpace="workSpaceFolder" @update:currentWorkSpace="updateList"></FileModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Menu from './components/Menu.vue'
import logo from '../../assets/logo.jfif'
import ccs1 from '../../assets/ccs1.png'
import ccs2 from '../../assets/ccs2.png'
import FileList from './components/FileList.vue'
import { useStorage } from '@vueuse/core'
import FileModal from './components/FileModal.vue'

const orientation = ref('horizontal')
const sourceBook = ref({
  'Suction Installed Caisson Foundations for Offshore Wind: Design Guidelines [Offshore Wind Accelerator]': '2019-suction-installed-caisson-foundations-for-of.pdf',
  'Petroleum and natural gas industries-Specific requirements for offshore structures [ISO/DIS 19901-4]': 'ISODIS-19901-4-2022.pdf',
})

const splitBarSize = '2px'
// splitter pane input
const size = ref('25%')
const minSize = ref('20%')
const maxSize = ref('50%')
const sizeChange = (size: number) => {}
const collapsedChange = (event: Event) => {}

const workSpaceFolder = useStorage('workspace-folder', '')
const loadingState = ref(false)
const changeWorkSpace = async (e: Event) => {
  loadingState.value = true
  const filePath = await (window as any).electronAPI.openFile(workSpaceFolder.value)
  loadingState.value = false
  workSpaceFolder.value = filePath
}

const currentMenu = ref('')

const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const addFileTimes = ref(0)
const updateList = (newPath: string) => {
  console.log(newPath)
  addFileTimes.value++
}

const handleClose = () => {
  ;(window as any).electronAPI.closeMain()
}

const openReference = async (v: any) => {
  loadingState.value = true
  const res = await (window as any).electronAPI.openReferenceFile(v)
  loadingState.value = false
  console.log(res)
}

const handleHelper = () => {
  ;(window as any).electronAPI.openHelperFile('helper.pdf')
}
</script>

<style scoped>
.dheader {
  background: #335485;
  color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 14vh;
  /* padding-left: 5px; */
}

.dheader .work-space {
  flex: 20%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 10px;
  cursor: pointer;
}

.dheader .source-book {
  flex: 40%;
  display: flex;
  margin: 0 10px;
}

.description {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.description > span {
  margin-left: 7px;
}

.dheader .logo-wrap {
  height: 70%;
  margin-left: 30px;
  margin-right: 10px;
  display: flex;
}

.dheader .ccs-wrap {
  height: 100%;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dheader .logo {
  height: 100%;
}

.dheader .ccs-wrap .logo {
  flex: 1;
}

.dcontent {
  height: 100%;
}

.splitter-border {
  border: 1px solid #dfe1e6;
}

.pane-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pane-content > footer {
  padding: 7px 10px;
  background-color: #335485;
  display: flex;
  justify-content: space-around;
}

:deep() .devui-button--solid--primary {
  background-color: unset;
}
:deep() .devui-button--solid--primary:hover {
  background-color: var(--devui-primary, #5e7ce0);
}

.reference-input {
  margin: 2px 0;
  cursor: pointer;
}
</style>
