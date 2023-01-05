import service from "@/utils/request";
import { postRequestTemp } from "@/utils/postRequestTemp";
/**
 * 短信验证码
 * @returns UseAxiosReturn
 */
export function sendCodeApi(data?: AnyObject) {
  return service.get(`/openapi/usercenter/user/sms/code`, data);
}

/**
 * 校验用户名是否存在
 * @returns UseAxiosReturn
 */
export function check(data?: AnyObject) {
  return service.get(`/openapi/usercenter/user/username/check`, data);
}

/**
 * 用户注册
 * @returns UseAxiosReturn
 */
export function userRegister(data?: AnyObject) {
  return service.post(`/openapi/usercenter/user/userRegister`, data, {
    customParams: {
      onlySuccessResp: false,
    },
  });
}
/**
 * 账号密码登录
 * @returns UseAxiosReturn
 */
export function loginApi(data: AnyObject) {
  return postRequestTemp(`uni/oauth/token`, {
    grant_type: "password",
    ...data,
  });
}

/**
 * 查询用户信息通过用户名
 * @returns UseAxiosReturn
 */
export function _selectUserByUsername(data: AnyObject) {
  return service.get(`/api/usercenter/user/selectUserByUsername`, data);
}

/**
 * 文件上传
 * @returns UseAxiosReturn
 */
export function _uploadFile(data: any) {
  return service.post(`/api/usercenter/tmpFile/upload`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * 图片上传
 * @returns UseAxiosReturn
 */
export function _uploadImg(data: any, schoolId: string) {
  return service.post(`/api/usercenter/tmpFile/uploadImg`, data, {
    headers: { "Content-Type": "multipart/form-data", schoolId },
  });
}
