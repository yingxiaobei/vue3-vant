import service from "@/utils/request";

const pre = "/api/order-pay";
// const pre = "";

/**
 * 订单列表
 * @returns UseAxiosReturn
 */
export function _getOrderList(data: any) {
  return service.get(`${pre}/api/order/pageList`, data);
}

/**
 * 订单详情
 * @returns UseAxiosReturn
 */
export function _getOrderDetail(data: any) {
  return service.get(`${pre}/api/order/detail`, data);
}
