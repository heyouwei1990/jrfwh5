<template>
  <div class="th_share_pic">
    <div class="th_share_pic-cont" ref="cont" :hiddenFooter="true">
      <img :src="shareAPPUrl"/>
    </div>
  </div>
</template>

<script>
import {getByAccountId, setBaseInfoList} from '../../../common/httpClient.js'
// import ThBackBtn from '../../../components/base/backBtn/BackBtn.vue'
export default {
  data () {
    return {
      list: [],
      type: null,
      roles: null,
      shareAPPUrl: ''
    }
  },
  // components: {
  //   ThBackBtn
  // },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    }
  },
  created () {
    if (!this.$route.query.from) {
      this.share()
    }
    this.getData()
  },
  methods: {
    getData () {
      let data = {
        'accountId': this.userInfo.id,
        'loginToken': this.userInfo.loginToken
      }
      getByAccountId(data).then((res) => {
        if (res && res.code === 1) {
          let userInfo = res.content.account
          this.roles = userInfo.roles
          this.type = userInfo.type
          setBaseInfoList({
            code: 'sharePic'
          }).then((res) => {
            if (res && res.code === 1) {
              this.list = res && res.content
              if (this.roles === 5 || this.type >= 9) {
                this.shareAPPUrl = this.list[2].value
              } else if (this.type > 3 && this.type < 9) {
                this.shareAPPUrl = this.list[1].value
              } else {
                this.shareAPPUrl = this.list[0].value
              }
              this.wxShare({
                title: '分享APP',
                imgUrl: this.shareAPPUrl,
                link: this.shareAPPUrl,
                desc: ''
              })
            } else {
              this.toast(res.msg || '加载失败')
            }
          })
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    },
    share () {
      this.wxShare({
        title: '分享APP',
        imgUrl: this.shareAPPUrl,
        link: this.shareAPPUrl,
        desc: ''
      }, true)
    }
  }
}
</script>

<style lang="less" scoped>
  .th_share_pic{
    height: 100%;
    .th_share_pic-header{
      width: 100%;
      height: 100%;
      line-height: @headerHeight;
      text-align: center;
      font-size: @FontSize17;
      color: @cf;
      .th_share_pic-right{
        // width: 4rem;
        position: absolute;
        top: 0;
        right: .4rem;
        font-size: @defaultFontSize;
      }
    }
    .th_share_pic-cont{
      width: 100%;
      height: 100%;
      text-align: center;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
