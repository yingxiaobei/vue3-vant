import { isEmpty } from "lodash";

export async function postRequestTemp(path: string, query: object = {}) {
  const token = localStorage.getItem("auth");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    mustAuthenticated: false,
    "Login-Type": "MOBILE_CODE",
    Authorization: token,
  };

  const options: any = {
    method: "POST",
    headers,
  };

  return fetch(
    (window.API_BASEURL || import.meta.env.VITE_API_BASEURL) +
      path +
      formatQueryParams(query),
    options
  )
    .then(parseJSON)
    .catch((error) => {});
}

function parseJSON(response: any) {
  return response.json();
}

// 格式化接口传参
export function formatQueryParams(params?: { [key: string]: any }): string {
  if (isEmpty(params)) {
    return "";
  }

  const res = [];
  for (let key in params) {
    const value = params[key];
    // GET请求参数中去除undefined和null的情况
    if (value !== undefined && value !== null) {
      res.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }

  return isEmpty(res) ? "" : "?".concat(res.join("&"));
}
