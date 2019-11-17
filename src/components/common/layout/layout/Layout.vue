<template>
  <div
    class="th_laybox"
    ref='layBox'
    :class="{
      hiddenFooter:hiddenFooter,
      hiddenHeader:isIos && !hiddenHeader,
      isJrfwFjj:isJrfwFjj,
      isJrfwFgj:isJrfwFgj,
      paddingTop: paddingTop
    }">
      <div class="th_laybox-header lineargGradientFgj" :class="isIos? 'none' : ''" ref="showHeader">
          <slot name="header">
            <th-header v-if="hackReset && hackResetHeader"></th-header>
          </slot>
      </div>
      <div class="th_laybox-cont" ref="layBoxCont" v-if="hackReset">
          <slot></slot>
      </div>
      <div class="th_laybox-footer">
          <slot name="footer">
          </slot>
      </div>
  </div>
</template>

<script>
import ThHeader from '../header/Header.vue'
import ThFooterTab from '../footerTab/FooterTab.vue'

export default {
  name: 'th-layout',
  props: {
    hiddenFooter: {
      type: Boolean,
      default: false
    },
    hiddenHeader: {
      type: Boolean,
      default: false
    },
    loading: {// 加载中
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: '',
      hackReset: true,
      hackResetHeader: true,
      isApp: window.jrfw.isApp(),
      isJrfwFjj: window.jrfw.isJrfwFjj(),
      isJrfwFgj: window.jrfw.isJrfwFgj(),
      isIos: window.jrfw.isIos(),
      wxClient: window.jrfw.getIsWxClient(),
      paddingTop: true
    }
  },
  computed: {
    pageValue () {
      return this.$route.meta.pageValue
    }
  },
  updated () {
    // console.log(this.isIos || this.hiddenHeader)
    if (this.isIos) {
      this.hiddenHeader = true
      this.$refs.showHeader.style.display = 'none'
      this.paddingTop = false
    }
  },
  watch: {
    pageValue (val) {
      window.jrfw.isFirstScreen(val) && (this.active = val)
    },
    active (val) {
      // this.$router.push(val)
    },
    scroll (e) {
    }
  },
  created () {
  },
  mounted () {
    if (this.$refs.layBoxCont.children.length) {
      this.$refs.layBoxCont.children[0].scrollTop = this.$route.meta.scrollTop || 0
    }
  },
  components: {
    ThHeader,
    ThFooterTab
  },
  methods: {
    headerRefresh () {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    }
  }
}
</script>
<style lang="less" scoped>
.paddingTop{
  padding-top: @headerHeight;
}
.th_laybox{
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
    &.isJrfwFgj{
      .th_laybox-header{
        .lineargGradientFgj;
      }
    }
    &.isJrfwFjj{
      .th_laybox-header{
        .lineargGradientFjj;
      }
    }
    &.hiddenFooter{
        height: 100%;
        .th_laybox-footer{
            display: none;
        }
    }
    &.hiddenHeader{
      padding-top: 0;
        .th_laybox-header{
            display: none;
        }
    }
    .th_laybox-header{
        width: 100%;
        height: @headerHeight;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        .lineargGradient;
      &.none{
        display: none;
      }
    }
    .th_laybox-cont_mw{
      height: calc(100vh - @headerHeight);
      position: relative;
      background-color: @cf;
      >*{
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
    .th_laybox-cont{
        height: calc(100vh - @headerHeight - 55px);
      // padding-top: @headerHeight;
        position: relative;
        background-color: @cf;
        >*{
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
    }
    .th_laybox-footer{
        width: 100%;
        height: 55px;
        background-color: @cf;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10;
    }
}
</style>
