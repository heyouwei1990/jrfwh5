<template>
    <th-layout class="th_information">
      <div class="th_information-box" ref="cont">
        <mt-cell
          title="看房提醒"
          is-link
          to="/infoList/1">
          <span class="th_information-num" v-if="data&&data.reportNum">{{data.reportNum}}</span>
          <img slot="icon" src="./imgs/report.png" width="16" height="19" style="marginLeft:2px"/>
        </mt-cell>
        <mt-cell
          title="群聊消息"
          is-link
          to="/chatList/2">
          <span class="th_information-num" v-if="data&&data.msnNum">{{data.msnNum}}</span>
          <img slot="icon" src="./imgs/groupChat.png" width="18" height="18"/>
        </mt-cell>
        <mt-cell
          title="楼盘推荐"
          is-link
          to="/intentionProperty">
          <span class="th_information-num"  v-if="data.commendNum">系统向您推荐了{{data.commendNum}}个楼盘</span>
          <img slot="icon" src="./imgs/memo.png" width="16" height="19" style="marginLeft:2px"/>
        </mt-cell>
        <mt-cell
          title="楼盘动态"
          is-link
          to="/dynamic/3">
          <span class="th_information-num"  v-if="data&&data.dynamicCount">{{data.dynamicCount}}</span>
          <img slot="icon" src="./imgs/building.png" width="18" height="18"/>
        </mt-cell>
        <mt-cell
          title="订阅消息"
          is-link
          to="/infoList/5">
          <span class="th_information-num"  v-if="data&&data.followNum">{{data.followNum}}</span>
          <img slot="icon" src="./imgs/subscription.png" width="18" height="18"/>
        </mt-cell>
         <mt-cell
          title="客户动态"
          is-link
          to="/infoList/6" v-if="userInfo.type > 2">
          <span class="th_information-num"  v-if="data.customDynamicNum">{{data.customDynamicNum}}</span>
          <img slot="icon" src="./imgs/client.png" width="18" height="18"/>
        </mt-cell>
        <mt-cell
          title="系统通知"
          is-link
          to="/infoList/7">
          <span class="th_information-num"  v-if="data&&data.systemNum">{{data.systemNum}}</span>
          <img slot="icon" src="./imgs/systemInfo.png" width="16" height="19" style="marginLeft:2px"/>
        </mt-cell>
      </div>
      <th-footer-tab slot="footer" :active="'information'"></th-footer-tab>
    </th-layout>
</template>
<script>
import {setInfoList} from '../../../common/httpClient.js'
import ThFooterTab from '../../../components/common/layout/footerTab/FooterTab.vue'
export default {
  data () {
    return {
      data: {
        dynamicShow: true
      }
    }
  },
  components: {
    ThFooterTab
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    }
  },
  mounted () {
    if (this.userInfo.id) {
      // setInterval(() => {
      this.getData()
      // }, 1000)
    }
  },
  methods: {
    getData () {
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
        this.data = res && res.content
        this.infoSum = this.data.reportNum + this.data.msnNum + this.data.commendNum + this.data.followNum + this.data.customDynamicNum + this.data.systemNum + this.data.dynamicCount
      })
    }
  }
}
</script>

<style lang="less" scoped>
.th_information{
  & /deep/ .mint-header{
    .mint-header-button{
      display: none;
    }
  }
  .th_information-box{
    & /deep/ .mint-cell{
      .mint-cell-mask{
        display: none;
      }
      .mint-cell-title{
        min-width: 5rem;
        color: @c3;
        .mint-cell-text{
          margin-left: .2rem;
        }
      }
      .mint-cell-value{
        .th_information-num {
          height: .75rem;
          line-height: .75rem;
          padding: 0 .3rem;
          background-color: @cD14E33;
          font-size: @smallFontSize;
          color: @cf;
          border-radius: .325rem;
        }
        &.is-link{
          margin-right: 15px;
        }
      }
      .mint-cell-allow-right::after{
        width: 8px;
        height: 8px;
        border: solid 1px @c9;
        border-bottom-width: 0;
        border-left-width: 0;
        right: 10px;
      }
    }
  }

}
</style>
