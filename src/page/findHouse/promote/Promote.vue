<template>
  <div class="th_promote">
    <tx-layout :hiddenFooter="true">
      <div class="th_promote-header" slot="header">
        <th-back-btn></th-back-btn>
        <span>{{$route.query.buildingGroupName? $route.query.buildingGroupName + '-' + $route.meta.title : $route.meta.title}}</span>
      </div>
      <div class="th_promote-cont" ref="cont"  v-infinite-scroll="loadMore" infinite-scroll-distance="20">
        <th-promote-list :promoteList="list"></th-promote-list>
        <div class="more_loading">
            <span v-show="loading&&!allLoaded">加载中...</span>
            <span v-show="allLoaded">已全部加载</span>
          </div>
      </div>
    </tx-layout>
  </div>
</template>

<script>
import ThBackBtn from '../../../components/base/backBtn/BackBtn.vue'
import ThPromoteList from '../../../components/promoteList/PromoteList.vue'
import {setPromote} from '../../../common/httpClient.js'
export default {
  data () {
    return {
      list: [],
      // 初始化无限加载相关参数
      pageNo: 1,
      loading: false, // 加载中
      allLoaded: true,
      mobile: (!!window.navigator.userAgent.match(/AppleWebKit.*Mobile.*/) || !!window.navigator.userAgent.match(/AppleWebKit/)) && !window.jrfw.getIsWxClient() // 是否为移动终端
    }
  },
  components: {
    ThBackBtn,
    ThPromoteList
  },
  computed: {
    styleComputer: {
      height: this.mobile ? 'calc(100% + 55px)' : 'calc(100% + 55px)'
    }
  },
  mounted () {

  },
  created () {
    this.getData()
  },
  // activated () {
  //   this.pageNo = 1
  //   this.getData()
  // },
  methods: {
    loadMore () {
      if (!this.allLoaded) {
        this.loading = true
        ++this.pageNo
        this.getData()
      }
    },
    getData () {
      let data = {
        buildingGroupId: this.$route.query.buildingGroupId || '',
        cityId: this.$route.query.cityId || '',
        typeId: this.$route.query.id || '',
        pageNo: this.pageNo,
        pageSize: 10
      }
      setPromote(data).then((res) => {
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
.th_promote{
  height: 100%;
  .th_promote-header{
    height: @headerHeight;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    /* justify-content: normal; */
    align-items: center;
    width: calc(100% - 20px);
    line-height: @headerHeight;
    text-align: center;
    font-size: @FontSize17;
    color: @cf;
    padding: 0 10px;
    transform: translateZ(0);
    height: 44px;
    span{
      display: flex;
      width: 100%;
      justify-content: center;
    }
  }
  .th_promote-cont{
    width: 100%;
    height: 100%;
    overflow: auto;
    .th_promote-type{
      overflow: hidden;
      font-size: @smallFontSize;
      line-height: 1.5rem;
      text-align: center;
      li{
        width: 33%;
        float: left;
        border-right: 1px solid @cD8D8D8;
        &:before{
          content: '';
          width: .4rem;
          height: .4rem;
          background-color: @cTheme;
          display: inline-block;
          border-radius: 50%;
          margin-right: .5rem;
        }
        &:nth-child(2){
          &:before{
            background-color: @cD14E33;
          }
        }
        &:nth-child(3){
          border: 0;
          &:before{
            background-color: @c9;
          }
        }
      }
    }
    .th_promote-img /deep/ .th_img-box{
      padding-top: @imgBuilding;
    }

    & /deep/ .th_cell{
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
