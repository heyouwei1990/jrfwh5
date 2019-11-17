<template>
  <div class="downLoad" ref="cont">
    <div class="text">
      <span>长按图片扫描二维码</span>
      <span>关注微信公众号</span>
    </div>
    <img class="wxFollow" :src="wxFollow" alt="">
  </div>
</template>

<script>
import wxFollow from '../../../assets/wxJrfw.jpg'
export default {
  data () {
    return {
      wxFollow: wxFollow,
      textAlert: '长按图片扫描二维码关注微信公众号'
    }
  }
}

</script>

<style lang="less" scoped>
  .downLoad{
    height: 100%;
    background: url(./imgs/bg.png) no-repeat;
    background-position: center;
    background-size: cover;
    font-size: @largeFontSize;
    text-align: center;
    position: relative;
    .text{
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 9.5rem;
      font-size: @FontSize20;
      color: @c3;
      line-height: 1.4rem;
      text-align: center;
      position: absolute;
      top: 18%;
      left: 50%;
      transform: translateX(-50%);
    }
    .wxFollow{
      width: 10rem;
      height: 10rem;
      position: absolute;
      top: 27%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
