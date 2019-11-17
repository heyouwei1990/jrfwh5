<template>
  <div class="th_search">
      <input v-model="mySearchData" id="search" v-focus="routeName ==='homeSearch' || routeName === 'findHouseLocate' || routeName === 'homeLocate'" @keypress="searchGoods" placeholder="TODAY’S NETWORK" @input="getSearchData"/>
  </div>
</template>

<script>
import { debounce } from '../../../common/util.js'
export default {
  props: {
    imgUrl: {
      type: String
    },
    searchData: {
      type: String
    }
  },
  data () {
    return {
      mySearchData: '',
      routeName: this.$route.name
    }
  },
  directives: { // 优先获焦
    focus: {
      inserted (el, {value}) {
        // console.log(el, {value})
        if (value) {
          el.focus()
        }
      }
    }
  },
  computed: {
  },
  mounted () {
    // console.log(this.$route.name)
  },
  created () {
    if (this.routeName === 'homeLocate' || this.routeName === 'findHouseLocate') {
      this.$watch('mySearchData', debounce((newMySearchData) => {
        this.$emit('search', newMySearchData)
      }, 200))
    }
  },
  updated () {
  },
  methods: {
    getSearchData () {
      this.$emit('getSearchData', this.mySearchData)
    },
    searchGoods (event) {
      if (event.keyCode === 13 || event.keyCode === 9) { // 如果按的是enter键 13是enter
        event.preventDefault() || event.stopPropagation()
        // console.log(event.target.value)
        this.$emit('search')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.th_search{
    background: @cf;
    height: 1.5rem;
    line-height: 1.5rem;
    margin:.35rem 0;
    border-radius: .75rem;
    position: relative;
    color: @c9;
    padding-left: 1.8rem;

    input{
      width: calc(100% - 1rem);
      border: 0;
      height: 1.3rem;
      outline: none;
    }
    &:after{
      content: " ";
      background-image: url('./imgs/search.png');
      background-size: contain;
      position: absolute;
      // padding:.1rem;
      top: .45rem;
      left: .4rem;
      width: .7rem;
      height: .7rem;
    }
  }
</style>
