<template>
  <div class="th_my_iframe">
    <tx-layout :hiddenFooter="true">
      <div class="th_my_iframe-cont" ref="cont">
        <img :src="$route.query.picPath" />
         <!--<iframe  class="myIframe" :src="$route.query.picPath"></iframe>-->
      </div>
    </tx-layout>
  </div>
</template>

<script>
export default {
  created () {
    this.$route.query.title && (document.meta.title = this.$route.query.title)
  }
}
</script>

<style scoped lang='less'>
.th_my_iframe{
  height: 100%;
  .th_my_iframe-cont{
    width: 100%;
    height: 100%;
    border: 0;
    img{
      max-width: 100%;
    }
  }
}
</style>
