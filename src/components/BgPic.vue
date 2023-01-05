<template>
  <div>
    <div class="bgPic">
      <img src="../statics/entry/arrow_left.png" class="arrow_icon" />
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bgPic {
  background: url("@/statics/entry/bg.png") no-repeat;
  height: 77vw;
  background-size: 100% 100%;
  background-color: #d94348;
  padding-top: 50px;
}
.arrow_icon {
  width: 25px;
  height: 25px;
  margin-left: 16px;
}
.content {
  margin-top: -12vw;
  height: calc(100vh - 65vw);
  width: 100%;
  border-radius: 5vw 5vw 0 0;
}

.content {
  :deep .form {
    width: 100%;
    height: 100%;
    border-radius: 5vw 5vw 0 0;
    background-color: white;
    padding: 32px 23px 0 23px;
  }
}
</style>
