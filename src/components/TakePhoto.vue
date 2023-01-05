<script setup lang="ts">
import { Toast } from "vant";
import { onMounted, ref } from "vue";

const emit = defineEmits(["update:visible"]);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  onChange: {
    type: Function,
    default: () => {},
  },
});

const isOpen = ref(false);
const checked = ref(false);
const videoRef: any = ref();
const photo = ref("");
const isError = ref(false);

onMounted(() => {
  // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
  if (navigator.mediaDevices === undefined) {
    // @ts-ignore
    navigator.mediaDevices = {};
  }

  // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
  // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // 首先，如果有getUserMedia的话，就获得它
      const getUserMedia =
        //    @ts-ignore
        navigator.webkitGetUserMedia ||
        //  @ts-ignore
        navigator.mozGetUserMedia ||
        //  @ts-ignore
        navigator.getUserMedia;

      // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      // 否则，为老的navigator.getUserMedia方法包裹一个Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
  // @ts-ignore
  if (window.stream) {
    //一进来的时候判断是否开着摄像头
    // @ts-ignore
    window.stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
});

// 开始采集
const startFn = () => {
  if (!checked.value) {
    return Toast("请先同意协议");
  }
  isOpen.value = true;
  setTimeout(() => {
    openCamera();
  });
};
const openCamera = () => {
  isError.value = false;
  const constraints = {
    //配置默认前置摄像头,以及手机上摄像头取到的画面宽高
    audio: false,
    video: {
      // width: CWidth,
      // height: CHeight,
      //   transform: "scaleX(-1)",
      // deviceId: 'default',
      sourceId: "default",
      // facingMode: { exact: 'user' },
      facingMode: "user",
    },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      // 旧的浏览器可能没有srcObject
      if ("srcObject" in videoRef.value) {
        setTimeout(() => {
          videoRef.value.srcObject = stream;
          videoRef.value.play().catch((e: any) => {
            console.log(e);
          });
        }, 0);
      } else {
        //  @ts-ignore 防止在新的浏览器里使用它，应为它已经不再支持了
        videoRef.value.src = window.URL.createObjectURL(stream);
      }
    })
    .catch((err) => {
      isError.value = true;
      console.info("打开相机失败", err.name + ": " + err.message);
      Toast("相机异常");
    });
};

const takePhoto = () => {
  if (isError.value) {
    return Toast("请确保相机正常工作");
  }
  const canvas = document.createElement("canvas"),
    ctx: any = canvas.getContext("2d");
  canvas.width = 480;
  canvas.height = 640;
  //位移来做镜像翻转
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1); //左右镜像翻转

  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  photo.value = canvas.toDataURL("image/jpeg");
  videoRef.value.pause();
};

// 提交
const submit = () => {
  emit("update:visible", false);
  props.onChange(photo.value);
};
// 重置
const reset = () => {
  photo.value = "";
  videoRef.value.play();
};
</script>
<template>
  <div class="photo-container">
    <div class="un-open" v-if="!isOpen">
      <div>
        <img
          @click="$emit('update:visible', false)"
          class="close"
          src="@/assets/images/close.png"
          alt=""
        />
        <h2>人脸照片采集</h2>
        <img class="photo" src="@/assets/images/photo.png" alt="" />
        <p>报名学车需要采集档案相片</p>
      </div>
      <div class="mt-[20px]">
        <div class="check">
          <van-checkbox v-model="checked">
            <template #icon="props">
              <img v-if="props.checked" src="@/assets/images/check.png" />
              <img v-else src="@/assets/images/un-check.png" />
            </template>
            <span class="a"
              >同意 <a href="">《隐私协议》</a><a href="">《用户协议》</a></span
            >
          </van-checkbox>
        </div>
        <van-button class="start" @click="startFn" type="primary" block round
          >开始采集</van-button
        >
      </div>
    </div>
    <div v-else class="open">
      <video
        ref="videoRef"
        webkit-playsinline="true"
        x-webkit-airplay="true"
        x5-playsinline="true"
        playsInline="true"
        autoPlay
      ></video>
      <img src="@/assets/images/stranger-full.png" class="bg" alt="" />
      <div v-if="!photo" class="opt">
        <van-button type="primary" @click="takePhoto" block round
          >点击拍照</van-button
        >
      </div>
      <div v-else class="opt">
        <van-button type="primary" @click="submit" block round class="mr-[10px]"
          >确认提交</van-button
        >
        <van-button @click="reset" block round>重新采集</van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.photo-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 9;
  background: #fff;
  .un-open {
    height: 100%;
    padding-bottom: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
    .close {
      width: 25px;
      height: 25px;
      margin: 6px 0 30px 16px;
    }
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #333333;
      line-height: 27px;
      letter-spacing: 1px;
      text-align: center;
    }
    .photo {
      width: 250px;
      height: 250px;
      margin: 28px auto 32px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #666660;
      line-height: 19px;
      text-align: center;
    }

    .check {
      display: flex;
      justify-content: center;

      img {
        width: 16px;
        height: 16px;
      }
      :deep(.van-checkbox__icon) {
        height: auto;
      }
      span {
        font-size: 12px;
        color: #4d4d4d;
        a {
          color: #5796eb;
        }
      }
    }
    .start {
      width: 329px;
      margin: 20px auto 0;
    }
  }
  .open {
    height: 100%;
    .bg {
      position: fixed;
      top: 0;
      //   z-index: 1;
      width: 100%;
    }
    video {
      object-fit: cover;
      width: 100%;
      height: 100%;
      transform: rotateY(180deg);
      position: fixed;
      top: 0;
    }
    .opt {
      position: fixed;
      bottom: 0;
      height: 100px;
      width: 100%;
      background: #fff;
      padding: 0 16px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
