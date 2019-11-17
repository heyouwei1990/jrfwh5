<template>
  <div class="beforeInsert">
    <th-layout>
      <div class="logCon" ref="cont" style="height: calc(100% - 44px);">
        <div class="header">
          <span>该客户您已经报备，请选择从以下记录中进行报备</span>
        </div>
        <div class="main" v-infinite-scroll="loadMore" infinite-scroll-distance="15">
          <ul>
            <li v-for="(con, i) in conList" :key="i" @click="clickSelectLog(con.reportId)">
              <i class="iconFont" :class="{active:selectLog===con.reportId}"></i>
              <div class="content">
                <span>{{con.buildingGroupName}}</span>
                <span>{{con.username}}</span>
                <span>{{con.reportTime | formatTime('YMDHMS')}}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="more_loading">
          <span v-show="loading&&!allLoaded">加载中...</span>
          <span v-show="allLoaded">已全部加载</span>
        </div>
      </div>
      <div class="footer" @click="setPropertyReport" slot="footer">
        <span>报备</span>
      </div>
    </th-layout>
  </div>
</template>
<script>
import {setPropertyReport} from '../../../../common/httpClient.js'
export default {
  name: 'beforeInsert',
  data () {
    return {
      conList: [],
      data: {},
      reportId: null,
      selectLog: -1,
      pageNo: 1,
      loading: false, // 加载中
      allLoaded: true // 全部加载
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    },
    location () {
      return this.$store.state.locate.location
    }
  },
  created () {
    // this.data = JSON.parse(this.$route.query.data)
    try {
      let insertContent = sessionStorage.getItem('insertContent')
      if (insertContent) {
        this.conList = JSON.parse(insertContent)
      }
    } catch (e) {
    }
    console.log(this.conList)
  },
  methods: {
    loadMore () {
      if (!this.allLoaded) {
        this.loading = true
        // ++this.pageNo
      }
    },
    reload () {
      this.reloadFresh = false
      this.$nextTick(() => {
        this.reloadFresh = true
      })
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
    clickSelectLog (reportId) {
      this.selectLog = reportId
      this.reportId = reportId
    },
    setPropertyReport () {
      this.data = JSON.parse(this.$route.query.data)
      let data = Object.assign({}, this.data, {
        'reportId': this.reportId
      })
      setPropertyReport(data).then(res => {
        this.reload()
        if (res && res.code === 1) {
          this.toast(res.msg || '报备成功')
          this.clearSessionStorage()
          setTimeout(() => {
            if (window.jrfw.isApp()) {
              if (navigator.userAgent.match(/Android/i)) {
                window.location.href = 'fjj://housing/detail?buildingGroupId=' + this.$route.params.id + '&accountId=' + this.$route.query.accountId
              } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                window.location.href = 'jrfwinviteschemes://houseDetail?id=' + this.$route.params.id + '&accountId=' + this.$route.query.accountId
              }
            } else {
              this.$router.go(-2)
            }
          }, 1000)
        } else {
          this.toast(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .beforeInsert{
    width: 100%;
    height: 100%;
    .logCon{
      padding-top: @headerHeight;
      position: relative;
      .header{
        width: 100%;
        height: @headerHeight;
        position: fixed;
        top: @headerHeight;
        left: 0;
        text-align: center;
        border-bottom: 1px solid @cD8D8D8;
        background-color: @cf;
        span{
          font-size: @defaultFontSize;
          line-height: @headerHeight;
          color: @c6;
        }
      }
      .main{
        width: 100%;
        ul{
          li{
            height: 1.5rem;
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
              justify-content: space-between;
              span{
                font-size: @defaultFontSize;
                color: @c6;
                &:nth-child(1),
                &:nth-child(2),
                &:nth-child(3){
                  .lineClamp(1);
                }
                &:nth-child(1){
                  width: 45%;
                  text-align: left;
                }
                &:nth-child(2){
                  width: 15%;
                  text-align: center;
                }
                &:nth-child(3){
                  width: 40%;
                  text-align: right;
                }
              }
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
    .footer{
      width: 100%;
      height: 55px;
      position: relative;
      span{
        width: 6rem;
        height: 1.5rem;
        font-size: @defaultFontSize;
        line-height: 1.5rem;
        border-radius: 4px;
        border: 1px solid @cD8D8D8;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      text-align: center;
    }
  }
</style>
