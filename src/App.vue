<template lang="html">
  <div id="app">
    <div class="downloadAPP" @click="appDownLoad" v-show="showAPP">
      <img class="APPImg" ref="APPImg" v-show="showAPP"
           :src="(roles===5 || type >= 9) ? 'http://img.jrfw360.com/108_108%E7%BB%BF.png' : ((type>3 && this.type < 9) ? 'http://img.jrfw360.com/108_108%E9%BB%84.png' : 'http://img.jrfw360.com/108_108%E8%93%9D.png')"/>
    </div>
    <div class="app" ref="app">
      <!-- <keep-alive :exclude="['homeMap','propertyReport']"> -->
        <router-view />
      <!-- </keep-alive> -->
      <!-- 微信分享提示 -->
      <div class="shareImg" id="shareImg" @click="click">
        <img src="./assets/shareImg.png"/>
      </div>
      <!-- 图片浏览器 -->
      <mt-popup
        class="browserPicture"
        v-model="popupVisible">
        <picture-browser v-if="popupVisible" :picList="picList" :defaultIndex="defaultIndex" @click="popupVisible = false"></picture-browser>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import common from './components/common'
import pictureBrowser from './components/pictureBrowser/PictureBrowser.vue'
import {getByAccountId} from './common/httpClient.js'
import util from './common/util.js'
// import jrfw from './assets/jrfw_top_bg.png'
[
  common
].forEach(item => {
  Vue.use(item)
})
export default {
  name: 'App',
  data () {
    return {
      popupVisible: false,
      defaultIndex: 0,
      picList: [],
      data: {},
      type: '',
      roles: '',
      accountId: '',
      loginToken: '',
      showAPP: true
    }
  },
  computed: {
    location () {
      return this.$store.state.locate.location
    }
  },
  components: {
    pictureBrowser
  },
  created () {
    // sessionStorage.setItem('newMsnCount', '')
  },
  mounted () {
    this.setWxShare()
    this.setPopup()
    this.setDealLink()
    this.setUserInfo()
  },
  updated () {
    if (!(this.$route.name === 'findHouse' ||
      this.$route.name === 'mine' ||
      this.$route.name === 'home' ||
      this.$route.name === 'newInfo' ||
      this.$route.name === 'recommend') ||
      util.isApp()) {
      this.showAPP = false
    } else {
      this.showAPP = true
    }
    if (sessionStorage.getItem('myId') || this.accountId) {
      this.setUserInfo()
    } else {
      return false
    }
    if (this.$route.name !== 'calculatorMortgage' && this.$route.name !== 'interestRate' && this.$route.name !== 'calculatorResult') {
      this.clearSessionStorage()
    }
  },
  activated () {
  },
  methods: {
    click (e) {
      e.currentTarget.style = ''
    },
    setWxShare () {
      this.wxShare({
        title: '今日房网',
        link: 'http://h5.jrfw360.com/home',
        desc: ''
      })
    },
    setPopup () {
      Vue.prototype.openPopupVisible = (picList, index) => {
        this.defaultIndex = index
        this.popupVisible = false
        this.picList = picList
        this.$nextTick(() => {
          this.popupVisible = true
        })
      }
      Vue.prototype.closePopupVisible = () => {
        this.popupVisible = false
      }
    },
    setUserInfo () {
      if (this.$route.name === 'protocol') {
        return false
      } else {
        // 默认读取 不需要强制登陆
        window.jrfw.getUserInfo().then(res => {
          // console.log(res)
          this.$store.commit('user/setUser', {
            id: res.id,
            phone: res.phone || res.hiddenPhone || '',
            userName: res.userName,
            avatar: res.avatar,
            type: res.type,
            authenticationFlag: res.authenticationFlag,
            loginToken: res.loginToken
          })
          this.accountId = res.id
          this.loginToken = res.loginToken
          let data = {
            'accountId': sessionStorage.getItem('myId') || this.accountId,
            'loginToken': sessionStorage.getItem('loginToken') || this.loginToken
          }
          // let _this = this
          getByAccountId(data).then((res) => {
            if (res && res.code === 1) {
              let userInfo = res.content.account
              this.roles = userInfo.roles
              this.type = userInfo.type
              this.$store.commit('user/setUser', {
                id: userInfo.id,
                phone: userInfo.phone || userInfo.hiddenPhone || '',
                userName: userInfo.yyUser.userName,
                avatar: userInfo.yyUser.avatar,
                type: userInfo.type,
                roles: userInfo.roles,
                authenticationFlag: userInfo.yyUser.authenticationFlag,
                loginToken: userInfo.loginToken
              })
            } else {
              // sessionStorage.clear()
              // localStorage.clear()
            }
          })
        })
      }
    },
    clearSessionStorage () {
      sessionStorage.setItem('activeXZ', '')
      sessionStorage.setItem('houseTypePrice', '')
      sessionStorage.setItem('loanMoney2', '')
      sessionStorage.setItem('monthNum-2', '')
      sessionStorage.setItem('monthNum-1', '')
      sessionStorage.setItem('interestRate-2', '')
      sessionStorage.setItem('interestRate-1', '')
    },
    setDealLink () {
      Vue.prototype.dealLink = (url) => {
        let name = ''
        if (/h5.jrfw360.com/.test(url)) { // 自己的h5地址
          let indexFirst = url.lastIndexOf('/')
          let indexEnd = url.indexOf('?') > -1 ? url.indexOf('?') : url.length
          name = url.substring(indexFirst + 1, indexEnd)
        } else if (/jrfw:\/\//.test(url)) { // app 地址
          if (/avtivity/.test(url)) { // 活动
            name = 'promote'
          } else if (/buildingSearch/.test(url)) { // 找房
            name = 'intentionProperty'
          } else if (/intention/.test(url)) { // 意向
            name = 'intention'
          } else if (/mapSearch/.test(url)) { // 找房
            name = 'homeMap'
          } else if (/more/.test(url)) { // 更多应用
            // this.toast('正在开发中......')
            name = 'more'
          }
        }
        if (name) {
          if (name === 'more') {
            this.appDownLoad()
          } else if (name === 'homeMap') {
            this.$router.push({path: '/home/map',
              query: {
                'lat': this.location.selectCityLat || this.location.lat,
                'lng': this.location.selectCityLng || this.location.lng
              }
            })
          } else {
            this.$router.push({name: name, query: this.getQueryString(url)})
          }
        } else {
          window.location.href = url
        }
      }
    },
    getQueryString (name) {
      var theRequest = {}
      if (name.indexOf('?') !== -1) {
        let strs = name.substr(name.indexOf('?') + 1, name.length).split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }
      return theRequest
    },
    appDownLoad () {
      if (this.roles === 5 || this.type >= 9) {
        if (navigator.userAgent.match(/Android/i)) {
          location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.steward'
        } else if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
          location.href = 'https://itunes.apple.com/cn/app/%E8%84%89%E6%A5%BC/id1457937506?mt=8'
        }
      } else if (this.type > 3 && this.type < 9) {
        if (navigator.userAgent.match(/Android/i)) {
          location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.broker'
        } else if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
          location.href = 'https://itunes.apple.com/cn/app/%E6%88%BF%E7%BB%8F%E7%BA%AA/id1456333516?mt=8'
        }
      } else {
        if (navigator.userAgent.match(/Android/i)) {
          location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.app'
        } else if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
          location.href = 'https://itunes.apple.com/cn/app/%E4%BB%8A%E6%97%A5%E6%88%BF%E7%BD%91/id1457181046?mt=8'
        }
      }
    }
  }
}
</script>

<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    width: 100%;
    height:100%;
    margin:0 auto;
    position: relative;
    text-align: justify;
    .adapInphone8{
      width: 100%;
      height: 22px;
    }
    .downloadAPP{
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      position: absolute;
      top: 80% !important;
      right: .4rem;
      z-index: 1999;
      img.APPImg{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        opacity: 0.5;
      }
      span.btnOpen{
        display: inline-block;
        width: 20%;
        padding: 0.35rem 0;
        background-color: @cF76C1D;
        margin-right: 0.35rem;
        font-size: 0.7rem;
        letter-spacing: 0;
        color: @cf;
        border-radius: 0.25rem;
        text-align: center;
      }
      .quickClick{
        width: 45%;
        /*height: 100%;*/
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 0.35rem 0;
        & span{
          flex-grow: 1;
          line-height: 1.15rem;
          &:nth-child(1){
            font-size: 0.8rem;
          }
          &:nth-child(2){
            font-size: 0.6rem;
          }
        }
      }
    }
    .app{
      height: 100%;
    }
  }
  a,a:hover,a:active,a:visited,a:link,a:focus{
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
    outline:none;
    background: none;
    text-decoration: none;
  }
  .more_loading{
    height: 2rem;
    line-height: 2rem;
    color: @c9;
    font-size: @smallFontSize;
    text-align: center;
    span{
      display: inline-block;
    }
  }
  html,body{
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .shareImg{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    z-index: 999;
    background-color: rgba(0,0,0,0.5);
    display: none;
    img{
      width: 70%;
      height: auto;
      margin-top: 30px;
      margin-left: 20%;
    }
    input{
      -webkit-appearance: none;
    }
  }
</style>
<style lang="less" scoped>
  #app .browserPicture{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,1);
  }
</style>
