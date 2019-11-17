<template>
  <div class="downLoad" ref="cont">
    <router-link to="/home" class="close"><img :src="downloadClose" alt=""></router-link>
    <div class="icon">
      <th-img-box :imgUrl="icon"></th-img-box>
      <p>{{downLOadName}}</p>
    </div>
    <div class="btn">
      <div class="wx_downLoad" :class="(this.userInfo.roles === 5 || this.userInfo.type >= 9) ? 'isJrfwFgj' : ((this.userInfo.type > 3 && this.userInfo.type < 9) ? 'isJrfwFjj' : 'isJrfw')" @click="downLoad">下载APP</div>
      <div class="wx_follow" :class="(this.userInfo.roles === 5 || this.userInfo.type >= 9) ? 'isJrfwFgj' : ((this.userInfo.type > 3 && this.userInfo.type < 9) ? 'isJrfwFjj' : 'isJrfw')" @click="followMe">关注公众号</div>
    </div>
  </div>
</template>

<script>
import downloadClose from '../../../assets/download_close.png'
export default {
  data () {
    return {
      icon: '',
      downLOadName: '',
      downloadClose: downloadClose
    }
  },
  computed: {
    userInfo: {
      get () {
        return this.$store.state.user.user
      }
    }
  },
  created () {
    this.icon = (this.userInfo.roles === 5 || this.userInfo.type >= 9) ? 'http://img.jrfw360.com/108_108%E7%BB%BF.png' : ((this.userInfo.type > 3 && this.userInfo.type < 9) ? 'http://img.jrfw360.com/108_108%E9%BB%84.png' : 'http://img.jrfw360.com/108_108%E8%93%9D.png')
    this.downLOadName = (this.userInfo.roles === 5 || this.userInfo.type >= 9) ? '房管家' : ((this.userInfo.type > 3 && this.userInfo.type < 9) ? '房经纪' : '今日房网')
  },
  methods: {
    downLoad () {
      this.$parent.appDownLoad()
    },
    followMe () {
      // let ua = navigator.userAgent.toLowerCase()
      // // let isWeixin = ua.indexOf('micromessenger') != -1
      // if (ua.match(/MicroMessenger/i) === 'micromessenger') {
      //   window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU4NjU4MjUzMw==&scene=126&bizpsid=0&subscene=0#wechat_redirect'
      // } else {
      //   this.toast('请下载APP或关注微信公众号查看更多内容')
      // }
      window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU4NjU4MjUzMw==&scene=126&bizpsid=0&subscene=0#wechat_redirect'
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
    .close{
      width: 1rem;
      height: 1rem;
      position: absolute;
      top: .5rem;
      left: .5rem;
      img{
        width: 1rem;
        height: 1rem;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .icon{
      width: 3.6rem;
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translateX(-50%);
    }
    .btn{
      width: 100vw;
      height: 2.2rem;
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .wx_follow,
    .wx_downLoad{
      height: 100%;
      width: 5.5rem;
      font-size: @FontSize18;
      color: @cf;
      border-radius: 5px;
      text-align: center;
      line-height: 2.2rem;
      margin: 0 0.5rem;
    }
    .isJrfwFgj{
      .lineargGradientFgj;
    }
    .isJrfwFjj{
      .lineargGradientFjj;
    }
    .isJrfw{
      .lineargGradient;
    }
  }

</style>
