<template>
  <div class="th_share_pic">
    <div class="th_share_pic-cont" ref="cont" :hiddenFooter="true">
      <img :src="list"/>
    </div>
  </div>
</template>

<script>
import {getSharePic} from '../../../common/httpClient.js'
// import ThBackBtn from '../../../components/base/backBtn/BackBtn.vue'
export default {
  data () {
    return {
      list: ''
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
    this.getData()
    if (!this.$route.query.from) {
      this.share()
    }
  },
  methods: {
    getData () {
      let data = {
        'accountId': this.userInfo.id
      }
      getSharePic(data).then((res) => {
        if (res && res.code === 1) {
          this.list = res && res.content
          this.wxShare({
            title: '邀请好友',
            imgUrl: this.list,
            link: this.list,
            desc: ''
          })
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    },
    share () {
      this.wxShare({
        title: '邀请好友',
        imgUrl: this.list,
        link: this.list,
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
    height: 100%;
    text-align: center;
    img{
      width: 100%;
      height: auto;
    }
  }
}
</style>
