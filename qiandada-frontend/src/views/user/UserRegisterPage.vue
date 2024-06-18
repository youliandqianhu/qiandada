<template>
  <div id="userRegisterPage">
    <h2 style="margin-bottom: 16px">用户注册</h2>
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
      <a-form-item
        field="checkPassword"
        tooltip="确认密码不小于 8 位"
        label="确认密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请输入确认密码"
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
            >注册
          </a-button>
          <a-link href="/user/login">老用户登录</a-link>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";
import { userRegisterUsingPost } from "@/api/userController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
// 路由跳转
const router = useRouter();
// 注册表单
const form = reactive({
  userAccount: "yupi",
  userPassword: "12345678",
  checkPassword: "",
} as API.UserRegisterRequest);
// 注册函数
const handleSubmit = async () => {
  // 调用注册接口
  const res = await userRegisterUsingPost(form);
  // 判断注册是否成功
  if (res.data.code === 0) {
    message.success("注册成功");
    router.push({
      path: "/user/login",
      // 防止用户注册成功后，点击返回按钮后不会再返回到注册页
      replace: true,
    });
  } else {
    message.error("注册失败," + res.data.message);
  }
};
</script>
