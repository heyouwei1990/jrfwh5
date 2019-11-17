<template>
  <div class="th_Find_house">
    <tx-layout hiddenFooter="true">
      <div class="th_Find_house-header" slot="header">
        <span>{{title}}</span>
      </div>
      <div class="th_Find_house-cont" ref="cont" >
        <th-property-list @clickTX="clickTX" :propertyList="propertyList"></th-property-list>
        <div class="more_loading">
          <span v-show="loading&&!allLoaded">加载中...</span>
          <span v-show="allLoaded">已全部加载</span>
        </div>
      </div>
    </tx-layout>
    <!--<div class="showImg" id="showImg" ref="shareImg" @click="clickTX" v-show="openInternet">-->
      <!--<img src="../../assets/openInternet.png"/>-->
    <!--</div>-->
  </div>
</template>

<script>
import {getDistributorBuildings} from '../../common/httpClient.js'
import util from '../../common/util'
import ThPropertyList from './propertyList/PropertyList.vue'
export default {
  data () {
    return {
      propertyList: [],
      // id: '',
      // ground: '',
      title: '',
      openInternet: true,
      mobile: (!!window.navigator.userAgent.match(/AppleWebKit.*Mobile.*/) || !!window.navigator.userAgent.match(/AppleWebKit/)) && !window.jrfw.getIsWxClient(), // 是否为移动终端
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
    },
    districtMultiple () {
      return (this.select.cityIds + '').indexOf(',') > -1
    },
    styleComputer: {
      height: this.mobile ? 'calc(100% + 55px)' : 'calc(100% + 55px)'
    }
  },
  mounted () {
    // this.setFindHouseData()
  },
  created () {
    if (util.getIsWxClient()) {
      this.openInternet = true
    } else {
      this.openInternet = false
    }
    this.setFindHouseData()
  },
  activated () {
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
      getDistributorBuildings(dataBase).then((res) => {
        this.loading = false
        if (res && res.code === 1) {
          let cont = res.content.list
          this.propertyList = cont
          this.title = res.content.shareInfo.title
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
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
      height: calc(100% + 55px);
      box-sizing: border-box;
    }
    /*.showImg {*/
      /*width: 100vw;*/
      /*height: 100vh;*/
      /*position: fixed;*/
      /*top: 0;*/
      /*left: 0;*/
      /*z-index: 999;*/
      /*background-color: rgba(0, 0, 0, 0.5);*/
      /*img {*/
        /*width: 70%;*/
        /*height: auto;*/
        /*margin-top: 30px;*/
        /*margin-left: 20%;*/
      /*}*/
    /*}*/
  }
</style>
