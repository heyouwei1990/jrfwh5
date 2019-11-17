<template>
  <div
    class="tx_laybox"
    ref='layBox'
    :class="{
      hiddenHeader:isIos && !hiddenHeader,
      isJrfwFjj:isJrfwFjj,
      isJrfwFgj:isJrfwFgj
    }">
    <div class="tx_laybox-header lineargGradientFgj" ref="showHeader">
      <slot name="header">
        <th-header></th-header>
      </slot>
    </div>
    <div class="tx_laybox-cont" :class="{paddingTop: !isIos && !hiddenHeader, paddingTop0: isIos && !hiddenHeader}" ref="layBoxCont" v-if="hackReset">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import ThHeader from '../header/Header.vue'
export default {
  name: 'tx-layout',
  props: {
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
      hackReset: true,
      isApp: window.jrfw.isApp(),
      isJrfwFjj: window.jrfw.isJrfwFjj(),
      isJrfwFgj: window.jrfw.isJrfwFgj(),
      isIos: window.jrfw.isIos(),
      wxClient: window.jrfw.getIsWxClient(),
      paddingTop0: false,
      paddingTop: true
    }
  },
  computed: {
    pageValue () {
      return this.$route.meta.pageValue
    }
  },
  updated () {
    // if (this.isIos) {
    //   this.hiddenHeader = true
    //   this.$refs.showHeader.style.display = 'none'
    //   this.paddingTop = false
    // }
  },
  watch: {
    pageValue (val) {
      window.jrfw.isFirstScreen(val) && (this.active = val)
    },
    active (val) {
      // this.$router.push(val)
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
    ThHeader
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
  .tx_laybox{
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    &.isJrfwFgj{
      .tx_laybox-header{
        .lineargGradientFgj;
      }
    }
    &.isJrfwFjj{
      .tx_laybox-header{
        .lineargGradientFjj;
      }
    }
    &.hiddenHeader{
      padding-top: 0;
      .tx_laybox-header{
        display: none;
      }
    }
    .tx_laybox-header{
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
    .tx_laybox-cont{
      position: relative;
      background-color: @cf;
      &.paddingTop{
        height: calc(100vh - @headerHeight);
        padding-top: @headerHeight;
      }
      &.paddingTop0{
        height: 100vh;
      }
      >*{
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
    }
  }
</style>
