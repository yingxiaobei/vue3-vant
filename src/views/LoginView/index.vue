<script lang="ts" setup>
import { Toast } from "vant";
import { ref, onMounted } from "vue";
import { useCountDown } from "@vant/use";
import { useRouter, useRoute } from "vue-router";
import BgPic from "@/components/BgPic.vue";
import {
  sendCodeApi,
  loginApi,
  check,
  userRegister,
  _selectUserByUsername,
} from "@/api/index";
import rules from "@/utils/rules";

let mobilePhone = ref("");
let password = ref("");
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const { start, current } = useCountDown({
  // 倒计时 60s
  time: 60000,
  millisecond: true,
});

onMounted(() => {
  localStorage.clear();
});
const sendCode = () => {
  if (!mobilePhone.value) {
    Toast("请输入手机号");
    return;
  }
  if (!rules["mobile"].pattern.test(mobilePhone.value.replace(/\s/g, ""))) {
    Toast.fail("手机号输入有误");
    return;
  }
  sendCodeApi({ mobilePhone: mobilePhone.value }).then((res) => {
    start();
  });
};

const submit = async () => {
  if (!mobilePhone.value) {
    Toast("请输入手机号");
    return;
  }
  if (!password.value) {
    Toast("请输入验证码");
    return;
  }
  const checkStatus = await check({ username: mobilePhone.value }); //检查改手机号是否被注册过
  console.log("checkStatus", checkStatus);
  if (checkStatus) {
    //注册过 直接登录
    login();
  } else {
    // 未注册 先注册在登录
    const resisterStatus = await userRegister({
      code: password.value,
      mobile: mobilePhone.value,
    });
    console.log("resisterStatus", resisterStatus);
    if (resisterStatus.code === 200) login();
  }
};
const login = async () => {
  loading.value = true;
  loginApi({
    client_id: "1609751776011",
    client_secret: "4b8e11219959d6753874e8d156cc4d6b",
    username: mobilePhone.value,
    password: password.value,
  })
    .then((res) => {
      localStorage.setItem("auth", "bearer" + res?.access_token);
      getUserInfo();
    })
    .catch(() => {
      loading.value = false;
    });
};

const getUserInfo = () => {
  _selectUserByUsername({ username: mobilePhone.value })
    .then((res) => {
      loading.value = false;
      console.log(res);
      const userInfo = res || {};
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      router.push((route.query.redirect as string) || "/");
    })
    .catch(() => {
      loading.value = false;
    });
};
</script>

<template>
  <BgPic>
    <template #content>
      <div class="form">
        <h2 class="title">使用手机号码注册或登陆</h2>
        <van-space direction="vertical" fill :size="16">
          <van-cell-group :border="false">
            <van-field
              label-class="labelStyle"
              v-model="mobilePhone"
              :border="false"
              name="手机号"
              label="手机号"
              placeholder="手机号"
              :rules="[{ required: true, message: '请输入手机号' }]"
            />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-field
              v-model="password"
              :border="false"
              center
              clearable
              label="验证码"
              placeholder="短信验证码"
            >
              <template #button>
                <van-button size="small" class="buttonStyle" @click="sendCode">
                  <span
                    class="buttonTextStyle"
                    v-if="current.seconds === 60 || current.seconds === 0"
                    >获取验证码</span
                  >

                  <span class="buttonTextStyle" v-else
                    >{{ current.seconds + "秒" }}
                  </span>
                </van-button>
              </template>
            </van-field>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-button
              type="primary"
              size="large"
              class="submitButtonStyle"
              @click="submit"
              :loading="loading"
              >登录</van-button
            ></van-cell-group
          >
        </van-space>
      </div>
    </template>
  </BgPic>
</template>

<style scoped type="scss">
.title {
  height: 26px;
  font-size: 20px;
  font-weight: 400;
  color: #333333;
  line-height: 26px;
  margin-bottom: 24px;
}
.form .van-cell {
  width: 329px;
  height: 51px;
  background: #f5f5f5;
  border-radius: 24px 24px 24px 24px;
}
.buttonStyle {
  width: 105px;
  height: 41px;
  border-radius: 28px 28px 28px 28px;
  margin-right: -10px;
  background-color: var(--theme-color);
}
.buttonTextStyle {
  width: 70px;
  height: 19px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 19px;
}
.submitButtonStyle {
  width: 329px;
  height: 50px;
  background-color: var(--theme-color);
  border-radius: 50px 50px 50px 50px;
}
</style>
