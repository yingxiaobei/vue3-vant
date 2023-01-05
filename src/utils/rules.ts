export default {
  mobile: {
    pattern:
      /^1(3[0-9]|4[01456879]|5([0-3]|[5-9])|6[2567]|7[0-8]|8[0-9]|9([0-3]|[5-9]))\d{8}$/,
    message: "输入正确的手机号码",
  },
  idCard: {
    pattern:
      /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    message: "请输入正确的身份证号!",
  },
  anyChar({ max, min, msg }: { max: number; min?: number; msg?: string }) {
    const len = `{${min || 0},${max}}`;
    return {
      pattern: new RegExp("^." + len + "$"),
      message: msg || `输入内容需在${min || 0}-${max}字符`,
    };
  },
  studentName: {
    pattern: /^[a-z|A-Z|\u4e00-\u9fa5|·|\s]{1,20}$/,
    message: "由字母，中文，空格组成，有效长度为1-20个字符", //只能出现：A-Z、a-z、中文、空格(第一位、最后一位，不能是空格)
  },
};
