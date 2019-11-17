<template>
  <div class="th_chat_list">
    <div class="filderHeader">
      <div class="infoFilder" v-for="(item, i) in infoList" :class="{active: item.type===infoActive}" :key="i" @click="infoFilder(item.type)"><span>{{item.filderName}}</span></div>
    </div>
    <th-layout ref="layBox" :hiddenFooter="true">
      <div class="th_chat_list-cont" ref="cont" style="position: relative;height: calc(100% - 3.3rem + 55px);padding-top: 3.3rem;" v-infinite-scroll="loadMore" infinite-scroll-distance="20">
        <ul>
          <li class="infoList" v-for="(item,i) in list" :key="i" @click="linkClick(item.mediaUrl, item.title, item.id, item.solve)">
            <span>{{item.createTime | formatTime('YMDHMS_')}}</span>
            <p>{{item.title}}</p>
            <i class="unReadInfo" v-if="!item.solve"></i>
            <!--<div>{{item.content}}</div>-->
          </li>
        </ul>
        <div class="more_loading">
          <span v-show="loading&&!allLoaded">加载中...</span>
          <span v-show="allLoaded">已全部加载</span>
        </div>
      </div>
    </th-layout>
    <transition enter-active-class="zoomIn" leave-active-class="zoomOut">
      <div class="mask animated" v-show="linkModel" @click="linkModel = false">
        <div class="model">
          <span class="content">{{inviteTitle}}</span>
          <div class="clickBtn">
            <span class="cancel" @click="confirmChannel(1)">拒绝</span>
            <span class="confirm" @click="confirmChannel(2)">同意</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {setInfoListById, readMsn, operate, getByAccountId} from '../../../common/httpClient.js'
export default {
  data () {
    return {
      linkModel: false,
      list: [],
      infoChatList: [],
      baseIcon: window.jrfw.baseIcon,
      // 初始化无限加载相关参数
      pageNo: 1,
      loading: false, // 加载中
      allLoaded: true, // 全部加载
      infoList: [
        {
          filderName: '全部',
          type: 0
        },
        {
          filderName: '报备',
          type: 1
        },
        {
          filderName: '订阅',
          type: 5
        },
        {
          filderName: '楼盘',
          type: 3
        },
        {
          filderName: '客户',
          type: 6
        },
        {
          filderName: '系统',
          type: 7
        }
      ],
      infoActive: 0,
      intoNum: 1,
      infoOldActive: 0,
      linkClickFalg: false
    }
  },
  watch: {
    'infoActive' (newVal, oldVal) {
      this.infoActive = newVal
      this.infoOldActive = oldVal
      if (oldVal !== newVal) {
        this.$nextTick(() => {
          this.$ref.cont.scrollTop = 0
        })
        this.pageNo = 1
        window.scrollTo(0, 0)
      }
      this.infoFilder(newVal)
    }
  },
  components: {
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    }
  },
  created () {
    this.infoFilder(this.infoActive)
  },
  methods: {
    loadMore () {
      if (!this.allLoaded) {
        this.loading = true
        ++this.pageNo
        this.infoFilder(this.infoActive)
      }
    },
    linkClick (link, title, id, readSolve) {
      if (!readSolve) {
        this.readMsn(id)
      }
      if (link.indexOf('invite') > -1) {
        this.inviteTitle = title
        this.inviteId = link.substring(link.indexOf('=') + 1, link.length)
        // console.log(this.inviteId)
        this.linkModel = true
      }
    },
    // POST /system/getMsnList 获取信息列表 媒体类型 1报备提醒 2 群聊提醒 3 楼盘动态 4 楼盘推荐 5 订阅消息 6 客户动态 7系统通知
    infoFilder (type, msnId) {
      this.infoActive = type
      let data = {
        'accountId': this.userInfo.id,
        'mediaType': type,
        'pageNo': this.pageNo,
        'pageSize': 10
      }
      setInfoListById(data).then((res) => {
        this.loading = false
        if (res && res.code === 1) {
          let cont = res && res.content
          this.allLoaded = cont.length !== 10
          if (cont.length !== 10) {
            this.intoNum++
          }
          if (this.pageNo === 1) {
            this.list = cont
          } else if (!this.linkClickFalg) {
            this.list.push(...cont)
          } else {
            let list = []
            this.list.forEach((item) => {
              if (item.id === msnId) {
                item.solve = true
              }
              list.push(item)
            })
            this.list = list
            this.linkClickFalg = false
          }
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    },
    readMsn (msnId) {
      let data = {
        'accountId': this.userInfo.id,
        'id': msnId
      }
      readMsn(data).then((res) => {
        this.loading = false
        this.linkClickFalg = true
        if (res.code === 1) {
          // this.toast(res.msg || '操作成功')
          this.infoFilder(this.infoActive, msnId)
        } else {
          this.toast(res.msg || '操作失败')
        }
      })
    },
    str (groupName) {
      let index = groupName.indexOf('-')
      return groupName.substring(index + 1, groupName.length)
    },
    goChat (id, groupType, groupName, buildingGroupId) {
      if (+groupType === 2) {
        this.toast('请在房经济APP或者房管家APP中查看')
      } else {
        this.$router.push({name: 'chat', params: {id: id}, query: {groupType: groupType, groupName: groupName, buildingGroupId: buildingGroupId}})
      }
    },
    getUserInfo () {
      let data = {
        'accountId': this.userInfo.id,
        'loginToken': this.userInfo.loginToken
      }
      // let _this = this
      getByAccountId(data).then((res) => {
        if (res && res.code === 1) {
          let userInfo = res.content.account
          this.$store.commit('user/setUser', {
            id: userInfo.id,
            phone: userInfo.phone || userInfo.hiddenPhone || '',
            userName: userInfo.yyUser.userName,
            avatar: userInfo.yyUser.avatar,
            type: userInfo.type,
            roles: userInfo.roles,
            authenticationFlag: userInfo.yyUser.authenticationFlag,
            loginToken: userInfo.loginToken
          })
          if (userInfo.roles === 5 || userInfo.type >= 9) {
            if (navigator.userAgent.match(/Android/i)) {
              location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.steward'
            } else if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
              location.href = 'https://itunes.apple.com/cn/app/%E8%84%89%E6%A5%BC/id1457937506?mt=8'
            }
          } else if (userInfo.type > 3 && userInfo.type < 9) {
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
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    },
    confirmChannel (status) {
      let e = event || window.event
      e.stopPropagation()
      let data = {
        'accountId': this.userInfo.id,
        'id': this.inviteId,
        'status': status
      }
      operate(data).then((res) => {
        this.loading = false
        if (res && res.code === 1) {
          this.getUserInfo()
          this.linkModel = false
          this.toast(res.msg || '操作成功')
          if (status === 2) {

          } else {

          }
        } else {
          this.toast(res.msg || '操作失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .th_chat_list{
    height: 100%;
    color: @c9;
    /*padding-left:  @plrPage;*/
    font-size: @smallFontSize;
    .filderHeader{
      width: 100%;
      height: 2.5rem;
      padding: @plrPage 0;
      border-bottom: 1px solid @cD8D8D8;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      align-content: center;
      position: fixed;
      top: @headerHeight;
      left: 0;
      z-index: 100;
      background-color: @cf;
      .infoFilder{
        height: 1.3rem;
        padding: 0 0.75rem;
        border: 1px solid @cD8D8D8;
        span{
          font-size: 14px;
          line-height: 1.3rem;
        }
      }
      .active{
        background-color: @cTheme;
        color: @cf;
      }
    }
    ul{
      li{
        padding: @plrPage;
        border-bottom: 1px solid @cD8D8D8;
        height: 2rem;
        position: relative;
        .unReadInfo{
          border: 5px solid #D14E33;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          right: 17px;
          transform: translateY(-35%);
        }
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
