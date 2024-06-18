import router from "@/router";
import { useLoginUserStore } from "@/store/userStore";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  // 获取当前用户信息

  const loginUserStore = useLoginUserStore();
  let loginUser = loginUserStore.loginUser;
  // 判断当前用户之前是否尝试获取过登录用户信息,才自动登录(如果之前登录过,则拥有cookie,并且没有角色权限。如果之前没有登录过,则会被设置成未登录的角色权限)
  if (!loginUser || !loginUser.userRole) {
    //如果用户没有登录,并且也不是第一次进入这个页面,则自动登录一下.加await是为了等待登录成功并获取到值后再执行后续操作
    await loginUserStore.fetchLoginUser();
    loginUser = loginUserStore.loginUser;
  }
  // 获取当前用户要跳转的路由路径,如果不存在则默认为不需要登录
  const needAccess = (to.meta.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // 如果用户跳转的路由有权限要求，则进行拦截
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 判断用户信息是否存在?是否为登录状态？
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      next(`/user/login?redirect=${to.fullPath}`);
    }
    // 使用我们自定义的权限校验工具进行校验
    if (!checkAccess(loginUser, needAccess)) {
      // 没有通过校验,进入无权限页面
      next(`/noAuth`);
      return;
    }
  }
  // 如果都通过了校验，则继续跳转
  next();
});
