<template>
  <div class="panel-content">
    <d-menu
      @submenu-change="submenuChange"
      @select="itemSelect"
      :default-select-keys="['item1']"
      :open-keys="openKeys"
      width="100%"
      class="menu"
    >
      <d-sub-menu title="竖向承载力" key="submenu-1">
        <template #icon>
          <i
            :class="
              openKeys[openKeys.length - 1] !== 'submenu-1'
                ? 'icon-infomation'
                : 'icon-setting'
            "
          ></i>
        </template>
        <d-menu-item
          key="submenu-1-item-1"
          v-ripple="{ color: '#5e7ce0', duration: 300, delay: 300 }"
        >
          <span>黏土/不排水工况</span>
        </d-menu-item>
        <d-menu-item
          key="submenu-1-item-2"
          v-ripple="{ color: '#5e7ce0', duration: 300, delay: 300 }"
        >
          <span>砂土/排水工况</span>
        </d-menu-item>
      </d-sub-menu>
      <d-sub-menu title="抗滑承载力" key="submenu-2">
        <template #icon>
          <i
            :class="
              openKeys[openKeys.length - 1] !== 'submenu-2'
                ? 'icon-infomation'
                : 'icon-setting'
            "
          ></i>
        </template>
        <d-menu-item
          key="submenu-2-item-1"
          v-ripple="{ color: '#5e7ce0', duration: 300, delay: 300 }"
        >
          <span>黏土/不排水工况</span>
        </d-menu-item>
        <d-menu-item
          key="submenu-2-item-2"
          v-ripple="{ color: '#5e7ce0', duration: 300, delay: 300 }"
        >
          <span>砂土/排水工况</span>
        </d-menu-item>
      </d-sub-menu>
      <d-sub-menu title="抗拔承载力" key="submenu-3">
        <template #icon>
          <i
            :class="
              openKeys[openKeys.length - 1] !== 'submenu-3'
                ? 'icon-infomation'
                : 'icon-setting'
            "
          ></i>
        </template>
        <d-menu-item
          key="submenu-3-item-1"
          v-ripple="{ color: '#5e7ce0', duration: 300, delay: 300 }"
        >
          <span>黏土/不排水工况</span>
        </d-menu-item>
        <d-menu-item
          key="submenu-3-item-2"
          v-ripple="{ color: '#5e7ce0', duration: 300, delay: 300 }"
        >
          <span>砂土/排水工况</span>
        </d-menu-item>
      </d-sub-menu>
    </d-menu>
    <p
      style="
        padding: 10px;
        margin-top: 10px;
        color: gray;
        font-size: 12px;
        text-align: justify;
        text-indent: 2em;
      "
    >
      {{ currentHelper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: String,
  },
});
const emit = defineEmits(["update:modelValue"]);

const currentHelper = ref(`
  请点击上方菜单栏，选择需要计算的承载力形式，并选择当前的工作目录，创建的计算文件将以xlsx的格式保存至当前工作目录。
`);
const openKeys = ref(["submenu-1"]);
const rootSubMenuKeys = ref(["submenu-1", "submenu-2", "submenu-3"]);
const submenuChange = (e: Event & { key: string }) => {
  // console.log(e);
  const { key } = e;
  if (rootSubMenuKeys.value.includes(key)) {
    while (openKeys.value.length) {
      openKeys.value.shift();
    }
    openKeys.value.push(key);
  }
};

const itemSelect = (e: any) => {
  emit("update:modelValue", e.key);
  currentHelper.value = `
    右侧区域将显示该承载力形式对应的计算文件(文件目录无中文和空格)，请创建新的计算，或在之前的计算上进行编辑。
  `;
};
</script>

<style scoped>
.menu {
  /* height: 100%; */
  display: flex;
  flex-direction: column;
}

.panel-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
