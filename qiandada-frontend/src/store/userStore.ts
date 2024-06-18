import { defineStore } from "pinia";
import { ref } from "vue";
import { getLoginUserUsingGet } from "@/api/userController";
import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 登录用户信息全局状态
 */
export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: "未登录",
  });

  // 设置用户信息
  function setLoginUser(newLoginUser: API.LoginUserVO) {
    loginUser.value = newLoginUser;
  }

  // 获取用户信息
  async function fetchLoginUser() {
    // 发送登录请求
    const res = await getLoginUserUsingGet();
    // 判断响应数据
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data;
    } else {
      // 未登录默认设置角色为未登录
      loginUser.value = { userRole: ACCESS_ENUM.NOT_LOGIN };
    }
  }

  return { loginUser, setLoginUser, fetchLoginUser };
});
