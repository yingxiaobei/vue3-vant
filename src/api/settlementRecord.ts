import service from "@/utils/request";

const pre = "/api/jp-train-core-svc";
// const pre = "";

/**
 * 查询结算列表（分页）
 * @returns UseAxiosReturn
 */
export function _getstuOrderSettlementList(data: AnyObject) {
  return service.get(`${pre}/v1/stuOrderSettlement/page`, data);
}
