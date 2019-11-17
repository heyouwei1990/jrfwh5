<template>
  <div class="th_chat_list">
    <div class="filderHeader">
      <div class="infoSearch">
        <div class="th_search">
          <input v-model="mySearchData" id="search" @keypress="searchGoods" placeholder="请输入楼盘名称" @input="getSearchData"/>
        </div>
        <div class="search" @click="infoSearch(mySearchData)">搜索</div>
      </div>
    </div>
    <th-layout id="cont">
      <div class="th_chat_list-cont" ref="cont" style="position: relative;height: calc(100% - 45px);padding-top: 45px;" v-infinite-scroll="loadMore" infinite-scroll-distance="20">
        <ul>
          <li class="myInfoList" @click="goMyInfo">
            <th-img-text-level class="th_chat_list-item">
              <th-img-box class="th_chat_list-item-img" :imgUrl="baseIcon" slot="left"></th-img-box>
              <div class="th_chat_list-item-cont">
                  我的消息
              </div>
            </th-img-text-level>
            <i class="unReadInfo" v-if="infoSum">{{this.infoSum > 99 ? '99+' : this.infoSum}}</i>
          </li>
          <li v-for="(item,i) in list" :key="i" @click="goChat(item.id, item.groupType, str (item.groupName), item.buildingGroupId)">
            <th-img-text-level class="th_chat_list-item">
              <th-img-box class="th_chat_list-item-img" :imgUrl="item.picPath || baseIcon" slot="left"></th-img-box>
              <div class="th_chat_list-item-cont">
                <p>
                  {{item.groupName}}
                </p>
                <span>{{item.lastMsnDate | formatTime('YMDHMS')}}</span>
                <br>
                <div>{{item.lastMsn}}</div>
              </div>
            </th-img-text-level>
            <i class="unReadInfo" v-if="item.unReadNum">{{item.unReadNum > 99 ? '99+' : item.unReadNum}}</i>
          </li>
        </ul>
        <div class="more_loading">
          <span v-show="loading&&!allLoaded">加载中...</span>
          <span v-show="allLoaded">已全部加载</span>
        </div>
      </div>
      <th-footer-tab slot="footer" :active="'newInfo'"></th-footer-tab>
    </th-layout>
  </div>
</template>
<script>
import { debounce } from '../../../common/util.js'
import {setMyList, setInfoList} from '../../../common/httpClient.js'
import baseIcon from './imgs/infoBase.jpg'
import ThFooterTab from '../../../components/common/layout/footerTab/FooterTab.vue'
export default {
  data () {
    return {
      list: [],
      baseIcon: baseIcon,
      infoSum: 0,
      // 初始化无限加载相关参数 v-if="newMsnCount"
      pageNo: 1,
      dataChange: false,
      loading: false, // 加载中
      allLoaded: true // 全部加载
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
  watch: {
    list (newVal, oldVal) {
      this.timer()
    }
  },
  directives: { // 优先获焦
    focus: {
      inserted (el, {value}) {
        // console.log(el, {value})
        if (value) {
          el.focus()
        }
      }
    }
  },
  created () {
    this.$watch('mySearchData', debounce((newMySearchData) => {
      this.infoSearch(newMySearchData)
    }, 200))
  },
  mounted () {
    this.setInfoList()
    this.getData()
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    handleScroll () {
      let container = document.getElementById('cont')
      container.scrollTop = 0
    },
    timer () {
      setTimeout(() => {
        this.dataChange = true
        this.setInfoList()
        this.getData()
      }, 3000)
    },
    loadMore () {
      if (!this.allLoaded) {
        this.loading = true
        ++this.pageNo
        this.getData()
      }
    },
    setInfoList () {
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
        let cont = res && res.content
        this.infoSum = cont.reportNum + cont.commendNum + cont.followNum + cont.customDynamicNum + cont.systemNum + cont.dynamicCount
        sessionStorage.setItem('newMsnCount', cont.newMsnCount)
      })
    },
    getDataFresh () {
      let data = {
        'accountId': this.userInfo.id,
        'pageNo': 1,
        'pageSize': 10
      }
      setMyList(data).then((res) => {
        // this.loading = false
        if (res && res.code === 1) {
          let cont = res && res.content
          this.allLoaded = cont.length !== 10
          if (this.pageNo === 1) {
            this.list = cont
          } else if (!this.dataChange) {
            this.list.push(...cont)
          } else {
            let list = []
            this.list.forEach((item) => {
              // item.solve = true
              list.push(item)
            })
            this.list = list
          }
          this.dataChange = false
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    },
    getData () {
      let data = {
        'accountId': this.userInfo.id,
        'pageNo': this.pageNo,
        'pageSize': 10
      }
      setMyList(data).then((res) => {
        // this.loading = false
        if (res && res.code === 1) {
          let cont = res && res.content
          this.allLoaded = cont.length !== 10
          if (this.pageNo === 1) {
            this.list = cont
          } else if (!this.dataChange) {
            this.list.push(...cont)
          } else {
            let list = []
            this.list.forEach((item) => {
              // item.solve = true
              list.push(item)
            })
            this.list = list
          }
          this.dataChange = false
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    },
    searchGoods (event) {
      if (event.keyCode === 13 || event.keyCode === 9) { // 如果按的是enter键 13是enter
        event.preventDefault() || event.stopPropagation()
        // console.log(event.target.value)
        this.infoSearch(this.mySearchData)
      }
    },
    infoSearch (newMySearchData) {
      let data = {
        'accountId': this.userInfo.id,
        'groupName': newMySearchData,
        'pageNo': this.pageNo,
        'pageSize': 10
      }
      setMyList(data).then((res) => {
        // this.loading = false
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
    },
    str (groupName) {
      let index = groupName.indexOf('-')
      return groupName.substring(index + 1, groupName.length)
    },
    goMyInfo () {
      this.$router.push({
        name: 'myInfo',
        query: {}
      })
    },
    goChat (id, groupType, groupName, buildingGroupId) {
      if (+groupType === 2) {
        this.toast('请在房经济APP或者房管家APP中查看')
      } else {
        this.$router.push({name: 'chat', params: {id: id}, query: {groupType: groupType, groupName: groupName, buildingGroupId: buildingGroupId}})
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .th_chat_list{
    height: 100%;
    color: @c9;
    font-size: @smallFontSize;
    position: relative;
    .filderHeader{
      width: calc(100% - 2*@plrPage);
      height: @headerHeight;
      border-bottom: 1px solid @cD8D8D8;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      align-content: center;
      padding: 0 @plrPage;
      position: fixed;
      top: @headerHeight;
      left: 0;
      z-index: 100;
      background-color: @cf;
      .infoSearch{
        width: 100%;
        height: 1.5rem;
        display: flex;
        flex-direction: row;
        .search{
          width: 3rem;
          height: 100%;
          font-size: 14px;
          line-height: 1.5rem;
          color: @cf;
          text-align: center;
          margin-left: 0.5rem;
          border: 1px solid @cTheme;
          border-radius: .75rem;
          background-color: @cTheme;
        }
        .th_search{
          width: calc(100% - 5.3rem);
          background: @cf;
          height: 1.5rem;
          line-height: 1.5rem;
          border-radius: .75rem;
          position: relative;
          color: @c9;
          padding-left: 1.8rem;
          border: 1px solid @cD8D8D8;
          input{
            width: 100%;
            border: 0;
            height: 1.3rem;
            outline: none;
            border-radius: .75rem;
          }
          &:after{
            content: " ";
            background-image: url('./imgs/search.png');
            background-size: contain;
            position: absolute;
            top: .45rem;
            left: .4rem;
            width: .7rem;
            height: .7rem;
          }
        }
      }
    }
    ul{
      li{
        padding: @plrPage;
        border-bottom: 1px solid @cD8D8D8;
        height: 2.8rem;
        position: relative;
        &.myInfoList{
          .th_chat_list-item{
            font-size: 16px;
            line-height: 50px;
            &::before{
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              border-right: 10px solid transparent;
              border-left: 10px solid @cD8D8D8;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
            }
            &::after{
              content: '';
              position: absolute;
              right: 4px;
              top: 50%;
              transform: translateY(-50%);
              border-right: 8px solid transparent;
              border-left: 8px solid @cf;
              border-top: 8px solid transparent;
              border-bottom: 8px solid transparent;
            }
          }
        }
        .th_chat_list-item{
          .th_chat_list-item-cont{
            width: 100%;
            p,div{
              width: 70%;
              .lineClamp(1);
            }
            div{
            }
          }
          /deep/ .th_img_text_level-left{
            width: 2.8rem;
          }
          /deep/ .th_img_text_level-right{
            width: calc(100% - 2.8rem);
            span{
              float: right;
            }
          }
        }
        .unReadInfo{
          width: 1rem;
          height: 1rem;
          line-height: 1rem;
          background-color: #D14E33;
          font-size: 12px;
          color: #ffffff;
          border-radius: 50%;
          position: absolute;
          /*top: 50%;*/
          /*right: 17px;*/
          /*transform: translateY(-35%);*/
          top: 2px;
          left: 47px;
          text-align: center;
        }
      }
    }
  }
</style>
