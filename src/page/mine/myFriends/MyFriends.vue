<template>
  <div class="th_friends">
    <div class="headerRight" @click="selectType"><img src="../../../assets/myFriend.png" alt=""></div>
    <th-layout ref="layBox" :hiddenFooter="true">
      <div class="th_friends-cont" ref="cont" style="height: calc(100% + 19px)"  v-infinite-scroll="loadMore" infinite-scroll-distance="20">
        <div class="th_friends-header">
          <div class="headerNav">
            <mt-navbar v-model="active">
              <mt-tab-item id="0">全部</mt-tab-item>
              <mt-tab-item id="1">游客</mt-tab-item>
              <mt-tab-item id="2">会员</mt-tab-item>
              <mt-tab-item id="3">VIP会员</mt-tab-item>
              <!--<mt-tab-item id="4">合伙经纪</mt-tab-item>-->
              <!--<mt-tab-item id="5">合伙专员</mt-tab-item>-->
              <!--<mt-tab-item id="6">高级经理</mt-tab-item>-->
            </mt-navbar>
          </div>
        </div>
        <ul>
          <li v-for="(item,i) in list" :key="i" @click="setIdentity(item.accountId, item.id)" >
            <th-img-text-level class="th_friends-item">
              <th-img-box class="th_friends-item-img" :imgUrl="item.avatar || baseIcon" slot="left"></th-img-box>
              <div class="th_friends-item-cont">
                <div>{{item.userName}}</div>
                <div>
                  <!-- 3 vip 4 合伙经纪 5 合伙专员 6 区域合伙人 7城市合伙人 -->
                  <span v-if="item.type===2">会员</span>
                  <span v-else-if="item.type===3">vip客户</span>
                  <span v-else-if="item.type===4">合伙经纪</span>
                  <span v-else-if="item.type===5">合伙专员</span>
                  <span v-else-if="item.type===6">高级经理</span>
                  <span v-else-if="item.type===7">城市合伙人</span>
                  <span v-else-if="item.type===8">房经纪公司内部人员</span>
                  <span v-else-if="item.type===9">房管家内部人员</span>
                  <span v-else>游客</span>
                </div>
              </div>
            </th-img-text-level>
          </li>
        </ul>
        <div class="numFriends">{{list? list.length : '0'}}位好友</div>
      </div>
    </th-layout>
    <transition enter-active-class="zoomIn" leave-active-class="zoomOut">
      <div class="select animated" v-show="selectShow" @click="selectShow = !selectShow">
        <div class="typeSelect" @click="stopEvent">
          <div class="header">身份设置</div>
          <div class="selectCon">
            <ul>
              <li v-for="(item, i) in typeList" :key="i" @click="clickSelectType(item.id)">
                <i class="iconFont" :class="{active:selectLog===item.id}"></i>
                <div class="content">
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="footer" @click="clickSelectInvite">邀请</div>
        </div>
      </div>
    </transition>
    <mt-popup
      class="th_report-popup"
      v-model="popupVisible"
      position="right">
      <ul class="th_report-popup-cont">
        <li v-for="(item,i) in selectList" :key="i" :class="{active:status===i}" @click="clickStatus(item.typeRate, i)">{{item.typeName}}</li>
      </ul>
    </mt-popup>
    <transition enter-active-class="zoomIn" leave-active-class="zoomOut">
      <div class="alert animated" v-show="alertShow" @click="alertShow = !alertShow">
        <div class="main1">
          <h4 v-if="userInfo.type>4">{{typeRate4}}</h4>
          <span>{{typeRate}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {setMyFriends, setMyFriendsIdentity, inviteHelpFriends} from '../../../common/httpClient.js'
export default {
  data () {
    return {
      list: [],
      selectList: [],
      typeList: [],
      popupVisible: false,
      alertShow: false,
      selectShow: false,
      typeRate4: '邀请的好友报备成交将共享您的佣金\n',
      active: '0',
      status: -1,
      selectLog: -1,
      groupId: Number(this.$route.params.id),
      baseIcon: window.jrfw.baseIcon,
      typeRate: '',
      type: null,
      inviteAccountId: null,
      // 初始化无限加载相关参数
      pageNo: 1,
      loading: false, // 加载中
      allLoaded: true, // 全部加载
      timer: null
    }
  },
  components: {
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    }
  },
  watch: {
    active (val) {
      this.pageNo = 1
      this.getData()
    },
    status (newVal, oldVal) {
      clearTimeout(this.timer)
      if (oldVal && newVal !== oldVal) {
        if (this.alertShow) {
          this.timer = setTimeout(() => {
            this.alertShow = false
          }, 3000)
        } else {
          this.alertShow = true
        }
      }
    },
    popupVisible (newVal, oldVal) {
      // console.log(newVal, oldVal)
      clearTimeout(this.timer)
      this.alertShow = false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    loadMore () {
      if (!this.allLoaded) {
        this.loading = true
        ++this.pageNo
        this.getData()
      }
    },
    selectType () {
      if (this.popupVisible) {
        this.popupVisible = false
      } else {
        let data = {
          'type': this.userInfo.type
        }
        inviteHelpFriends(data).then((res) => {
          // this.data = res && res.content
          if (res && res.code === 1) {
            this.selectList = res.content
            this.popupVisible = true
            this.status = -1
          } else {
            this.toast(res.msg || '获取失败')
          }
        })
      }
    },
    clickStatus (typeRate, index) {
      this.status = index
      this.typeRate = typeRate
      this.alertShow = true
    },
    setIdentity (inviteAccountId, id) {
      this.inviteAccountId = inviteAccountId
      this.list.forEach((item) => {
        if (id === item.id) {
          this.typeList = item.typeList
        }
      })
      this.selectShow = true
    },
    clickSelectInvite () {
      if (this.selectLog === -1) {
        this.toast('请设置身份')
      } else {
        this.selectShow = false
        this.messageBox.confirm('确定执行此操作?').then(action => {
          let data = {
            'accountId': this.userInfo.id,
            'inviteAccountId': this.inviteAccountId,
            'type': this.selectLog
          }
          setMyFriendsIdentity(data).then((res) => {
            // this.data = res && res.content
            if (res && res.code === 1) {
              this.toast('邀请发送成功')
              // sessionStorage.setItem('accountType', type)
            } else {
              this.toast(res.msg || '邀请发送失败')
            }
          })
        }).catch(() => {})
      }
    },
    stopEvent (e) {
      e.stopPropagation() || e.preventDefault()
    },
    clickSelectType (id) {
      this.selectLog = id
    },
    getData () {
      let data = {
        'accountId': this.userInfo.id,
        'pageNo': this.pageNo,
        'pageSize': 10,
        'type': this.active
      }
      setMyFriends(data).then((res) => {
        this.loading = false
        if (res && res.code === 1) {
          let cont = res && res.content
          this.allLoaded = cont.length !== 10
          if (this.pageNo === 1) {
            this.list = cont
          } else {
            this.list.push(...cont)
          }
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.th_friends{
  height: 100%;
  color: @c9;
  /*padding-left:  @plrPage;*/
  font-size: @smallFontSize;
  position: relative;
  .headerRight{
    width: @headerHeight;
    height: @headerHeight;
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 100;
    img{
      width: 55%;
      height: 55%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .th_friends-cont{
    padding-top:1.8rem;
    .numFriends{
      padding: 8px;
      height: 1.8rem;
      font-size: @defaultFontSize;
      line-height: 1.8rem;
      color: @c9;
      text-align: center;
    }
    .th_friends-header{
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      box-shadow:0px 2px 0px 0px @cD8D8D8;
      /*-webkit-overflow-scrolling: touch;*/
      .headerNav{
        width: 100%;
        height: 1.8rem;
        /*overflow: hidden;*/
        & /deep/ .mint-navbar{
          width: 100%;
          height: 1.8rem;
          .mint-tab-item{
            padding:0;
            color: @c3;
            .mint-tab-item-label{
              font-size: @FontSize13;
              height: 1.8rem;
              line-height: 1.8rem;
            }
            &.is-selected{
              color: @cTheme;
            }
          }
        }
      }
    }
    ul{
      li{
        padding: @plrPage;
        border-bottom: 1px solid @cD8D8D8;
        height: 2.5rem;
        .th_friends-item{
          /deep/ .th_img_text_level-left{
            width: 2.5rem;
          }
          /deep/ .th_img_text_level-right{
            width: calc(100% - 2.5rem);
            span{
              float: right;
              color: @cTheme;
            }
          }

          // .th_friends-item-cont{
          //   height: 100%;
          // }
        }
      }
    }
  }

  .th_report-popup{
    width: 7rem;
    height: calc(100vh - @headerHeight);
    position: absolute;
    top: @headerHeight;
    right: 0;
    transform: translate3d(0, 0, 0);
    .th_report-popup-cont{
      padding: @plrPage;
      li{
        margin-top: .25rem;
        height: 1.25rem;
        line-height: 1.25rem;
        background-color: @cD8D8D8;
        text-align: center;
        border-radius: @borderRadius;
        &.active{
          color: @cf;
          background-color: @cF76C1D;
        }
      }
    }
  }
  /deep/ .v-modal{
    position: absolute;
    top: @headerHeight;
    left: 0;
  }
  .alert{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100000;
    width: 300px;
    border: 1px solid @cD8D8D8;
    border-radius: 4px;
    background-color: @cf;
    .main1{
      padding: .5rem;
      h4{
        font-size: @FontSize15;
        line-height: 30px;
        text-align: center;
      }
      span{
        font-size: @defaultFontSize;
        line-height: 30px;
        text-align: left;
      }
    }
  }
  .select{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, .3);
    .typeSelect{
      width: 10rem;
      height: 12.5rem;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 101;
      background-color: @cf;
      border-radius: 5px;
      .header,
      .footer{
        width: 100%;
        font-size: @FontSize16;
        text-align: center;
      }
      .header{
        height: @headerHeight;
        font-size: @FontSize16;
        line-height: @headerHeight;
        color: @c3;
        border-bottom: 1px solid @cD8D8D8;
      }
      .footer{
        height: 55px;
        font-size: @FontSize16;
        line-height: 55px;
        color: @cTheme;
        border-top: 1px solid @cD8D8D8;
      }
      .selectCon{
        width: 100%;
        height: 151px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        ul{
          li{
            height: 1.25rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            border-bottom: 1px solid @cD8D8D8;
            padding: 10px;
            .iconFont{
              display: inline-block;
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              border: 1px solid @cD8D8D8;
            }
            .content{
              width: calc(100% - 1.5rem);
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              text-align: left;
              span{
                font-size: @defaultFontSize;
                color: @c6;
              }
            }
          }
        }
        .active{
          position: relative;
          border-color: red !important;
          background: red;
          &::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            width: 50%;
            height: 25%;
            border: 2px solid @cf;
            border-radius: 1px;
            border-top: none;
            border-right: none;
            background: transparent;
            transform: translate(-50%, -75%) rotate(-45deg);
          }
        }
      }
    }
  }
}
</style>
