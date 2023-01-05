import service from "@/utils/request";

const pre = "/api/jp-train-core-svc";
const openPre = "/openapi/jp-train-core-svc";
// const pre = "";

/**
 * 分页展示班级信息
 * @returns UseAxiosReturn
 */
export function _getSchSchoolPackage(data: AnyObject) {
  return service.get(`${openPre}/v1/schSchoolPackage/pageList`, data);
}

/**
 * @description 查询教练信息列表
 * @param data
 * @url http://192.168.192.132:3000/project/314/interface/api/58038
 */
export function _getCoachList<T>(data: CommonListQuery) {
  return service.get<ResResult<T>>(`${openPre}/v1/coa/pageList`, data);
}

/**
 * @description 根据驾校查询教学区域列表
 * @param data
 * @url http://192.168.192.132:3000/project/314/interface/api/57970
 */
export function _getSchReginList<T>(data: CommonListQuery) {
  return service.get<ResResult<T>>(`${openPre}/v1/schRegion/pageList`, data);
}

/**
 * 获取班级详情
 * @returns UseAxiosReturn
 */
export function _getSchSchoolPackageDetail(data: AnyObject) {
  return service.get(`${pre}/v1/schSchoolPackage/selectByKey`, data);
}

/**
 * 新增受理学员信息
 * @returns UseAxiosReturn
 */
export function _schStudentAcceptinfoSave(data: AnyObject) {
  return service.post(`${pre}/v1/schStudentAcceptinfo/save`, data);
}

/**
 * 报名记录列表
 * @returns UseAxiosReturn
 */
export function _getRegistrationRecord(phone: string) {
  return service.get(
    `${pre}/v1/schStudentAcceptinfo/getRegistrationRecord/${phone}`
  );
}

/**
 * 获取学员填报信息（已审核）
 * @returns UseAxiosReturn
 */
export function _getStudentInfoByKey(data: AnyObject) {
  return service.get(`${pre}/v1/student/selectByKey`, data);
}

/**
 * 查看受理学员详情（未审核）
 * @returns UseAxiosReturn
 */
export function _getSchStudentAcceptinfo(schoolId: string, data: AnyObject) {
  return service.get(`${pre}/v1/schStudentAcceptinfo/selectByKey`, data, {
    headers: { schoolId },
  });
}

/**
 * 编辑学员信息
 * @returns UseAxiosReturn
 */
export function _updateStudent(data: AnyObject) {
  return service.put(`${pre}/v1/student/updateByKey`, data);
}

/**
 * 获取驾校车型
 * @returns UseAxiosReturn
 */
export function _getSchoolBusiScopeCombo(id: string) {
  return service.get(
    `${pre}/v1/sysbase/code/getSchoolBusiScopeCombo?schId=${id}`
  );
}

/**
 * 获取学员合同模板参数
 * @returns UseAxiosReturn
 */
export function _getSchContractTemp(sid: string) {
  return service.get(`${pre}/v1/stuSigncontract/getSchContractTemp?sid=${sid}`);
}

/**
 * 获取预览合同
 * @returns UseAxiosReturn
 */
export function _stuSigncontractPreviewDoing(data: AnyObject) {
  return service.post(`${pre}/v1/stuSigncontract/previewDoing`, data, {
    customParams: {
      onlySuccessResp: false,
    },
    responseType: "arraybuffer",
  });
}

/**
 * save合同？
 * @returns UseAxiosReturn
 */
export async function _stuSigncontractSave(data: AnyObject) {
  return await service.post(`${pre}/v1/stuSigncontract/save`, data);
}

/**
 * 提交签名
 * @returns UseAxiosReturn
 */
export async function _submitStuSignature(query: {
  fileid: string;
  sid: string;
  flag?: string;
  schoolId: string;
}) {
  return await service.put(
    `${pre}/v1/stuSigncontract/submitStuSignature`,
    query
  );
}

/**
 * 获取签名后的pdf合同
 * @returns UseAxiosReturn
 */
export async function _getPreviewContractFile(sid: string) {
  return await service.get(
    `${pre}/v1/stuSigncontract/previewContractFile?sid=${sid}`
  );
}
