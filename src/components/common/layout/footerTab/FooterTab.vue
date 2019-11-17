<template lang="html">
  <div class="th_footer">
    <mt-tabbar v-model="myActive">
      <mt-tab-item id="home">
        <img slot="icon" :src="myActive === 'home'?homeT:homeF">
        首页
      </mt-tab-item>
      <mt-tab-item id="findHouse">
        <img slot="icon" :src="myActive === 'findHouse'?findHouseT:findHouseF">
        找房
      </mt-tab-item>
      <mt-tab-item id="recommend" @click.native="recommendFlag = true">
        <img slot="icon" :src="myActive === 'recommend'?recommendT:recommendF">
        推荐
      </mt-tab-item>
      <mt-tab-item id="newInfo">
        <i class="unReadInfoBoss" v-if="newMsnCount">{{newMsnCount > 99 ? '99+' : newMsnCount}}</i>
        <img slot="icon" :src="myActive === 'newInfo'?informationT:informationF">
        消息
      </mt-tab-item>
      <mt-tab-item id="mine">
        <img slot="icon" :src="myActive === 'mine'?mineT:mineF">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import homeF from './imgs/icon-home-false.png'
import homeT from './imgs/icon-home-true.png'
import findHouseF from './imgs/icon-findHouse-false.png'
import findHouseT from './imgs/icon-findHouse-true.png'
import recommendF from './imgs/icon-recommend-false.png'
import recommendT from './imgs/icon-recommend-true.png'
import informationF from './imgs/icon-information-false.png'
import informationT from './imgs/icon-information-true.png'
import mineF from './imgs/icon-mine-false.png'
import mineT from './imgs/icon-mine-true.png'
import {setInfoList} from '../../../../common/httpClient.js'
export default {
  props: {
    active: {
      type: String,
      default: 'home'
    }
  },
  data () {
    return {
      myActive: this.active,
      recommendFlag: false,
      homeF: homeF,
      homeT: homeT,
      findHouseF: findHouseF,
      findHouseT: findHouseT,
      recommendF: recommendF,
      recommendT: recommendT,
      informationF: informationF,
      informationT: informationT,
      mineF: mineF,
      mineT: mineT,
      newMsnCount: sessionStorage.getItem('newMsnCount') || 0
    }
  },
  watch: {
    myActive (val) {
      // console.log(val)
      if (val === 'recommend' && this.recommendFlag === true) {
        sessionStorage.setItem('active', 1)
      }
      if (val === 'mine' && navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && (!this.userInfo.id || !this.userInfo.loginTaken) && !window.jrfw.getIsWxClient()) {
        this.toast('请下载APP或关注微信公众号查看更多内容')
        this.$router.push({name: 'downLoad'})
        // window.location.href = 'http://h5.jrfw360.com/downLoad'
      }
      this.$router.replace(val)
    },
    newMsnCount (newVal, oldVal) {
      this.timer()
    }
  },
  activated () {
    this.myActive = this.$route.name
  },
  components: {

  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    }
  },
  mounted () {
    // console.log(this.myActive)
  },
  created () {
    this.timer()
  },
  updated () {
  },
  destroyed () {
    // clearTimeout(this.timer)
  },
  methods: {
    timer () {
      setTimeout(() => {
        this.setInfoList()
      }, 100)
    },
    setInfoList () {
      let data = {
        'accountId': this.userInfo.id
      }
      setInfoList(data).then((res) => {
        // private Long reportNum;// 报备数量
        // private Long msnNum;// 群聊未读数量
        // private Long commendNum;// 推荐楼盘数量
        // private Long followNum;// 订阅数量
        // private Long customDynamicNum;// 客户动态
        // private Long systemNum;// 系统通知
        // private Long dynamicCount;// 楼盘动态
        // private Long newMsnCount;// 新消息总数
        let cont = res && res.content
        if (cont && cont.newMsnCount) {
          this.newMsnCount = cont.newMsnCount
          sessionStorage.setItem('newMsnCount', cont.newMsnCount)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.th_footer{
  width: 100%;
  height: 55px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  & /deep/ .mint-tabbar{
    background: @cf;
    .mint-tab-item-icon{
      text-align: center;
      position: relative;
      img{
        width: auto;
        height: auto;
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .mint-tab-item-label{
      position: relative;
      .unReadInfoBoss{
        width: 1rem;
        height: 1rem;
        line-height: 1rem;
        background-color: #D14E33;
        font-size: 12px;
        color: #fff;
        border-radius: 50%;
        position: absolute;
        bottom: 25px;
        right: auto;
        transform: translateX(15px);
        text-align: center;
      }
    }
    .mint-tab-item.is-selected {
      color: @c1B1A78;
      background: @cf;
      .unReadInfoBoss{
        color: #fff;
        bottom: 30px;
      }
    }
  }
}
</style>
