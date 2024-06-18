import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 检查权限(判断当前登录用户是否具有某个权限)
 * @param loginUser
 * @param needAccess
 */
const checkAccess = (
  loginUser: API.LoginUserVO,
  needAccess = ACCESS_ENUM.NOT_LOGIN
) => {
  // 获取用户当前拥有的权限,如果没有则默认为未登录
  const loginUserAccess = loginUser.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  // 判断用户当前拥有的权限是否包含需要检查的权限
  // 判断需要校验的权限是否为NOT_LOGIN
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  // 判断需要校验的权限是否需要登录
  if (needAccess === ACCESS_ENUM.USER) {
    // 如果用户没有登录，则返回false
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
    return true;
  }
  // 判断需要校验的权限是否需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 如果用户没有管理员权限，则返回false
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
    return true;
  }
  return true;
};

export default checkAccess;
