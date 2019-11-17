<template>
  <div class="th_cell" :class="{ifShow}">
    <div
      :is="isHomeCell?'th-cell-home':'th-cell-other'"
      :cellData="cellData"
      :isHaveArrow="isHaveArrow"
      @freshLocate="freshLocate"
    >
    <slot></slot>
    </div>
  </div>
</template>

<script>
import ThCellHome from '../cellHome/CellHome.vue'
import ThCellOther from '../cellOther/CellOther.vue'
export default {
  name: 'th-cell',
  props: {
    isHomeCell: { // 是否是首页的cell，首页cell样式有很大不同
      type: Boolean,
      default: false
    },
    isShow: { // 是否是首页的cell，首页cell样式有很大不同
      type: Boolean,
      default: false
    },
    isHaveArrow: { // 是否拥有右向箭头
      type: Boolean,
      default: false
    },
    ifShow: { // 是否显示标题
      type: Boolean,
      default: false
    },
    cellData: {
      type: Object
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    ThCellHome,
    ThCellOther
  },
  computed: {

  },
  mounted () {
    // console.log(this.isHaveArrow)
  },
  created () {
  },
  methods: {
    freshLocate () {
      this.$emit('freshLocate')
    }
  }
}
</script>

<style lang="less" scoped>
  .th_cell{
    position: relative;
    &.isShow{
      display: none;
    }
    .icon{
      content: " ";
      top: 0;
      position: absolute;
      left: 5.5rem;
      width: 0.7rem;
      height: 0.7rem;
      margin-top: 0.7rem;
      background-image: url('../cellOther/fresh.png');
      background-size: cover;
    }
  }

</style>
