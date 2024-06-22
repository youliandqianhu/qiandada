<template>
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">用户登录</h2>
    <a-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不小于 8 位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <div
          style="
            display: flex;
            width: 100%;
            align-content: center;
            justify-content: space-between;
          "
        >
          <a-button type="primary" html-type="submit" style="width: 120px"
            >登录
          </a-button>
          <a-link href="/user/register">新用户注册</a-link>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";
import { userLoginUsingPost } from "@/api/userController";
import { useLoginUserStore } from "@/store/userStore";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
// 全局状态管理器
const loginUserStore = useLoginUserStore();
// 路由跳转
const router = useRouter();
// 登录表单
const form = reactive({
  userAccount: "yupi",
  userPassword: "12345678",
} as API.UserLoginRequest);
// 登录函数
const handleSubmit = async () => {
  // 调用登录接口
  const res = await userLoginUsingPost(form);
  // 判断登录是否成功
  if (res.data.code === 0) {
    // 设置到全局状态管理中
    await loginUserStore.fetchLoginUser();
    message.success("登录成功");
    router.push({
      path: "/",
      // 防止用户登录成功后，点击返回按钮后不会再返回到登录页
      replace: true,
    });
  } else {
    message.error("登录失败," + res.data.message);
  }
};
</script>
