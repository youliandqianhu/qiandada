<template>
  <div id="userLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <img class="logo" src="../assets/logo.jpg" />
        <div>千答答AI答题平台</div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a
          href="http://baidu.com"
          target="_blank"
          style="text-decoration: none"
        >
          千答答
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
#userLayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png");
}

#userLayout .logo {
  height: 48px;
  width: 48px;
}

#userLayout .header {
  margin-bottom: 16px;
  font-size: 21px;
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

.footer {
  background-color: #f0f2f5;
  padding: 10px;
  text-align: center;
}
</style>
