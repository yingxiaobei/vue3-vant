import service from "@/utils/request";

const pre = "/api/jp-train-core-svc";

/**
 * 获取用户信息
 * @returns UseAxiosReturn
 */
export function _getUserStudentInfo(phone: string) {
  return service.get(`${pre}/v1/student/selectByPhone?phone=${phone}`);
}

/**
 * 获取报审记录
 * @returns UseAxiosReturn
 */
export function _getSuccessStageRecord(sid: string, schoolid: string) {
  return service.get(
    `${pre}/v1/stuStageApply/getSuccessStageRecord?sid=${sid}&schoolId=${schoolid}`
  );
}

/**
 * 新增评价
 * @returns UseAxiosReturn
 */
export function _schEvaluationAdd(data: AnyObject) {
  return service.post(`${pre}/v1/schEvaluation/add`, data, {});
}

/**
 * 获取评价详情
 * @returns UseAxiosReturn
 */
export function _getschEvaluationInfo(data: AnyObject) {
  return service.get(`${pre}/v1/schEvaluation/info`, data);
}

/**
 * 获取教练列表
 * @returns UseAxiosReturn
 */
export function _getCoalist(schoolId: string) {
  return service.get(
    `${pre}/v1/coa/pageList?page=1&limit=9999&type=1&schoolId=${schoolId}`
  );
}
