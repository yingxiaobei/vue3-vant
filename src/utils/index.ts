// 字典value 2 label
export function dicConversion(
  val: string,
  dicList: { label: string; value: string | number }[],
  defaultLabel = ""
) {
  if (!dicList || !dicList.length) {
    return defaultLabel;
  }
  const obj = dicList.find((f) => f.value === val);
  return obj ? obj.label : defaultLabel;
}

// 获取用户信息
export function getUserInfo() {
  return JSON.parse(localStorage.getItem("userInfo") || "{}");
}

export function base64toFile(
  dataurl: string,
  filename: string = Date.now() + ""
) {
  let arr = dataurl.split(",");
  // @ts-ignore
  let mime = arr[0].match(/:(.*?);/)[1];
  let suffix = mime.split("/")[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  let file = new File([u8arr], `${filename}.${suffix}`, {
    type: mime,
  });
  return file;
}
