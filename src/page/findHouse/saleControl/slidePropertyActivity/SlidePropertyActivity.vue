<template lang="html">
<div class="th_slide_property_activity" v-if="slidePropertyActivityList">
  <ul class="th_slide_property_activity-cont" ref="slide">
    <li class="th_slide_property_activity-Item"
      v-for="(itemValue, index) in slidePropertyActivityList"
      :key="index" @click="click(index)">
      <th-img-box class="th_slide_property_activity-img" :imgUrl="itemValue.picPath"></th-img-box>
    </li>
  </ul>
  <div class="activitySw" v-show="modelSwiperShow">
    <div class="th_share_pic-header">
      <!--<img src="" alt="" class="close">-->
      <span class="close" @click="modelSwiperShow=false">×</span>
      <span>{{activeIndex+1}}/{{slidePropertyActivityList.length}}</span>
      <span class="soy"></span>
    </div>
    <div class="swiperBox" @click="closeSwiper">
      <swiper :options="swiperOption" ref="mySwiper" class="mySwiper">
        <swiper-slide v-for="(item,i) in slidePropertyActivityList" :key="i" >
          <div class="media-box">
            <img  class="th_share_pic-img" :src="item.picPath"/>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  props: {
    slidePropertyActivityList: {
      type: Array
    }
  },
  data () {
    return {
      dis: 0,
      timer: 0,
      imgList: [],
      activeIndex: 0,
      swiperOption: {
        centeredSlides: true,
        on: {
          slideChangeTransitionEnd: () => {
            this.activeIndex = this.$refs.mySwiper.swiper.activeIndex
          }
        }
      },
      modelSwiperShow: false,
      swiper: ''
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    click (index) {
      this.modelSwiperShow = true
      this.activeIndex = index
      this.$refs.mySwiper.swiper.activeIndex = index
    },
    closeSwiper () {
      this.modelSwiperShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.th_slide_property_activity{
  padding-bottom:@ptb;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  -webkit-overflow-scrolling: auto;
  height: 6rem;
  &::-webkit-scrollbar {
    opacity: 0;
  }
  .th_slide_property_activity-cont{
    display: inline-flex;
    position: absolute;
    .th_slide_property_activity-Item{
      width: 10rem;
      margin-right: @plr*2;
      &:first-child{
        margin-left: @plrPage;
      }
      &:last-child{
        margin-right: @plrPage;
      }
      .th_slide_property_activity-img{
        padding-top: @imgBase
      }
    }
  }
  .activitySw{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 1);
    .th_share_pic-header{
      width: 100%;
      height: @headerHeight;
      line-height: @headerHeight;
      color: @cf;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 10px;
      font-size: @FontSize16;
      .close{
        display: inline-block;
        width: @headerHeight;
        height: @headerHeight;
        font-size: 1.8rem;
        text-align: center;
      }
      .soy{
        display: inline-block;
        width: @headerHeight;
        height: @headerHeight;
      }
    }
    .swiperBox{
      width: 100vw;
      height: calc(100% - @headerHeight);
      position: absolute;
      top: @headerHeight;
      left: 0;
      z-index: 2000;
      .mySwiper{
        height: calc(100% - 4rem);
        .media-box{
          width:100% ;
          height: 100%;
          .th_share_pic-img{
            width:100% ;
            object-fit: contain;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}
</style>
