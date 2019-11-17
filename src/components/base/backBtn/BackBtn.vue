<template>
  <div class="back" v-if="haveHide">
    <div class="th_back_btn" @click="back">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: {
      type: String
    }
  },
  data () {
    return {
      haveHide: true,
      routeId: []
    }
  },
  computed: {

  },
  mounted () {

  },
  created () {
    // console.log(this.$route.name)
    try {
      let routeId = sessionStorage.getItem('routeId')
      if (routeId) {
        this.routeId = JSON.parse(routeId)
      }
    } catch (e) {
    }
    if ((/^building$/i.test(this.$route.name) && window.jrfw.isJrfwFgj()) || this.$route.name === 'newInfo') {
      this.haveHide = false
    }
    if (/^propertyDetail$/.test(this.$route.name)) {
      sessionStorage.setItem('inputTypeFlag', '')
      this.routeId.push(this.$route.params.id)
      sessionStorage.setItem('routeId', JSON.stringify(this.routeId))
    }
  },
  methods: {
    back () {
      if (window.jrfw.isApp()) {
        window.jrfw.back()
      } else if (window.jrfw.getIsWxClient()) {
        if (window.history.length > 1) {
          if (/^propertyDetail$/.test(this.$route.name)) {
            if (this.routeId[0] === this.$route.params.id) {
              window.location.href = 'http://h5.jrfw360.com/home'
            } else {
              history.back()
            }
          } else {
            history.back()
          }
        } else {
          window.location.href = 'http://h5.jrfw360.com/home'
        }
      } else {
        history.back()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.back{
  width: 0;
  height: 100%;
  float: left;
  .th_back_btn{
    width: 1.5rem;
    height: 100%;
    color: @cf;
    position: relative;
    left: -10px;
    &:after{
      border: solid .12rem @cf;
      border-bottom-width: 0;
      border-left-width: 0;
      content: " ";
      top: 50%;
      left: 55%;
      position: absolute;
      width: .55rem;
      height: .55rem;
      transform: translateY(-50%) rotate(-135deg);
    }
  }
}

</style>
