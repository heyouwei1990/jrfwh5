<template lang="html">
  <div class="th_share_pic">
    <tx-layout :hiddenFooter="true">
      <div class="th_share_pic-header" slot="header">
        <th-back-btn></th-back-btn>
        <span>{{activeIndex+1}}/{{imgList.length}}</span>
        <!-- <div class="th_share_pic-right">全部图片</div> -->
      </div>
      <div class="th_share_pic-cont" ref="cont" :hiddenFooter="true" >
        <swiper :options="swiperOption" ref="mySwiper" class="mySwiper">
          <swiper-slide v-for="(item,i) in imgList" :key="i" >
            <div v-if="item.video" class="media-box">
              <video :src="item.video" :poster="item.picPath" controls></video>
            </div>
            <div v-else class="media-box">
              <viewer @inited="inited">
                <img  class="th_share_pic-img" :src="item.picPath" @click="goUrl(item.url)"/>
              </viewer>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </tx-layout>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import ThBackBtn from '../../../../components/base/backBtn/BackBtn.vue'
import {setPropertyDetailAttach} from '../../../../common/httpClient.js'
export default {
  data () {
    return {
      isImg: '',
      isVideo: '',
      isBigImg: '',
      imgList: [],
      list: [],
      smallType: [],
      activeIndex: 0,
      type: 1, // 1图片；2视频；3全景
      swiperOption: {
        centeredSlides: true,
        on: {
          slideChangeTransitionEnd: () => {
            this.activeIndex = this.$refs.mySwiper.swiper.activeIndex
          }
        }
      },
      mobile: (!!window.navigator.userAgent.match(/AppleWebKit.*Mobile.*/) || !!window.navigator.userAgent.match(/AppleWebKit/)) && !window.jrfw.getIsWxClient() // 是否为移动终端
    }
  },
  components: {
    ThBackBtn,
    swiper,
    swiperSlide
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    },
    styleComputer: {
      height: this.mobile ? 'calc(100% + 55px)' : 'calc(100% + 55px)'
    }
  },
  created () {
    this.setData(this.type)
  },
  mounted () {
    this.setMedia(1)
    this.setMedia(2)
    this.setMedia(3)
  },
  methods: {
    setMedia (type) {
      let data = {
        'buildingGroupId': this.$route.params.id,
        // "picTypeId": 121,
        'type': type
      }
      setPropertyDetailAttach(data).then((res) => {
        let cont = res && res.content
        if (cont.list.length > 0) {
          type === 1 ? this.isImg = 1 : (type === 2 ? this.isVideo = 1 : this.isBigImg = 1)
        } else {
          type === 1 ? this.isImg = 0 : (type === 2 ? this.isVideo = 0 : this.isBigImg = 0)
        }
      })
    },
    goUrl (url) {
      url && (location.href = url)
    },
    setActive (index) {
      this.activeIndex = index
      this.$refs.mySwiper.swiper.slideTo(index, 1000, false)
    }
  }
}
</script>

<style lang="less" scoped>
  .th_share_pic{
    height: 100%;
    color: @cf;
    font-size: @defaultFontSize;
    .th_share_pic-header{
      width: 100%;
      height: 100%;
      line-height: @headerHeight;
      text-align: center;
      font-size: @FontSize17;
      color: @cf;
      background-color: @c0;
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
      background-color: @c0;
      .mySwiper{
        height: calc(100% - 4rem);
        .media-box{
          width:100% ;
          height: 100%;
          video{
            width:100% ;
            height: 100%;
            object-fit: contain;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
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
      .th_share_pic-menu{
        display: flex;
        border-top:1px solid @cf;
        li{
          flex: 1;
          height: 2rem;
          line-height: 2rem;
          position: relative;
          &.active::after{
            width: 1rem;
            height: 2px;
            content: '';
            display: inline-block;
            position: absolute;
            bottom: .2rem;;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 1px;
          }
        }
      }
      .th_share_pic-scroll{
        border-top:1px solid @cf;
        overflow-x: auto;
        overflow-y: hidden;
        ul{
          width: auto;
          overflow: hidden;
          display: inline-flex;
          li{
            min-width: 100px;
            height: 2rem;
            text-align: center;
            line-height: 2rem;
            float: left;
            list-style: none;
            position: relative;
            &.active::after{
              width: 3rem;
              height: 2px;
              content: '';
              display: inline-block;
              position: absolute;
              bottom: .2rem;;
              left: 50%;
              transform: translateX(-50%);
              background-color: #fff;
              border-radius: 1px;
            }
          }
        }
      }
    }
  }
</style>
