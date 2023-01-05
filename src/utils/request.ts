import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Toast } from "vant";
import { get as _get } from "lodash";
import { getUserInfo } from "@/utils";
import router from "@/router";
const BASE_PREFIX = import.meta.env.VITE_API_BASEURL;

// 创建实例
const axiosInstance: AxiosInstance = axios.create({
  // 前缀
  // baseURL: import.meta.env.PROD ? BASE_PREFIX : "/local",
  baseURL: window.API_BASEURL || BASE_PREFIX,
  // baseURL: BASE_PREFIX,
  // 超时
  timeout: 1000 * 30,
  // 请求头
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // TODO 在这里可以加上想要在请求发送前处理的逻辑
    // TODO 比如 loading 等
    const token = localStorage.getItem("auth");
    if (token) {
      config.headers = {
        Authorization: token,
        username: getUserInfo().mobilePhone,
        ...(config.headers || {}),
      };
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data;
    }
    console.log("response", response);
    Toast(JSON.stringify(response.status));
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;
    if (response) {
      Toast.fail(error);
      if (response?.status === 401) {
        // 退出登录
        localStorage.clear();
        router.replace("/login");
      }
      return Promise.reject(response.data);
    }
    Toast.fail("网络连接异常,请稍后再试!");
    return Promise.reject(error);
  }
);

const resHandle = (res: any, params?: Record<string, any>) => {
  const onlySuccessResp = _get(params, "onlySuccessResp", true);
  console.log(onlySuccessResp);
  if (onlySuccessResp) {
    const code = _get(res, "code");
    if (code === 200) {
      return _get(res, "data");
    } else if (code === 401) {
      // 退出登录
      localStorage.clear();
      router.replace("/login");
    } else {
      Toast(_get(res, "message"));
      return Promise.reject(res);
    }
  } else {
    return res;
  }
};

const service = {
  async get<T = any>(
    url: string,
    data?: object,
    payload?: {
      headers?: Record<string, any>;
      customParams?: Record<string, any>;
    }
  ): Promise<T> {
    const res = await axiosInstance.get(url, {
      params: data,
      headers: payload?.headers,
    });
    return resHandle(res, payload?.customParams);
  },

  async post<T = any>(
    url: string,
    data?: object,
    payload?: {
      headers?: Record<string, any>;
      customParams?: Record<string, any>;
      responseType?:
        | "json"
        | "arraybuffer"
        | "stream"
        | "document"
        | "text"
        | "blob";
    }
  ): Promise<T> {
    const res = await axiosInstance.post(url, data, {
      headers: payload?.headers,
      responseType: payload?.responseType,
    });
    return resHandle(res, payload?.customParams);
  },

  async put<T = any>(
    url: string,
    data?: object,
    payload?: {
      headers?: Record<string, any>;
      customParams?: Record<string, any>;
      responseType?:
        | "json"
        | "arraybuffer"
        | "stream"
        | "document"
        | "text"
        | "blob";
    }
  ): Promise<T> {
    const res = await axiosInstance.put(url, data, {
      headers: payload?.headers,
      responseType: payload?.responseType,
    });
    return resHandle(res, payload?.customParams);
  },

  delete<T = any>(url: string, data?: object): Promise<T> {
    return axiosInstance.delete(url, data);
  },

  upload: (url: string, file: FormData | File) =>
    axiosInstance.post(url, file, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  // download: (url: string, data: instanceObject) => {
  //   window.location.href = `${BASE_PREFIX}/${url}?${formatJsonToUrlParams(
  //     data
  //   )}`;
  // },
};

export default service;
