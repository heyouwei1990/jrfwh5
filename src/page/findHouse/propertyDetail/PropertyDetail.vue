<template>
  <div class="th_property_detail">
    <th-layout ref="layBox" v-if="reFresh">
      <div class="th_property_detail-cont" ref="cont" id="">
        <th-swiper :bannerList="bannerList" v-if="bannerList" @click="goBrowserRes"></th-swiper>
        <th-base-info :baseInfo="baseInfo" v-if="baseInfo" @openSubscribe="openSubscribe"></th-base-info>
        <th-promote :promoteInfo="promoteInfo" v-if="promoteInfo"></th-promote>
        <th-look-house :lookHouseInfo="baseInfo && baseInfo.houseServiceIds" v-if="baseInfo.houseServiceIds && baseInfo.houseServiceIds!==null" @click="goLookHouse"></th-look-house>
        <th-dynamic :dynamic="dynamic" :propertyId="baseInfo && baseInfo.id"  :num='dynamicNum' v-if="dynamic" @openSubscribe="openSubscribe"></th-dynamic>
        <th-house-type :houseType='buildingModelType' :propertyId="baseInfo && baseInfo.id" :num='houseTypeNum' v-if="houseTypeNum !== 0 && buildingModelType"></th-house-type>
        <th-building :baseInfo="baseInfo" v-if="baseInfo.panorama"></th-building>
        <th-surrounding :baseInfo="baseInfo" v-if="baseInfo"></th-surrounding>
        <th-exchange :buildScore="buildScore" v-if="buildScore"></th-exchange>
        <th-recommend :recommend="recommend" v-if="recommend && !this.$route.query.accountId && !this.$route.query.from" id="recommend"></th-recommend>
      </div>
    </th-layout>
    <th-footer
      slot="footer"
      ref="footer"
      :isFavorite="isFavorite"
      :booking="booking"
      @addFavorite="addFavorite"
      @addSubscribe="addSubscribe"
      @chat='chat'
      @goReport="goReport"
      @share="share">
    </th-footer>
  </div>
</template>

<script>
import {setPropertyDetail, addFavorite, addSubscribe, setGroupMsnList} from '../../../common/httpClient.js'
import ThSwiper from '../../../components/swiper/Swiper.vue'
import ThBaseInfo from './baseInfo/baseInfo'
import ThPromote from './promote/promote'
import ThLookHouse from './lookHouse/lookHouse'
import ThDynamic from './dynamic/dynamic'
import ThHouseType from './houseType/houseType'
import ThBuilding from './building/building'
import ThSurrounding from './surrounding/surrounding'
import ThExchange from './exchange/exchange'
import ThRecommend from './recommend/recommend'
import ThFooter from './footer/footer'
import store from '../../../store'
export default {
  data () {
    return {
      id: this.$route.params.id,
      type: this.$store.state.user.user.type,
      selected: '',
      bannerList: [
        // {
        //   linkUrl: '',
        //   picPath: 'http://img.jrfw360.com/manage/1540020385949.jpg'editionType=show
        // }
      ],
      baseInfo: null,
      promoteInfo: null,
      buildScore: null,
      buildingModelType: null,
      houseTypeNum: 0,
      dynamic: null,
      dynamicNum: 0,
      recommend: {
        nearBuildingList: null,
        samePriceList: null,
        recommendFix: false
      },
      phoneIsShow: '',
      newsList: [],
      isFavorite: false, // 是否收藏
      shareInfo: {},
      reFresh: true,
      popupVisible: false, // 订阅面板
      booking: null // 订阅的数据
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
    ThRecommend,
    ThFooter
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    },
    location () {
      return this.$store.state.locate.location
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
    // console.log(this.$route)
    this.id = this.$route.params.id
    sessionStorage.setItem('linkId', this.$route.params.id)
    this.setPropertyDetail()
  },
  mounted () {
    // this.clearSessionStorage()
    // console.log(document.getElementById('recommend').offsetTop)
  },
  updated () {
    if (!this.$route.query.accountId) {
      document.getElementsByClassName('th_property_detail-cont')[0].addEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    // 获取滚动条高度
    handleScroll () {
      let recommendOffsetTop = document.getElementById('recommend').offsetTop
      let recommendScrollTop = document.getElementsByClassName('th_property_detail-cont')[0].scrollTop
      if (recommendOffsetTop <= recommendScrollTop) {
        this.recommend.recommendFix = true
      } else {
        this.recommend.recommendFix = false
      }
    },
    setPropertyDetail () {
      let data = {
        'accountId': this.userInfo.id || this.$route.query.accountId,
        // 'loginToken': this.userInfo.loginToken,
        'id': this.id,
        'lat': this.location.lat,
        'lng': this.location.lng
      }
      this.reFresh = false
      setPropertyDetail(data).then((res) => {
        if (res && res.code === 1) {
          this.reFresh = true
          let cont = res && res.content
          this.bannerList = cont.buildingInfo && cont.buildingInfo.attachment
          this.bannerList.push({linkUrl: '', picPath: cont.buildingInfo.logo})
          this.baseInfo = cont.buildingInfo
          if (this.baseInfo.phoneIsShow) {
            this.phoneIsShow = 1
          } else {
            this.phoneIsShow = 0
          }
          sessionStorage.setItem('propertyService', this.baseInfo.houseServiceIds)
          this.buildingModelType = cont.buildingModelType
          this.houseTypeNum = cont.buildingModelTypeSize
          this.baseInfo.buildTypeList = cont.buildTypeList
          this.promoteInfo = cont.activity
          this.buildScore = cont.buildScore
          this.dynamic = cont.buildingNews
          this.dynamicNum = cont.newsNum
          this.$set(this.recommend, 'nearBuildingList', cont.nearBuildingList)
          this.recommend.nearBuildingList = cont.nearBuildingList
          this.recommend.samePriceList = cont.samePriceList
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
        'accountId': this.userInfo.id || this.$route.query.accountId,
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

    /**
     * 清除本地数据
     */
    clearSessionStorage () {
      sessionStorage.setItem('selectPropertyList', '')
      sessionStorage.setItem('selectPropertyTextList', '')
      sessionStorage.setItem('selectPropertyRemarkList', '')
      sessionStorage.setItem('selectPhoneIsShowList', '')
      sessionStorage.setItem('reportData', '')
      sessionStorage.setItem('report-content', '')
      sessionStorage.setItem('report-phone', '')
      sessionStorage.setItem('report-backPhone', '')
      sessionStorage.setItem('report-username', '')
      sessionStorage.setItem('report-visitorNum', '')
      sessionStorage.setItem('report-sex', '')
      sessionStorage.setItem('firstTakeLook', '')
      sessionStorage.setItem('secondTakeLook', '')
      sessionStorage.setItem('thirdTakeLook', '')
      sessionStorage.setItem('telephone', '')
      sessionStorage.setItem('firstVisitTime', '')
      sessionStorage.setItem('secondVisitTime', '')
      sessionStorage.setItem('thirdVisitTime', '')
    },
    goReport () {
      if (!this.userInfo || !this.userInfo.loginToken) { // APP && 未登录
        if (navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && !window.jrfw.getIsWxClient()) {
          this.toast('请下载APP或关注微信公众号查看更多内容')
          this.$router.push({name: 'downLoad'})
          // window.location.href = 'http://h5.jrfw360.com/downLoad'
        } else if (window.jrfw.isApp()) {
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
      } else if ((this.userInfo.id || this.userInfo.loginTaken) && this.userInfo.phone === '') {
        if (navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && window.jrfw.getIsWxClient()) {
          this.$router.push({
            name: 'bindPhone',
            query: {
              routerName: this.$route.fullPath
            }
          })
        }
      } else {
        this.$router.push({path: `/propertyReport/${this.id}`,
          query: {
            buildingGroupName: this.baseInfo.name,
            accountId: this.$route.query.accountId
          }
        })
      }
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
        if (navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && !window.jrfw.getIsWxClient()) {
          this.toast('请下载APP或关注微信公众号查看更多内容')
          this.$router.push({name: 'downLoad'})
          // window.location.href = 'http://h5.jrfw360.com/downLoad'
        } else if (window.jrfw.isApp()) {
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
          // console.log(res.content)
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
  .th_property_detail-cont{
    width: 100%;
    // overflow: hidden;
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
}
</style>
