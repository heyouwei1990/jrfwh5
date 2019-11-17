<template>
  <div class="webAlert">
    <transition enter-active-class="zoomIn" leave-active-class="zoomOut">
      <div class="alertInfo animated" v-show="alertInfoShow">
        <h4 class="headerAlert">流程进度提示</h4>
        <div class="main">
          <div class="processCon" v-for="(item, index) in step" :key="index">
            <div class="step" :class="{active: item.stepStatus}"><span>{{item.content}}</span></div>
            <i class="icon" v-if="index<step.length-1"></i>
          </div>
        </div>
        <div class="footerBtn" @click="alertShow = true">确定</div>
      </div>
    </transition>
    <transition enter-active-class="zoomIn" leave-active-class="zoomOut">
      <div class="alert animated" v-show="alertShow">
        <div class="alertclick">
          <div class="main">
            请登录后台继续完成楼盘资料上传
          </div>
          <div class="footerBtn">
            <span @click="comfirmClick">确定</span>
            <span @click="alertShow = false">取消</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'webAlert',
  data () {
    return {
      alertInfoShow: false,
      alertShow: false,
      step: [
        {
          content: '上传楼盘',
          stepStatus: true,
          step: 1
        },
        {
          content: '登录后台',
          stepStatus: false,
          step: 2
        },
        {
          content: '完善资料',
          stepStatus: false,
          step: 3
        },
        {
          content: '平台审核',
          stepStatus: false,
          step: 4
        },
        {
          content: '楼盘上架',
          stepStatus: false,
          step: 5
        }
      ]
    }
  },
  created () {
    this.alertInfoShow = true
  },
  methods: {
    comfirmClick () {
      window.location.href = 'http://md.jrfw360.com/'
    }
  }
}
</script>

<style lang="less" scoped>
  .webAlert{
    width: 100vw;
    height: 100vh;
    position: relative;
    .alertInfo{
      width: 80vw;
      height: 50vh;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 1px 1px 1px 1px @c9;
      border-radius: 3px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .headerAlert{
        width: 100%;
        height: 1.9rem;
        font-size: @FontSize16;
        font-weight: normal;
        line-height: 1.9rem;
        text-align: center;
        border-bottom: 1px solid @cD8D8D8;
      }
      .main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        padding: .5rem 0;
        .processCon{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          .step{
            width: 3.75rem;
            height: 1.25rem;
            text-align: center;
            font-size: @defaultFontSize;
            line-height: 1.25rem;
            color: @c9;
            border: 1px solid @c9;
            border-radius: 4px;
            &.active{
              color: @cf;
              border: 1px solid @cD14E33;
              background-color: @cD14E33;
            }
          }
          .icon{
            display: inline-block;
            width: .1rem;
            height: .6rem;
            background-color: @cD8D8D8;
            margin: .25rem 0;
          }
        }
      }
      .footerBtn{
        width: 100%;
        height: @footerHeight;
        font-size: @FontSize16;
        font-weight: bold;
        line-height: @footerHeight;
        text-align: center;
        color: #31AC48;
        border-top: 1px solid @cD8D8D8;
      }
    }
    .alert{
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      background-color: rgba(0, 0, 0, .3);
      .alertclick{
        width: 60%;
        height: 40%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

      }
    }
  }
</style>
