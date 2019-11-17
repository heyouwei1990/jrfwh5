<template>
  <div class="th_property_detail">
    <div ref="layBox" v-if="reFresh" class="property_detail" :style="computeStyle">
      <div class="header" :class="{
      isJrfwFjj:isJrfwFjj,
      isJrfwFgj:isJrfwFgj
    }">
        <th-back-btn slot='left'></th-back-btn>
        <span class="title">{{baseInfo.name}}</span>
        <span class="soy"></span>
      </div>
      <div class="th_property_detail-cont" ref="cont" :style="contStyle">
        <th-swiper :bannerList="bannerList" v-if="bannerList" @click="goBrowserRes"></th-swiper>
        <th-base-info :baseInfo="baseInfo" v-if="baseInfo" @openSubscribe="openSubscribe"></th-base-info>
        <th-promote :promoteInfo="promoteInfo" v-if="promoteInfo"></th-promote>
        <th-look-house :lookHouseInfo="baseInfo && baseInfo.houseServiceIds"></th-look-house>
        <th-dynamic :dynamic="dynamic" :propertyId="baseInfo && baseInfo.id"  :num='dynamicNum' v-if="dynamic" @openSubscribe="openSubscribe"></th-dynamic>
        <th-house-type :houseType='buildingModelType' :propertyId="baseInfo && baseInfo.id" :num='houseTypeNum' v-if="houseTypeNum !== 0 && buildingModelType"></th-house-type>
        <th-building :baseInfo="baseInfo" v-if="baseInfo.panorama"></th-building>
        <th-surrounding :baseInfo="baseInfo" v-if="baseInfo"></th-surrounding>
        <th-exchange :buildScore="buildScore" v-if="buildScore"></th-exchange>
      </div>
      <th-footer
        slot="footer"
        ref="footer"
        :isFavorite="isFavorite"
        :booking="booking"
        @addFavorite="addFavorite"
        @addSubscribe="addSubscribe"
        @chat='chat'
        @goReport="goReport"
        @share="share"
        v-if="routeName === 'invitePropertyDetail'">
      </th-footer>
    </div>
    <div class="showImg" id="showImg" ref="shareImg" @click="openInternet = false" v-show="openInternet">
      <div class="modelAlert">
      </div>
      <img src="../../../assets/openInternet.png"/>
    </div>
  </div>
</template>

<script>
import {scanMethod, setPropertyDetail, addFavorite, addSubscribe, setGroupMsnList} from '../../../common/httpClient.js'
import ThSwiper from '../../../components/swiper/Swiper.vue'
import ThBaseInfo from './baseInfo/baseInfo'
import ThPromote from './promote/promote'
import ThLookHouse from './lookHouse/lookHouse'
import ThDynamic from './dynamic/dynamic'
import ThHouseType from './houseType/houseType'
import ThBuilding from './building/building'
import ThSurrounding from './surrounding/surrounding'
import ThExchange from './exchange/exchange'
import ThBackBtn from '../../../components/base/backBtn/BackBtn.vue'
import ThFooter from './footer/footer'
import store from '../../../store'
export default {
  data () {
    return {
      id: this.$route.params.id,
      type: this.$store.state.user.user.type,
      routeName: this.$route.name,
      isJrfwFjj: window.jrfw.isJrfwFjj(),
      isJrfwFgj: window.jrfw.isJrfwFgj(),
      selected: '',
      bannerList: [
        // {
        //   linkUrl: '',
        //   picPath: 'http://img.jrfw360.com/manage/1540020385949.jpg'
        // }
      ],
      baseInfo: null,
      promoteInfo: null,
      buildScore: null,
      buildingModelType: null,
      houseTypeNum: 0,
      dynamic: null,
      dynamicNum: 0,
      newsList: [],
      isFavorite: false, // 是否收藏
      shareInfo: {},
      reFresh: true,
      openInternet: false,
      popupVisible: false, // 订阅面板
      booking: null, // 订阅的数据
      message: '已安装房经纪APP请点击右上角选择浏览器打开，没有则点击取消'
    }
  },
  components: {
    ThSwiper,
    ThBaseInfo,
    ThPromote,
    ThLookHouse,
    ThDynamic,
    ThHouseType,
    ThBuilding,
    ThSurrounding,
    ThExchange,
    ThBackBtn,
    ThFooter
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    },
    location () {
      return this.$store.state.locate.location
    },
    computeStyle () {
      return {
        height: this.routeName === 'propertyD' ? 'calc(100% + 55px)' : '100%'
      }
    },
    contStyle () {
      return {
        height: (this.routeName === 'propertyD' || this.routeName === 'invitePropertyDetail') ? 'calc(100% - 99px)' : '100%'
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id
    this.setPropertyDetail()
    this.$refs.cont.scrollTop = 0
    to.meta.scrollTop = 0
    next()
  },
  created () {
    this.id = this.$route.params.id
    this.setPropertyDetail()
  },
  mounted () {
  },
  updated () {
  },
  destroyed () {
    clearTimeout(this.time)
  },
  methods: {
    setPropertyDetail () {
      let data = {
        'accountId': this.userInfo.id,
        'id': this.id,
        'lat': this.location.lat,
        'lng': this.location.lng
        // 'loginToken': this.userInfo.loginToken
      }
      this.reFresh = false
      setPropertyDetail(data).then((res) => {
        if (res && res.code === 1) {
          this.reFresh = true
          let cont = res && res.content
          this.bannerList.push({linkUrl: '', picPath: cont.buildingInfo.logo})
          this.bannerList = cont.buildingInfo && cont.buildingInfo.attachment
          this.baseInfo = cont.buildingInfo
          // console.log(this.baseInfo)
          this.buildingModelType = cont.buildingModelType
          this.houseTypeNum = cont.buildingModelTypeSize
          this.baseInfo.buildTypeList = cont.buildTypeList
          this.promoteInfo = cont.activity
          this.buildScore = cont.buildScore
          this.dynamic = cont.buildingNews
          this.dynamicNum = cont.newsNum
          this.shareInfo = cont.shareInfo
          this.wxShare(this.shareInfo)
          this.isFavorite = cont.isFavorite
          this.booking = cont.booking
          document.title = this.baseInfo.name
          this.$route.meta.title = this.baseInfo.name
        } else {
          this.toast(res.msg || '错误编号ox10001')
          if (window.jrfw.isApp()) {
            window.jrfw.back()
          } else {
            history.back()
          }
        }
      })
    },
    openSubscribe () {
      this.$refs.footer.subscribe()
    },
    addFavorite () {
      let data = {
        'accountId': this.userInfo.id,
        'lat': this.location.lat,
        'lng': this.location.lng,
        'targetId': this.id,
        'targetType': 1 // 1楼盘 2新闻
      }
      addFavorite(data).then((res) => {
        if (res.code === 1) {
          this.isFavorite = res.content === 1
          // this.toast(res.msg || '收藏')
        } else if (!this.userInfo.id) {
          this.toast('请先登陆...')
        } else {
          this.toast(res.msg || '错误编号ox10001')
        }
      })
    },
    addSubscribe (params) {
      let data = {
        'accountId': this.userInfo.id,
        'buildGroupId': this.$route.params.id,
        'discount': false,
        'news': false,
        'sale': false
      }
      addSubscribe(Object.assign(data, params)).then((res) => {
        if (res.code === 1) {
          this.toast(res.content || '订阅')
        } else {
          this.toast('接口异常，请稍后再试')
        }
      })
    },
    goBrowserRes (index) {
      this.$router.push({name: 'browserRes', params: {id: this.id}})
    },

    goReport () {
      if (!this.userInfo || !this.userInfo.loginToken) { // APP && 未登录
        if (window.jrfw.isApp()) {
          window.jrfw.getUserInfo({force: true}).then(res => {
            store.commit('user/setUser', {
              id: res.id,
              phone: res.phone,
              userName: res.userName,
              avatar: res.avatar,
              loginToken: res.loginToken,
              type: res.type,
              authenticationFlag: res.authenticationFlag
            })
          })
        } else if (window.jrfw.getIsWxClient()) {
          let data = {
            'accountId': this.userInfo.id,
            'ids': this.$route.params.id,
            'inviteId': this.$route.query.accountId
          }
          scanMethod(data).then((res) => {
            if (res.code === 1) {
              if (window.confirm(this.message)) {
                this.openInternet = true
              } else {
                if (navigator.userAgent.match(/Android/i)) {
                  window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.broker'
                } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                  window.location.href = 'https://itunes.apple.com/cn/app/%E6%88%BF%E7%BB%8F%E7%BA%AA/id1456333516?mt=8'
                }
              }
            } else {
              this.toast(res.msg)
              this.$router.push({
                name: 'bindPhone',
                query: {
                  routerName: this.$route.fullPath
                }
              })
            }
          })
        } else {
          if (navigator.userAgent.match(/Android/i)) {
            window.location.href = 'fjj://housing/detail?buildingGroupId=' + this.$route.params.id + '&accountId=' + this.$route.query.accountId
            let loadDateTime = Date.now()
            this.timer = setTimeout(() => {
              let timeOutDateTime = Date.now()
              if ((timeOutDateTime - loadDateTime) > 500) {
                window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.broker'
              }
            }, 3000)
          } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.location.href = 'jrfwinviteschemes://houseDetail?id=' + this.$route.params.id + '&accountId=' + this.$route.query.accountId
            let loadDateTime = Date.now()
            this.timer = setTimeout(() => {
              let timeOutDateTime = Date.now()
              if ((timeOutDateTime - loadDateTime) > 3000) {
                window.location.href = 'https://itunes.apple.com/cn/app/%E6%88%BF%E7%BB%8F%E7%BA%AA/id1456333516?mt=8'
              }
            }, 3000)
          }
        }
      } else {
        if (window.jrfw.getIsWxClient()) {
          if (window.confirm(this.message)) {
            this.openInternet = true
          } else {
            if (navigator.userAgent.match(/Android/i)) {
              window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.broker'
            } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
              window.location.href = 'https://itunes.apple.com/cn/app/%E6%88%BF%E7%BB%8F%E7%BA%AA/id1456333516?mt=8'
            }
          }
        } else {
          if (navigator.userAgent.match(/Android/i)) {
            window.location.href = 'fjj://housing/detail?buildingGroupId=' + this.$route.params.id + '&accountId=' + this.$route.query.accountId
            let loadDateTime = Date.now()
            this.timer = setTimeout(() => {
              let timeOutDateTime = Date.now()
              if ((timeOutDateTime - loadDateTime) > 500) {
                window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.broker'
              }
            }, 3000)
          } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.location.href = 'jrfwinviteschemes://houseDetail?id=' + this.$route.params.id + '&accountId=' + this.$route.query.accountId
            let loadDateTime = Date.now()
            this.timer = setTimeout(() => {
              let timeOutDateTime = Date.now()
              if ((timeOutDateTime - loadDateTime) > 3000) {
                window.location.href = 'https://itunes.apple.com/cn/app/%E6%88%BF%E7%BB%8F%E7%BA%AA/id1456333516?mt=8'
              }
            }, 3000)
          }
        }
      }
    },
    clickTX () {
      this.openInternet = !this.openInternet
    },
    goLookHouse (type) {
      this.$router.push({path: `/propertyServiceDetail/${this.id}`,
        query: {
          type: type,
          buildingGroupName: this.baseInfo.name,
          houseServiceIds: this.baseInfo.houseServiceIds
        }})
    },
    chat () {
      if (!this.userInfo || !this.userInfo.loginToken) { // APP && 未登录
        if (window.jrfw.isApp()) {
          window.jrfw.getUserInfo({force: true}).then(res => {
            store.commit('user/setUser', {
              id: res.id,
              phone: res.phone,
              userName: res.userName,
              avatar: res.avatar,
              loginToken: res.loginToken,
              type: res.type,
              authenticationFlag: res.authenticationFlag
            })
          })
        } else {
          this.toast('请在微信公众号授权登录或在APP注册登录')
        }
      } else {
        let data = {
          'accountId': this.userInfo.id,
          'bulidingGroupId': this.id,
          'otherAccountId': this.$route.query.accountId || '',
          'pageNo': 1,
          'pageSize': 10
        }
        setGroupMsnList(data).then((res) => {
          console.log(res.content)
          let cont = res && res.content
          // return Api.H5_HTTP_URL + "propertyReport/" + id + "?buildingGroupName=" + housingName + "&" + H5_TOP_BAR;
          this.$router.push({
            path: '/chat/' + cont.groupId,
            query: {
              groupType: this.$route.query.accountId ? 3 : 1,
              accountId: this.$route.query.accountId || '',
              buildingGroupId: this.id,
              groupName: this.baseInfo.name
            }
          })
        })
      }
    },
    share () {
      this.wxShare(this.shareInfo, true)
    }
  }
}
</script>

<style lang="less" scoped>
.th_property_detail{
  height: 100%;
  position: relative;
  .header{
    width: 100vw;
    height: @headerHeight;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .lineargGradient;
    &.isJrfwFgj{
      .lineargGradientFgj;
    }
    &.isJrfwFjj{
      .lineargGradientFjj;
    }
    span{
      display: inline-block;
      line-height: @headerHeight;
      font-size: @FontSize16;
      color: @cf;
    }
  }
  .th_property_detail-cont{
    width: 100vw;
    height: calc(100vh  - @headerHeight - 55px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .th_swiper{
      padding-top: @imgBase;
      & /deep/ .mint-swipe{
        .mint-swipe-item{
          .th_img-box{
            padding-top: @imgBase
          }
        }
      }
    }
    /deep/ .th_cell{
      position: relative;
      &:after{
        content: '';
        width: calc(100% + @plrPage);
        height: 0;
        display: block;
        border-bottom: 1px solid @cD8D8D8;
      }
    }
  }
  .showImg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
    img {
      width: 70%;
      height: auto;
      margin-top: 30px;
      margin-left: 20%;
    }
  }
}
</style>
