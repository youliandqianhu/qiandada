<template>
  <a-row id="GlobalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <div>
        <a-menu
          mode="horizontal"
          :default-selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="titleBar">
              <img class="logo" src="../assets/logo.jpg" />
              <div class="title">千答答</div>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </div>
    </a-col>
    <a-col flex="100px">
      <div>
        <a-button type="primary" href="/user/login">登录</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routers";
import { useRouter } from "vue-router";
import { ref } from "vue";

// 路由跳转工具
const router = useRouter();

// 菜单跳转路由
const doMenuClick = (key: string) => {
  router.push(key);
};

//  当前选中的菜单项
const selectedKeys = ref(["/"]);
// 路由跳转时，自动更新（用于菜单栏高亮显示）
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// 用于展示在菜单栏的路由(因为有些路由需要隐藏起来)
const visibleRoutes = routes.filter((item) => {
  if (item.meta?.hideInMenu) {
    return false;
  }
  return true;
});
</script>
<style scoped>
.titleBar {
  display: flex;
  align-items: center;
}

.titleBar .logo {
  height: 45px;
}

.titleBar .title {
  margin-left: 16px;
  color: black;
}
</style>
