<template>
  <div class="th_select_property">
    <th-layout>
      <div class="th_select_property-header">
        <mt-navbar v-model="active">
          <mt-tab-item id="all">全部</mt-tab-item>
          <mt-tab-item id="sameArea">同区域</mt-tab-item>
          <mt-tab-item id="samePrice">同价格</mt-tab-item>
          <mt-tab-item id="favorite">收藏</mt-tab-item>
        </mt-navbar>
      </div>
      <div class="th_select_property-cont" ref="cont">
        <mt-tab-container v-model="active">
          <mt-tab-container-item id="all" v-infinite-scroll="loadMore1" infinite-scroll-distance="20">
            <th-property-list
              :propertyList="propertyList.all"
              :selectAble="true"
              :selectList="selectList"
              :selectTextList="selectTextList"
              :selectPropertyRemarkList="selectPropertyRemarkList"
              :selectPhoneIsShowList="selectPhoneIsShowList">
            </th-property-list>
            <div class="more_loading">
              <span v-show="loading1&&!allLoaded1">加载中...</span>
              <span v-show="allLoaded1">已全部加载</span>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="sameArea" v-infinite-scroll="loadMore1" infinite-scroll-distance="20">
            <th-property-list :propertyList="propertyList.sameArea" :selectPhoneIsShowList="selectPhoneIsShowList" :selectAble="true" :selectList="selectList" :selectTextList="selectTextList" :selectPropertyRemarkList="selectPropertyRemarkList"></th-property-list>
            <div class="more_loading">
              <span v-show="loading1&&!allLoaded1">加载中...</span>
              <span v-show="allLoaded1">已全部加载</span>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="samePrice" v-infinite-scroll="loadMore1" infinite-scroll-distance="20">
            <th-property-list :propertyList="propertyList.samePrice" :selectPhoneIsShowList="selectPhoneIsShowList" :selectAble="true" :selectList="selectList" :selectTextList="selectTextList" :selectPropertyRemarkList="selectPropertyRemarkList"></th-property-list>
            <div class="more_loading">
              <span v-show="loading1&&!allLoaded1">加载中...</span>
              <span v-show="allLoaded1">已全部加载</span>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="favorite" v-infinite-scroll="loadMore2" infinite-scroll-distance="20">
            <th-property-list :propertyList="propertyList.favorite" :selectPhoneIsShowList="selectPhoneIsShowList" :selectAble="true" :selectList="selectList" :selectTextList="selectTextList" :selectPropertyRemarkList="selectPropertyRemarkList"></th-property-list>
            <div class="more_loading">
              <span v-show="loading2&&!allLoaded2">加载中...</span>
              <span v-show="allLoaded2">已全部加载</span>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
      <div slot="footer" class="th_select_property-footer" @click="submit">
        确定
      </div>
    </th-layout>
  </div>
</template>

<script>
import {getFavorites, setFindHouseData, setPropertyDetail} from '../../../common/httpClient.js'
import ThNewsList from '../../../components/newsList/NewsList.vue'
import ThPropertyList from '../../../components/propertyList/PropertyList.vue'
export default {
  data () {
    return {
      active: 'all',
      selectList: [],
      selectTextList: [],
      selectPhoneIsShowList: [],
      selectPropertyRemarkList: [],
      propertyList: {
        all: [],
        sameArea: [],
        samePrice: [],
        favorite: []
      },
      select: {
        cityIds: ''
      },
      pageNo: 1,
      loading1: false, // 加载中
      allLoaded1: true, // 全部加载
      loading2: false, // 加载中
      allLoaded2: true, // 全部加载
      loading3: false, // 加载中
      allLoaded3: true, // 全部加载
      loading4: false, // 加载中
      allLoaded4: true // 全部加载
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
  watch: {
    select: {
      handler (val, oldval) {
        // console.log(val, oldval)
        // if (JSON.stringify(val) !== JSON.stringify(oldval)) {
        this.pageNo = 1
        this.setData()
        this.setFindHouseData()
        this.setPropertyDetail()
        // }
      },
      deep: true
    }
    //   active (val) {
    //     this.setList()
    //   }
  },
  components: {
    ThNewsList,
    ThPropertyList
  },
  mounted () {
  },
  created () {
    this.select.cityIds = this.location.cityId
    let selectList = sessionStorage.getItem('selectPropertyList')
    selectList && (this.selectList = JSON.parse(selectList))
    let selectTextList = sessionStorage.getItem('selectPropertyTextList')
    selectTextList && (this.selectTextList = JSON.parse(selectTextList))
    let selectPropertyRemarkList = sessionStorage.getItem('selectPropertyRemarkList')
    selectPropertyRemarkList && (this.selectPropertyRemarkList = JSON.parse(selectPropertyRemarkList))
    let selectPhoneIsShowList = sessionStorage.getItem('selectPhoneIsShowList')
    selectPhoneIsShowList && (this.selectPhoneIsShowList = JSON.parse(selectPhoneIsShowList))
    console.log(this.selectPhoneIsShowList)
  },
  methods: {
    loadMore1 () {
      if (!this.allLoaded1) {
        this.loading1 = true
        ++this.pageNo
        this.setFindHouseData()
      }
    },
    loadMore2 () {
      if (!this.allLoaded2) {
        this.loading2 = true
        ++this.pageNo
        this.setData()
      }
    },
    setData () {
      let data = {
        'accountId': this.userInfo.id,
        'lat': this.location.lat,
        'lng': this.location.lng,
        'pageNo': this.pageNo,
        'pageSize': 10,
        'targetId': 1,
        'targetType': 1
      }
      getFavorites(data).then((res) => {
        this.loading2 = false
        let cont = res && res.content
        this.allLoaded2 = cont.length !== 10
        if (this.pageNo === 1) {
          this.propertyList.favorite = cont
        } else {
          this.propertyList.favorite.push(...cont)
        }
      })
    },
    setPropertyDetail () {
      let data = {
        'accountId': this.userInfo.id,
        'id': this.$route.params.id,
        'lat': this.location.lat,
        'lng': this.location.lng,
        'loginToken': this.userInfo.loginToken
      }
      setPropertyDetail(data).then((res) => {
        let cont = res && res.content
        this.propertyList.sameArea = cont.nearBuildingList
        this.propertyList.samePrice = cont.samePriceList
      })
    },
    setFindHouseData () {
      let dataBase = {
        'accountId': this.userInfo.id,
        'lat': this.location.lat,
        'lng': this.location.lng,
        'pageNo': this.pageNo,
        'pageSize': 10
      }
      let data = Object.assign({}, dataBase, this.select)
      for (let key in data) {
        if (typeof data[key] === 'object') {
          delete data[key]
        }
      }
      setFindHouseData(data).then((res) => {
        this.loading1 = false
        if (res && res.code === 1) {
          let cont = res && res.content
          this.allLoaded1 = cont.length !== 10
          if (this.pageNo === 1) {
            this.propertyList.all = cont
          } else {
            this.propertyList.all.push(...cont)
          }
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    },
    submit () {
      sessionStorage.setItem('selectPropertyList', JSON.stringify(this.selectList))
      sessionStorage.setItem('selectPropertyTextList', JSON.stringify(this.selectTextList))
      sessionStorage.setItem('selectPropertyRemarkList', JSON.stringify(this.selectPropertyRemarkList))
      sessionStorage.setItem('selectPhoneIsShowList', JSON.stringify(this.selectPhoneIsShowList))
      history.back()
    }
  }
}
</script>

<style lang="less" scoped>
  .th_select_property{
    height: 100%;
    .th_select_property-header{
      width: 100%;;
      height: 1.625rem !important;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      box-shadow:0px 2px 0px 0px @cD8D8D8;
      & /deep/ .mint-navbar{
        height: 1.625rem;
        overflow: hidden;
        .mint-tab-item{
          padding:0;
          color: @c3;
          .mint-tab-item-label{
            font-size: @FontSize15;
            height: 1.8rem;
            line-height: 1.8rem;
          }
          &.is-selected{
            color: @cTheme;
          }
        }
      }
    }
    .th_select_property-cont{
      height: 100%;
      box-sizing: border-box;
      position: relative;
      padding-top: 1.8rem;
      & /deep/ .mint-tab-container{
        height: 100%;
        .mint-tab-container-wrap{
          height: 100%;
          .mint-tab-container-item{
            height: 100%;
            overflow: auto;
          }
        }
      }
      .th_select_property-list{
        height: 100%;
        overflow: auto;
      }
    }
    .th_select_property-footer{
      width: 100%;
      height: @footerHeight;
      line-height: @footerHeight;
      position: absolute;
      z-index: 10;
      bottom: 0;
      left: 0;
      text-align: center;
      color: @cTheme;
      font-size: @FontSize15;
      font-weight: bolder;
      border-top:1px solid @cD8D8D8;
    }
  }
</style>
