<template>
  <div class="th_dynamic_list">
    <div class="th_dynamic_list-item" v-for="(item, index) in dynamicList" :key="index" @click="click">
      <th-img-text-level>
        <th-img-box class="th_dynamic_list-item-img" :imgUrl="item.picPath || 'http://img.jrfw360.com/upload-file1555654572075'" slot="left"></th-img-box>
        <div class="th_dynamic_list-item-cont">
          <div class="th_dynamic_list-item-title">{{item.headline}}</div>
          <div class="th_dynamic_list-item-des">{{item.content}}</div>
          <!-- <div class="th_dynamic_list-item-info">
            <span class="th_dynamic_list-item-time">{{new Date(item.createDateFormat) | formatTime()}}</span>{{item.content}}
            <span class="th_dynamic_list-item-author">作者：{{item.resource}}</span>
          </div> -->
        </div>
      </th-img-text-level>
    </div>
  </div>
</template>

<script>
import baseIcon from '../../assets/Bitmap.png'
export default {
  props: {
    baseIcon: baseIcon,
    dynamicList: {
      type: Array
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {

  },
  computed: {

  },
  mounted () {
  },
  created () {

  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
.th_dynamic_list{
  .th_dynamic_list-item{
    height: 4.2rem;
    padding:@plrPage;
    overflow: hidden;
    display: block;
    border-bottom: 1px solid @cD8D8D8;
    & /deep/ .th_img_text_level{
      .th_img_text_level-left{
        width: 4rem;
      }
      .th_img_text_level-right{
        width: calc(100% - 4rem);
      }
    }
    .th_dynamic_list-item-cont{
      height: 100%;
      position: relative;
      line-height: @defaultFontSize;
      font-size: @smallFontSize;
      .th_dynamic_list-item-title{
        color: @c3;
        .lineClamp(1)
      }
      .th_dynamic_list-item-des{
        color: @c9;
        height: calc(2.4rem - 5px);
        margin-top: 5px;
        .lineClamp(3);
      }
      .th_dynamic_list-item-info{
        .FontSize10;
        color: @c9;
        position: absolute;
        bottom: 5px;
        left: 0;
        .th_dynamic_list-item-time{
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
