<template>
  <div class="th_Find_house">
    <th-layout>
      <div class="th_Find_house-header" slot="header">
        <span>{{title}}</span>
      </div>
      <div class="th_Find_house-cont"  ref="cont" v-infinite-scroll="loadMore" infinite-scroll-distance="20">
        <th-property-list @clickTX="clickTX" :propertyList="propertyList"></th-property-list>
        <div class="more_loading">
          <span v-show="loading&&!allLoaded">加载中...</span>
          <span v-show="allLoaded">已全部加载</span>
        </div>
      </div>
      <div slot="footer" class="th_Find_house-footer" @click="modelShow = true">
        <span>确定</span>
      </div>
    </th-layout>
    <transition enter-active-class="fadeInUpBig" leave-active-class="fadeOutDownBig">
      <div class="mask animated" v-show="modelShow">
        <div class="model">
          <span class="content">{{inviteName}}邀请您成为以上楼盘的渠道对接人，一经同意无法修改。</span>
          <div class="clickBtn">
            <span class="cancel" @click="modelShow = false">取消</span>
            <span class="confirm" @click="confirmChannel">确定</span>
          </div>
        </div>
      </div>
  </transition>
    <div class="shareImg" id="shareImg" ref="shareImg" @click="clickTX" v-show="openInternet">
      <img src="../../assets/openInternet.png"/>
    </div>
  </div>
</template>

<script>
import {getChannelBuildings, confirmChannel} from '../../common/httpClient.js'
import ThPropertyList from './propertyList/PropertyList.vue'
import util from '../../common/util'
export default {
  data () {
    return {
      inviteName: '',
      modelShow: false,
      propertyList: [],
      clickShow: true,
      // id: '',
      // ground: '',
      title: '',
      openInternet: true,
      loading: false, // 加载中
      allLoaded: true // 全部加载
    }
  },
  components: {
    ThPropertyList
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    },
    location () {
      return this.$store.state.locate.location
    }
  },
  mounted () {
  },
  created () {
    this.clickShow = true
    if (util.getIsWxClient()) {
      this.openInternet = true
    } else {
      this.openInternet = false
    }
    this.setFindHouseData()
  },
  methods: {
    clickTX () {
      this.openInternet = !this.openInternet
    },
    setFindHouseData () {
      let dataBase = {
        'accountId': this.$route.query.accountId,
        'buildingGroupIds': this.$route.query.buildingGroupIds
      }
      getChannelBuildings(dataBase).then((res) => {
        this.loading = false
        if (res && res.code === 1) {
          let cont = res.content && res.content.list
          this.propertyList = cont
          this.title = res.content.shareInfo.title
          this.inviteName = res.content.shareInfo.title.substring(0, res.content.shareInfo.title.indexOf('邀'))
        } else {
          this.toast(res.msg || '操作失败')
        }
      })
    },
    confirmChannel () {
      if (window.jrfw.getIsWxClient()) {
        let data = {
          'accountId': this.userInfo.id,
          'buildingGroupIds': this.$route.query.buildingGroupIds
        }
        confirmChannel(data).then((res) => {
          this.loading = false
          this.modelShow = false
          this.openInternet = true
          if (res && res.code === 1) {
            this.toast('操作成功,请稍等...')
            setTimeout(() => {
              if (navigator.userAgent.match(/Android/i)) {
                window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.steward'
              } else if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
                window.location.href = 'https://itunes.apple.com/cn/app/%E8%84%89%E6%A5%BC/id1457937506?mt=8'
              }
            }, 1500)
          } else {
            if (res.msg === '请先绑定手机') {
              this.$router.push({
                name: 'bindPhone',
                query: {
                  routerName: this.$route.fullPath
                }
              })
            } else {
              this.toast(res.msg || '绑定手机号与授权手机号不匹配，如有疑问请与授权人员沟通')
            }
          }
        })
      } else {
        this.toast('请在微信浏览器打开，否则无法进行渠道授权')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .th_Find_house{
    height: 100%;
    position: relative;
    .th_Find_house-header{
      width: 100%;
      height: 100%;
      text-align: center;
      span{
        display: inline-block;
        width: 60%;
        font-size: 0.8rem;
        line-height: @headerHeight;
        color: @cf;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .th_Find_house-cont{
      /*padding-top: 1.5rem;*/
      height: 100%;
      box-sizing: border-box;
    }
    .th_Find_house-footer{
      width: 100%;
      height: 100%;
      border-top: 1px solid #D8D8D8;
      text-align: center;
      span{
        font-size: 1rem;
        line-height: @footerHeight;
      }
    }
    .shareImg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      img {
        width: 70%;
        height: auto;
        margin-top: 30px;
        margin-left: 20%;
      }
    }
    .mask{
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      background-color: rgba(0, 0, 0, .4);
      .model{
        width: 70vw;
        height: 8rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 101;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        background-color: @cf;
        border-radius: 5px;
        .content{
          display: inline-block;
          padding: 1.5rem 0.75rem;
          font-size: @defaultFontSize;
          color: #333333;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .clickBtn{
          width: 100%;
          height: @footerHeight;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          border-top: 1px solid @cD8D8D8;
          span{
            flex-grow: 1;
            display: inline-block;
            width: clac(50% -2px);
            font-size: @FontSize16;
            text-align: center;
            line-height: @footerHeight;
            color: #333333;
            border-left: 1px solid @cD8D8D8;
            border-right: 1px solid @cD8D8D8;
            &:nth-child(1){
              border-bottom-left-radius: 5px;
            }
            &:nth-child(2){
              border-bottom-right-radius: 5px;
            }
          }
        }
      }
    }
  }
</style>
