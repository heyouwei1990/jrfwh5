common<template>
  <div class="th_cell_other">
    <div class="th_cell_other-cell" :class="{arrow:isHaveArrow}">
      <span>{{cellData.title}}</span>
      <i class="icon" v-if="cellData.title==='当前定位城市'? true : false" @click="freshLocate"></i>
      <span class="th_cell_other-num" v-if="cellData.num">{{cellData.num}}</span>
      <!--<span class="moreLink"></span>-->
      <div class="th_cell_other-cell-rigth">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cellData: {
      type: Object
    },
    isHaveArrow: { // 是否拥有右向箭头
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      geolocation: null,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  watch: {
  },
  components: {},
  computed: {
    location () {
      return this.$store.state.locate.location
    }
  },
  methods: {
    freshLocate () {
      this.$parent.freshLocate()
    }
  }
}
</script>

<style lang="less" scoped>
.th_cell_other{
  .th_cell_other-cell{
    height: 2rem;
    line-height: 2rem;
    position: relative;
    font-size: @FontSize15;
    color: @c3;
    font-weight: bold;
    .icon{
      content: " ";
      top: 0;
      position: absolute;
      left: 5.5rem;
      width: 0.7rem;
      height: 0.7rem;
      margin-top: 0.7rem;
      background-image: url('./fresh.png');
      background-size: cover;
    }
    span{
      display: inline-block;
      vertical-align: middle;
      &.th_cell_other-num{
        height: .75rem;
        line-height: .75rem;
        color: @cf;
        font-size: @smallFontSize;
        padding: 0 .3rem;
        border-radius: .375rem;
        background-color:@cD14E33;
      }
    }
    &.arrow{
      .th_cell_other-cell-rigth{
        right: .5rem;
      }
      &::after{
        border: solid 1px @c6;
        border-bottom-width: 0;
        border-left-width: 0;
        content: " ";
        top: 50%;
        position: absolute;
        right: 2px;
        width: 7px;
        height: 7px;
        transform: translateY(-50%) rotate(45deg);
      }
    }
    .th_cell_other-cell-rigth{
      line-height: 2rem;
      font-size: @smallFontSize;
      font-weight: normal;
      color: @c9;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
