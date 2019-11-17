<template>
  <div class="th_chat" :style="{height: `${screenHeight}px`}">
    <th-layout>
      <div class="th_chat-header" slot="header">
        <th-back-btn></th-back-btn>
        <span class="groupName">{{$route.query.groupName}}</span>
        <router-link class="th_chat-item-img" :to="'/chatMemberList/'+groupId">
          ···
        </router-link>
      </div>
      <div class="contBox" id="contBox" @click="footerBlur">
        <div class="th_chat-cont" ref="cont" id="cont" @scroll="loadMore" v-show="reFresh">
          <div class="more_loading" v-if="showLoad">
            <span v-show="loading&&!allLoaded">加载中...</span>
            <span v-show="allLoaded">已全部加载</span>
          </div>
          <th-chat-item :chatData="list" :accountId='userInfo.id'></th-chat-item>
        </div>
      </div>
    </th-layout>
    <th-footer slot="footer" ref="ThFooter" @send="send" class="th-footer" @scrollTop="scrollTopSend"></th-footer>
    <div class="modelMask" v-show="this.userInfo.type === 4 ? modelMaskShow : !modelMaskShow"></div>
  </div>
</template>
<script>
// setGroupMsnList
import {sendMsn, setMsnListById, getCompanyMsnList, setChatMsnList} from '../../../common/httpClient.js'
import ThChatItem from './chatItem/ChatItem.vue'
import ThBackBtn from '../../../components/base/backBtn/BackBtn.vue'
import ThFooter from './footer/Footer.vue'
export default {
  data () {
    return {
      id: '',
      modelMaskShow: true,
      groupId: '',
      groupType: '',
      list: [],
      listRelize: [],
      ing: true,
      // 初始化无限加载相关参数setMsnListById,
      pageNo: 1,
      otherAccountId: this.$route.query.accountId || '',
      buildingGroupId: '',
      loading: false, // 加载中
      reFresh: false,
      allLoaded: true, // 全部加载
      showLoad: true,
      data: {},
      time: null
    }
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
  components: {
    ThChatItem,
    ThFooter,
    ThBackBtn
  },
  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id
    this.buildingGroupId = this.$route.query.buildingGroupId
    this.noScroll()
    this.$refs.cont.scrollTop = this.$refs.cont.scrollHeight
    to.meta.scrollTop = to.meta.scrollHeight
    next()
  },
  created () {
    this.buildingGroupId = this.$route.query.buildingGroupId
    this.groupType = this.$route.query.groupType
    this.groupId = this.$route.params.id
    this.otherAccountId = this.$route.query.accountId || ''
    this.pageNo = 1
    this.setMsnListById()
    this.scrollTopSend()
  },
  mounted () {
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  activated () {
  },
  methods: {
    timer () {
      setTimeout(() => {
        this.noScroll()
      }, 3000)
    },
    noScroll () {
      if (+this.groupType === 2) {
        let data = {
          'accountId': this.userInfo.id,
          'bulidingGroupId': this.buildingGroupId,
          'groupId': this.groupId || this.id,
          'pageNo': 1,
          'pageSize': 15
        }
        getCompanyMsnList(data).then((res) => {
          if (res && res.code === 1) {
            let cont = res && res.content
            this.list = cont.msnList
            this.scrollTopSend()
          } else {
            this.toast(res.msg || '加载失败')
          }
        })
      } else if (+this.groupType === 3) {
        let data = {
          'accountId': this.userInfo.id,
          // 'bulidingGroupId': this.buildingGroupId,
          'groupId': this.groupId || this.id,
          'otherAccountId': this.$route.query.accountId,
          'pageNo': 1,
          'pageSize': 15
        }
        setChatMsnList(data).then((res) => {
          if (res && res.code === 1) {
            let cont = res && res.content
            this.list = cont.msnList
            this.scrollTopSend()
          } else {
            this.toast(res.msg || '加载失败')
          }
        })
      } else {
        let data = {
          'accountId': this.userInfo.id,
          'groupId': this.groupId || this.id,
          'pageNo': 1,
          'pageSize': 15
        }
        setMsnListById(data).then((res) => {
          if (res && res.code === 1) {
            let cont = res && res.content
            this.list = cont.msnList
            this.scrollTopSend()
          } else {
            this.toast(res.msg || '加载失败')
          }
        })
      }
    },
    footerBlur () {
      this.$el.querySelector('#focus').blur()
    },
    scrollTop () {
      if (this.pageNo === 1) {
        this.$nextTick(() => {
          let container = document.getElementById('cont')
          container.scrollTop = container.scrollHeight
        })
      } else {
        this.$nextTick(() => {
          let container = document.getElementById('cont')
          container.scrollTop = container.clientHeight - container.scrollTop
        })
      }
    },
    scrollTopSend () {
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollTop = container.scrollHeight
        // console.log(container.clientHeight, container.scrollTop)
      })
    },
    loadMore () {
      if (!this.allLoaded) {
        // this.loading = true
        ++this.pageNo
        if (this.pageNo === 1) {
          this.showLoad = false
          this.noScroll()
        } else {
          this.setMsnListById()
        }
      }
    },
    setMsnListById () {
      this.showLoad = false
      this.reFresh = false
      if (+this.groupType === 2) {
        let data = {
          'accountId': this.userInfo.id,
          'bulidingGroupId': this.buildingGroupId,
          'groupId': this.groupId || this.id,
          'pageNo': this.pageNo,
          'pageSize': 15
        }
        getCompanyMsnList(data).then((res) => {
          this.loading = false
          if (res && res.code === 1) {
            this.reFresh = true
            let cont = res && res.content
            this.allLoaded = cont.msnList.length !== 15
            if (this.pageNo === 1) {
              this.list = cont.msnList
            } else {
              this.list.splice(0, 0, ...cont.msnList)
            }
            this.scrollTop()
          } else {
            this.toast(res.msg || '加载失败')
          }
        })
      } else if (+this.groupType === 3) {
        let data = {
          'accountId': this.userInfo.id,
          // 'bulidingGroupId': this.buildingGroupId,
          'groupId': this.groupId || this.id,
          'otherAccountId': this.$route.query.accountId,
          'pageNo': this.pageNo,
          'pageSize': 15
        }
        setChatMsnList(data).then((res) => {
          this.loading = false
          if (res && res.code === 1) {
            this.reFresh = true
            let cont = res && res.content
            this.allLoaded = cont.msnList.length !== 15
            if (this.pageNo === 1) {
              this.list = cont.msnList
            } else {
              this.list.splice(0, 0, ...cont.msnList)
            }
            this.scrollTop()
          } else {
            this.toast(res.msg || '加载失败')
          }
        })
      } else {
        let data = {
          'accountId': this.userInfo.id,
          'groupId': this.groupId,
          'pageNo': this.pageNo,
          'pageSize': 15
        }
        setMsnListById(data).then((res) => {
          this.loading = false
          if (res && res.code === 1) {
            this.reFresh = true
            let cont = res && res.content
            this.allLoaded = cont.msnList.length !== 15
            if (this.pageNo === 1) {
              this.list = cont.msnList
            } else {
              this.list.splice(0, 0, ...cont.msnList)
            }
            this.scrollTop()
          } else {
            this.toast(res.msg || '加载失败')
          }
        })
      }
    },
    send (sendData) {
      // private Long accountId;
      // private Long otherAccountId;
      // private Long chatId;
      // private Long targetId;//楼盘资源id
      // private Integer targetType;// 1 文字 2图片 3语音 4 楼盘 5 视频 5地理位置
      // private String picPath;// 图片url /楼盘图片/语音URL/视频URL
      // private String content;// 文字 或 楼盘标题 或地址
      // private String description;// 楼盘标签
      // private String lat;
      // private String lng;
      // private Integer groupType;// 1 在线咨询 2 公司房聊 3私聊 4报备利益链群聊
      // console.log(this.groupId)
      let data = {
        'accountId': this.userInfo.id,
        'groupId': this.groupId
      }
      sendMsn(Object.assign(data, sendData)).then((res) => {
        let cont = res && res.content
        this.list.push(cont)
        // this.setMsnListById()
        this.scrollTopSend()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.th_chat{
  height: 100%;
  position: relative;
  .modelMask{
    width: 100vw;
    height: @footerHeight;
    background-color: transparent;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1002;
  }
  .th-footer{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1000;
  }
  .th_chat-header{
    height: @headerHeight;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: calc(100% - 20px);
    line-height: @headerHeight;
    text-align: center;
    font-size: @FontSize17;
    color: @cf;
    padding: 0 10px;
    transform: translateZ(0);
    span{
      display: inline-block;
      &.groupName{
        width: 60%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        vertical-align: middle;
        margin: 0 auto;
      }
    }
    .th_chat-item-img{
      width: 1.5rem;
      position: absolute;
      top: 50%;
      right: 0;
      font-size: @FontSize18;
      font-family: '宋体';
      color: @cf;
      font-weight: bolder;
      letter-spacing: -10px;
      text-indent: -10px;
      text-align: center;
      transform: translate(-10px,-50%);
    }
  }
  .contBox{
    background-color: @cF5F5F5;
    height: 100%;
    .th_chat-cont{
      /*box-sizing: border-box;*/
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
}
</style>
