<template>
  <!-- <th-layout :hiddenHeader="true"> -->
  <div class="user">
    <div class="th_mine" ref="cont">
      <div class="th_mine-Top">
        <p class="th_mine-Top-title">个人中心</p>
        <div class="th_mine-Top-img">
          <th-img-box :imgUrl="submitData.avatar||baseIcon" @click="click('login')"></th-img-box>
        </div>
        <!--
        1游客 2会员 3vip 4 合伙经纪 5 合伙专员 6 区域合伙人 7城市合伙人 8房经纪公司内部人员 9房管家内部人员
        -->
        <p>
          {{submitData.userName || '用户名为空'}}
          <span class="th_mine-Top-tag" v-if="submitData.type===2">会员</span>
          <span class="th_mine-Top-tag" v-else-if="submitData.type===3">vip会员</span>
          <span class="th_mine-Top-tag" v-else-if="submitData.type===4">合伙经纪</span>
          <span class="th_mine-Top-tag" v-else-if="submitData.type===5">合伙专员</span>
          <span class="th_mine-Top-tag" v-else-if="submitData.type===6">区域合伙人</span>
          <span class="th_mine-Top-tag" v-else-if="submitData.type===7">城市合伙人</span>
          <span class="th_mine-Top-tag" v-else-if="submitData.type===8">房经纪公司内部人员</span>
          <span class="th_mine-Top-tag" v-else-if="submitData.type===9">房管家内部人员</span>
          <span class="th_mine-Top-tag" v-else>游客</span>
        </p>
        <ul class="th_mine-flex th_mine-info">
          <li><span>{{(thirdInfo && thirdInfo.bindWechat)?'已绑定微信':'未绑定微信'}}</span></li>
          <li>
            <span>{{userInfo.authenticationFlag>1 ? '已实名认证' : '未实名认证'}}</span>
          </li>
        </ul>
        <img src="./imgs/setting.png" class="setting" @click.stop="click('setting')"/>
      </div>
      <ul class="th_mine-flex hasBorderBottom hasBorderSplice" ><li @click="click('shareAPP')">分享APP</li><li @click="click('sharePic')">邀请好友</li></ul>
      <ul class="th_mine-flex hasBorderBottom">
        <li v-for="(item,i) in menuList1" :key="i" @click="click(item.linkUrl)">
          <div class="th_mine-flex-img"><th-img-box :imgUrl="item.imgUrl"></th-img-box></div>
          <span>{{item.text}}</span>
        </li>
      </ul>
      <ul class="th_mine-flex hasBorderBottom">
        <li v-for="(item,i) in menuList2" :key="i" @click="click(item.linkUrl)">
          <div class="th_mine-flex-img"><th-img-box :imgUrl="item.imgUrl"></th-img-box></div>
          <span>{{item.text}}</span>
        </li>
      </ul>
      <ul class="th_mine-flex hasBorderBottom">
        <li>工具栏</li>
      </ul>
      <ul class="th_mine-flex hasBorderBottom">
        <li v-for="(item,i) in toolList1" :key="i" @click="click(item.linkUrl)">
          <div class="th_mine-flex-img"><th-img-box :imgUrl="item.imgUrl"></th-img-box></div>
          <div>{{item.text}}</div>
        </li>
      </ul>
      <ul class="th_mine-flex hasBorderBottom mine-flex">
        <li v-for="(item,i) in funList" :key="i" @click="click(item.linkUrl)" v-if="(i<=1 && submitData.type>2) || i>1">
          <div class="th_mine-flex-img"><th-img-box :imgUrl="item.imgUrl"></th-img-box></div>
          <div>{{item.text}}</div>
        </li>
      </ul>
      <!--<div v-if="userInfo.type === 3">
        <mt-cell
          v-for="(item,i) in funList"
          :key="i"
          :title="item.text"
          is-link
          :to="item.linkUrl">
          <img slot="icon" :src="item.imgUrl" width="30" height="30" style="marginLeft:2px"/>
        </mt-cell>
      </div>-->
    </div>
    <th-footer-tab slot="footer" :active="'mine'"></th-footer-tab>
  <!-- </th-layout> -->
  </div>
</template>

<script>
import {getByAccountId} from '../../../common/httpClient.js'
import ThFooterTab from '../../../components/common/layout/footerTab/FooterTab.vue'
export default {
  data () {
    return {
      baseIcon: window.jrfw.baseIcon,
      submitData: {
        'avatar': '',
        'userName': '',
        'gender': 1,
        'type': ''
      },
      menuList1: [
        {
          imgUrl: require('./imgs/wallet.png'),
          text: '钱包',
          linkUrl: '/app'
        },
        {
          imgUrl: require('./imgs/Offer.png'),
          text: '优惠',
          linkUrl: '/promote'
        },
        {
          imgUrl: require('./imgs/interests.png'),
          text: '权益',
          linkUrl: '/protocol?app=1&type=8'
        }
      ],
      menuList2: [
        {
          imgUrl: require('./imgs/collection.png'),
          text: '收藏',
          linkUrl: '/favorite'
        },
        {
          imgUrl: require('./imgs/subscription.png'),
          text: '订阅',
          linkUrl: '/subscribe'
        },
        {
          imgUrl: require('./imgs/footPrint.png'),
          text: '足迹',
          linkUrl: '/history'
        }
      ],
      toolList1: [
        {
          imgUrl: require('./imgs/calculator.png'),
          text: '房贷计算器',
          linkUrl: '/calculatorMortgage'
        },
        // {
        //   imgUrl: require('./imgs/calculator.png'),
        //   text: '税费计算器',
        //   linkUrl: 'calculatorTax'
        // },
        {
          imgUrl: require('./imgs/test.png'),
          text: '购房资格测试',
          linkUrl: '/qualification'
        },
        {
          imgUrl: require('./imgs/encyclopedia.png'),
          text: '百问百科',
          linkUrl: '/encyclopedia'
        },
        {
          imgUrl: require('./imgs/intention.png'),
          text: '意向找房',
          linkUrl: '/intention'
        }
      ],
      funList: [
        {
          imgUrl: require('./imgs/reward.png'),
          text: '我的奖励',
          linkUrl: '/reward',
          showType: true
        },
        // {
        //   imgUrl: require('./imgs/client.png'),
        //   text: '我的客户',
        //   linkUrl: 'client'
        // },
        {
          imgUrl: require('./imgs/friend.png'),
          text: '我的好友',
          linkUrl: '/myFriends',
          showType: true
        },
        {
          imgUrl: require('./imgs/viewedRecord.png'),
          text: '看房记录',
          linkUrl: '/reportNotes',
          showType: true
        }
      ],
      thirdInfo: {}
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    }
  },
  components: {
    ThFooterTab
  },
  created () {
    sessionStorage.setItem('activeXZ', '')
    sessionStorage.setItem('birthdayTime', '')
    sessionStorage.setItem('houseTypePrice', '')
    this.setData()
  },
  activated () {
    // sessionStorage.setItem('houseTypePrice', '')
    // this.setData()
  },
  methods: {
    setData () {
      if (!this.userInfo.id) {
        this.toast('请授权登录')
        // this.$router.push({path: '/login'})
      } else {
        let data = {
          'accountId': this.userInfo.id,
          'loginToken': this.userInfo.loginToken
        }
        getByAccountId(data).then((res) => {
          if (res && res.code === 1) {
            let userInfo = res.content.account
            this.submitData = Object.assign(this.submitData, {
              'avatar': userInfo.yyUser.avatar || '',
              'userName': userInfo.yyUser.userName || '',
              'gender': userInfo.yyUser.gender || 1,
              'type': userInfo.type || ''
            })
            this.thirdInfo = res.content.thirdInfo
          } else {
            sessionStorage.clear()
            localStorage.clear()
            this.toast(res.msg || '加载失败')
          }
        })
      }
    },
    click (name) {
      if (name === '/app') { //  打开app
        this.appDownLoad()
      } else if (name === 'login') { //  登陆
        if (navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && (!this.userInfo.id || !this.userInfo.loginTaken) && !window.jrfw.getIsWxClient()) {
          this.toast('请下载APP或关注微信公众号查看更多内容')
          this.$router.push({name: 'downLoad'})
          // window.location.href = 'http://h5.jrfw360.com/downLoad'
        } else {
          this.$router.push({name: this.userInfo.id ? 'personalInfo' : 'login'})
        }
      } else {
        name && this.$router.push({path: name})
      }
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

<style lang="less" scoped>
.user{
  height: 100%;
}
  .th_mine{
    .th_mine-Top{
      text-align: center;
      font-size: @FontSize15;
      padding: 0 @plrPage;
      color: @cf;
      background: url(./imgs/bg.png) no-repeat;
      background-size:cover;
      position: relative;
      .th_mine-Top-title{
        line-height: @headerHeight;
      }
      .th_mine-Top-img{
        width: 3.8rem;
        height: 3.8rem;
        border-radius: 50%;
        margin: 0 auto;
        overflow: hidden;
      }
      .th_mine-Top-tag{
        display: inline-block;
        border-radius:@plrPage*2;
        padding: 0 @plrPage;
        margin-left: @plrPage;
        border: 1px solid @cFCE750;
      }
      .th_mine-flex{
        color: @cf;
        &.th_mine-info{
          // border-bottom: 1px solid @cD8D8D8;
          li{
            text-align: right;
            margin-left: 1rem;
            span{
              display: inline-block;
              vertical-align: middle;
            }
            &::before{
              content: '';
              width: 0.7rem;
              height: 0.7rem;
              display: inline-block;
              background: url(./imgs/wx.png) no-repeat;
              background-size: contain;
              background-position: center;
              margin-right: .3rem;
              vertical-align: middle;
            }
            &:last-child{
              margin-right: 1rem;
              text-align: left;
              &::before{
                background: url(./imgs/realName.png) no-repeat;
                background-size: contain;
              }
            }
          }
        }
      }
      .setting{
        width: 1rem;
        height: 1rem;
        position: absolute;
        top: .5rem;
        right: .5rem;
      }
    }
    .th_mine-flex.mine-flex{
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding-bottom: .3rem;
      li{
        flex: 1;
        height: 2.25rem;
        text-align:left;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        line-height: 2.25rem;
        background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 60%);
        background-size: 120% 1px;
        background-repeat: no-repeat;
        background-position: bottom left;
        padding-left: .5rem;
        /deep/ .th_img-box-cont{
          margin-top: 8px;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
        }

        .th_mine-flex-img{
          margin-right: 5px;
        }
      }
    }
    .th_mine-flex{
      display: flex;
      flex-wrap: wrap;
      font-size: @smallFontSize;
      line-height: 1.2rem;
      color: @c6;
      li{
        min-width: 25%;
        flex: 1;
        text-align:center;
        padding: .3rem 0;
        .th_mine-flex-img{
          width: 1.5rem;
          height: 1rem;
          display: inline-block;
          /deep/ .th_img-box-cont{
            background-size: contain;
            background-repeat: no-repeat;
          }
        }
        .th_mine-Top-num{
          font-size: @FontSize18;
        }
        span{
          line-height: 1.5rem;
        }
      }
      &.hasBorderBottom{
        background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 60%);
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: top left;
        &.hasBorderSplice{
          li{
            background-image: linear-gradient(90deg, #d9d9d9, #d9d9d9 50%, transparent 60%);
            background-size: 1px 100%;
            background-repeat: no-repeat;
            background-position: top left;
          }
        }
      }
    }
  }
</style>
