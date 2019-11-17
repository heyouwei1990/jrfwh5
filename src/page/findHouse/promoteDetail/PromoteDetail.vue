<template>
  <div class="th_promote_detail">
    <!--<span class="linkBtn" @click="clickBtn">&it;</span>-->
    <div :class="isIos? 'none' : 'th_news_detail-share'" @click="share">分享</div>
    <th-layout v-if="promoteDetail" :hiddenFooter="true">
      <div class="th_promote_detail-box" :style="computeStyle" ref="cont">
        <th-img-box class="th_promote_detail-img" :imgUrl="promoteDetail.picPath"></th-img-box>
        <div class="th_promote_detail-cont">
          <div class="th_promote_detail-title">
            {{promoteDetail.buildingGroupName}}
            <span>[{{promoteDetail.title}}]</span>
          </div>
          <ul class="th_promote_detail-info">
            <li>已有{{promoteDetail.joinNum || 0}}人参与</li>
            <li >{{timeShow? '剩余时间：' + fromDate() : '活动已结束'}}</li>
          </ul>
          <ul>
            <li>
              <th-cell :cellData="{title:'流程与详情'}"></th-cell>
              <div class="th_property_list-item-info">
                <div><span>活动详情：</span></div>
                <div class="content"><span>{{promoteDetail.content}}</span></div>
                <div><span>适用范围：</span><span>{{promoteDetail.useRange}}</span></div>
                <div><span>使用方法：</span><span>{{promoteDetail.useMethod}}</span></div>
                <div><span>服务承诺：</span><span>{{promoteDetail.service}}</span></div>
              </div>
            </li>
            <li>
              <th-cell :cellData="{title:'楼盘详情'}"></th-cell>
              <div class="th_property_list-item-info">
                <div><span>均&emsp;&emsp;价：</span><span>{{promoteDetail.price}}元/㎡</span></div>
                <div><span>开盘时间：</span><span>{{promoteDetail.beginSellDate | formatTime('YMD_')}}</span></div>
                <div><span>地&emsp;&emsp;址：</span><span>{{$route.query.name? promoteDetail.cityName + promoteDetail.districtName + promoteDetail.streetName : promoteDetail.address}}</span></div>
              </div>
            </li>
          </ul>
          <div class="th_promote_detail-more" @click="click"><span>更多详情</span></div>
        </div>
      </div>
    </th-layout>
    <th-footer slot="footer" v-if="!$route.query.name" @call="call" @goReport="goReport" @chat="chat"></th-footer>
  </div>
</template>

<script>
import {setPropertyDetail, setPromoteDetail, setSignUpPromote, setGroupMsnList, signUp} from '../../../common/httpClient.js'
import ThFooter from './footer/footer'
import store from '../../../store'
export default {
  data () {
    return {
      selected: '',
      shareInfo: {},
      id: this.$route.params.id,
      promoteDetail: null,
      phone: '',
      endDate: '',
      timeShow: true,
      isIos: window.jrfw.isIos()
    }
  },
  components: {
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
        height: this.$route.query.name ? 'calc(100% + 44px)' : '100%'
      }
    }
  },
  mounted () {
    // this.setData()
  },
  created () {
    this.id = this.$route.params.id
    this.setData()
  },
  activated () {
  },
  methods: {
    share () {
      this.wxShare({
        title: this.shareInfo.title,
        imgUrl: this.shareInfo.imageUrl,
        link: this.shareInfo.url,
        desc: this.shareInfo.description
      }, true)
    },
    setData () {
      setPromoteDetail({id: this.id}).then((res) => {
        let cont = res && res.content
        this.promoteDetail = cont && cont.activity
        this.phone = cont.activity.phone
        this.endDate = cont.activity.endDate
        this.shareInfo = cont.shareInfo
        this.fromDate()
        this.wxShare(cont.shareInfo)
      })
    },
    click () {
      if (window.jrfw.isApp()) {
        window.jrfw.getUserInfo({force: true}).then(res => {
          let data = {
            'accountId': res.id,
            'id': this.promoteDetail.buildingGroupId,
            'lat': this.location.lat,
            'lng': this.location.lng
            // 'loginToken': this.userInfo.loginToken
          }
          setPropertyDetail(data).then((res) => {
            if (res && res.code === 1) {
              if (navigator.userAgent.match(/Android/i)) {
                window.location.href = 'fjj://housing/detail?buildingGroupId=' + this.promoteDetail.buildingGroupId
              } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                window.location.href = 'jrfwinviteschemes://houseDetail?id=' + this.promoteDetail.buildingGroupId
              }
            } else {
              this.toast(res.msg || '错误编号ox10001')
              window.jrfw.back()
            }
          })
        })
      } else {
        let data = {
          'accountId': this.userInfo.id,
          'id': this.promoteDetail.buildingGroupId,
          'lat': this.location.lat,
          'lng': this.location.lng
        }
        setPropertyDetail(data).then((res) => {
          if (res && res.code === 1) {
            if (this.$route.query.name) {
              if (this.$route.query.accountId) {
                this.$router.push({
                  name: this.$route.query.name,
                  params: {id: this.promoteDetail.buildingGroupId},
                  query: {
                    'accountId': this.$route.query.accountId
                  }
                })
              } else {
                this.$router.push({
                  name: this.$route.query.name,
                  params: {id: this.promoteDetail.buildingGroupId}
                })
              }
            } else {
              this.$router.push({name: 'propertyDetail', params: {id: this.promoteDetail.buildingGroupId}})
            }
          } else {
            this.toast(res.msg || '错误编号ox10001')
            history.back()
          }
        })
      }
      // this.$router.push({name: 'propertyDetail', params: {id: this.promoteDetail.buildingGroupId}})
    },
    call () {
      window.location.href = `tel:` + this.phone
    },
    goReport () {
      if (this.$route.query.name) {
        // this.toast('请下载APP进行下一步操作')
        return false
      } else {
        if (!this.userInfo || !this.userInfo.loginToken) { // APP && 未登录
          if (navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && window.jrfw.getIsWxClient()) {
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
        } else if (!this.userInfo.phone) {
          if (navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && window.jrfw.getIsWxClient()) {
            this.$router.push({
              name: 'bindPhone',
              query: {
                routerName: this.$route.fullPath
              }
            })
          }
        } else {
          signUp({id: this.id}).then((res) => {
            // console.log(res)
            if (res && res.code === 1) {
              this.$router.push({path: `/propertyReport/${this.promoteDetail.buildingGroupId}`,
                query: {
                  buildingGroupName: this.promoteDetail.buildingGroupName,
                  reportRemark: this.promoteDetail.reportRemark
                }
              })
            }
          })
        }
      }
    },
    /**
       * 优惠活动报名，暂时无用，直接跳转报备
       */
    signUp () {
      if (this.$route.query.name) {
        this.toast('请下载APP进行下一步操作')
      } else {
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
          let data = {
            'accountId': this.userInfo.id,
            'activityId': this.$route.params.id,
            'content': 'string',
            'phone': this.userInfo.phone,
            'username': this.userInfo.username
          }
          setSignUpPromote(data).then((res) => {
            if (res.code === 1) {
              this.toast('报名成功')
            } else {
              this.toast('接口异常，请稍后再试')
            }
          })
        }
      }
    },
    chat () { // phone
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
          'bulidingGroupId': this.promoteDetail.buildingGroupId,
          'otherAccountId': this.$route.query.accountId || '',
          'pageNo': 1,
          'pageSize': 10
        }
        setGroupMsnList(data).then((res) => {
          let cont = res && res.content
          if (res && res.code === 1) {
            this.$router.push({path: '/chat/' + cont.groupId, query: {groupName: this.promoteDetail.buildingGroupName}})
          } else {
            this.toast(res.msg || '操作失败')
          }
        })
      }
    },
    fromDate () {
      let nowDate = new Date().getTime()
      let time = this.endDate - nowDate
      if (time <= 0) {
        this.timeShow = false
      } else {
        this.timeShow = true
        let days = Math.floor(time / (24 * 3600 * 1000))
        let leave1 = time % (24 * 3600 * 1000)
        let hours = Math.floor(leave1 / (3600 * 1000))
        return days + '天 ' + hours + '小时 '// + minutes + ' 分钟' + seconds + ' 秒'
      }
      // let leave2 = leave1 % (3600 * 1000)
      // let minutes = Math.floor(leave2 / (60 * 1000))
      // let leave3 = leave2 % (60 * 1000)
      // let seconds = Math.round(leave3 / 1000)
    }
  }
}
</script>

<style lang="less" scoped>
  .th_promote_detail{
    height: 100vh;
    position: relative;
    .th_news_detail-share{
      position: absolute;
      top: 0;
      right: .6rem;
      z-index: 100;
      font-size: @FontSize17;
      line-height: @headerHeight;
      color: @cf;
    }
    .linkBtn{
      position: absolute;
      top: 0;
      left: .6rem;
      z-index: 100;
      font-size: @FontSize17;
      line-height: @headerHeight;
      color: @cf;
      width: @headerHeight;
      height: @headerHeight;
    }
    .th_promote_detail-box{
      .th_promote_detail-img{
        padding-top: @imgBase;
      }
      .th_promote_detail-cont{
        padding: 0 @plrPage;
        font-size: @defaultFontSize;
        color: @c3;
        .th_promote_detail-title{
          line-height: 1.5rem;
          font-size: @FontSize15;
          font-weight: bold;
          span{
            color: @cD14E33;
          }
        }
        .th_promote_detail-info{
          color: @c9;
          font-size: @smallFontSize;
          margin: .5rem 0 1rem;
        }
        .th_property_list-item-info{
          .content span{
            width: 100% !important;
            padding-left: 24px !important;
          }
          div{
            span{
              line-height: 1.25rem;
              vertical-align: top;
              &:first-child{
                width: 4.5rem;
                height: 0;
                overflow: hidden;
                color: @c9;
              }
              &:last-child{
                padding-left: .5rem;
              }
              span{
                max-width: calc(100% - .6rem);
                padding-right: 1rem;
              }
            }
          }
        }
        .th_promote_detail-more{
          color: @cD14E33;
          text-align: center;
          font-size: @smallFontSize;
          line-height: 2rem;
        }
      }
    }
    .none{
      display: none;
    }
  }
</style>
