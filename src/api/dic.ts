import service from "@/utils/request";

const pre = "/api/usercenter";
const openPre = "/openapi/usercenter";
// const pre = "";

/**
 * 数据字典
 * @returns UseAxiosReturn
 */
export function getCode(codeType: string, code?: string) {
  return service.get(
    `${openPre}/v1/codeList/get?codeType=${codeType}&parentCodeKey=${code}`
  );
}
