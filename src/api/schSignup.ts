import service from "@/utils/request";

const pre = "/api/usercenter";
const openPre = "/openapi/usercenter";
// const pre = "";

/**
 * 查询驾校报名驾校列表
 * @returns UseAxiosReturn
 */
export function _getCompanyList(data: AnyObject) {
  return service.get(`${openPre}/v1/company/show/app`, data);
}

/**
 * 驾校详情
 * @returns UseAxiosReturn
 */
export function _getCompanyDetail(id: string) {
  return service.get(`${pre}/v1/company/${id}/detail/sys`);
}
