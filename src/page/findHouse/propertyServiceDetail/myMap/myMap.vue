<template>
  <div class="myMap">
    <th-layout class="th_map-cont" :hiddenFooter="true" :zoom="zoom">
      <baidu-map class="map"
                 :center="circlePath.center"
                 :zoom="15"
                 :scroll-wheel-zoom="true"
                 ak="0iHcMzD3HRWeh2aHmVV0hbGZlWvr8och">
        <!--<bm-circle :center="circlePath.center" :radius="circlePath.radius" stroke-color="transparent" :stroke-opacity="0" :stroke-weight="1" @lineupdate="updateCirclePath" :editing="true"></bm-circle>-->
        <bm-view class="map" center="北京">
        </bm-view>
        <bm-transit :start="circlePath.center" end="北京邮电大学西门" :auto-viewport="true" location="北京"></bm-transit>
        <!--<bm-local-search :keyword="keyword" :bounds="bounds" :page-capacity="100" :panel="false" @searchcomplete="searchcomplete"></bm-local-search>-->
      </baidu-map>
      <!--<baidu-map
        class="th_property_map-baidu"
        :center="center"
        :zoom="zoom"
        @dragend="dragend"
        @ready="handler"
        :scroll-wheel-zoom="true"
        ak="0iHcMzD3HRWeh2aHmVV0hbGZlWvr8och">
        <bm-marker :position="center"  :dragging="true" animation="BMAP_ANIMATION_BOUNCE" @click="show = true">
          <bm-label content="我的位置" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: -17, height: 30}"/>
          <bm-info-window :show="show" @close="show = false" @open="show = true">我的位置：{{location.city + location.district + location.street}}</bm-info-window>
        </bm-marker>
        <bm-local-search :keyword="keyword" :bounds="bounds" :page-capacity="100" :panel="false" @searchcomplete="searchcomplete"></bm-local-search>
      </baidu-map>
      <swiper :options="swiperOption" ref="mySwiper" class="mySwiper" slot="footer">
        <swiper-slide v-for="(item,i) in menuList" :key="i" >
          <div class="th_property_map_item" @click="click(item.text)">
            <div class="th_property_map_item-img"><th-img-box class="Th_propertyList-item-img" :imgUrl="keyword === item.text?item.img_active:item.img"></th-img-box></div>
            <p class="th_property_map_item-text"> {{item.text}}</p>
          </div>
        </swiper-slide>
      </swiper>-->
    </th-layout>
  </div>
</template>

<script>
import {BmlMarkerClusterer} from 'vue-baidu-map'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
// import {setMapList} from '../../../../common/httpClient.js'
export default {
  name: 'myMap',
  data () {
    return {
      center: {lng: this.$route.query.lng, lat: this.$route.query.lat},
      circlePath: {
        center: {
          lng: this.$route.query.lng,
          lat: this.$route.query.lat
        },
        radius: 1
      },
      show: false,
      bs: null,
      zoom: 15,
      map: null,
      BMap: null,
      keyword: '',
      swiperOption: {
        slidesPerView: 'auto',
        on: {
          slideChangeTransitionEnd: () => {
            this.$emit('getActiveIndex', this.$refs.mySwiper.swiper.activeIndex)
          }
        }
      }
    }
  },
  computed: {
    location () {
      return this.$store.state.locate.location
    }
  },
  created () {
  },
  watch: {
    points: {
      handler (val) {
        console.log(val)
      },
      deep: true
    },
    select: {
      handler (val) {
        this.setMapList(2)
      },
      deep: true
    }
  },
  components: {
    BmlMarkerClusterer,
    swiper,
    swiperSlide
  },
  methods: {
    handler ({BMap, map}) {
      this.BMap = BMap
      this.map = map
      this.bs = this.map.getBounds() // 获取可视区域
      this.geolocation = new BMap.Geolocation()
      this.freshLocate()
    },
    freshLocate () {
      let self = this
      this.geolocation.enableSDKLocation()
      this.geolocation.getCurrentPosition(function (r) {
        self.$store.commit('locate/setLocation', Object.assign({}, this.location, {
          cityId: self.location.cityId,
          province: r.address.province,
          city: r.address.city,
          district: r.address.district,
          street: r.address.street,
          lat: r.point.lat,
          lng: r.point.lng
        }))
      })
    },
    updateCirclePath (e) {
      this.circlePath.center = e.target.getCenter()
      this.circlePath.radius = e.target.getRadius()
      console.log('经度：' + this.circlePath.center.lng, '纬度：' + this.circlePath.center.lat)
    }
    // click (keyword) {
    //   this.keyword = keyword
    // },
    // searchcomplete (results) {
    //   // console.log(results)
    // },
    // zoomend ({type, target}) {
    //   if (this.map) {
    //     this.zoom = this.map.getZoom()
    //     this.active = 0
    //     // if (this.zoom < this.changeZoom) return
    //     // var bs = this.map.getBounds() // 获取可视区域
    //     // var pointA = new this.BMap.Point(bs.He, bs.Vd) // 创建点坐标A宁波市宁海县
    //     // var pointB = new this.BMap.Point(bs.Le, bs.Xd) // 创建点坐标B北京市朝阳区
    //     // this.setMapList(4, this.map.getDistance(pointA, pointB).toFixed(2) / 2)
    //   }
    // },
    // dragend () {
    //   this.center = this.map.getCenter()
    //   this.active = 0
    //   // var bs = this.map.getBounds() // 获取可视区域
    //   // var pointA = new this.BMap.Point(bs.He, bs.Vd) // 创建点坐标A宁波市宁海县
    //   // var pointB = new this.BMap.Point(bs.Le, bs.Xd) // 创建点坐标B北京市朝阳区
    //   // this.setMapList(4, this.map.getDistance(pointA, pointB).toFixed(2) / 2)
    // },
    // locationSuccess ({point, AddressComponent, marker}) {
    //   console.log(point, AddressComponent, marker)
    // },
    // clickHandler (item) {
    //   console.log(item)
    //   if (item.districtId) {
    //     this.$set(this.select, 'districtId', item.districtId)
    //     this.map.centerAndZoom(new this.BMap.Point(item.longitude, item.latitude), 14)
    //     this.center = {lng: item.longitude, lat: item.latitude}
    //     this.zoom = 12
    //     this.setMapList(2)
    //   } else {
    //     this.active = this.active === item.id ? 0 : item.id
    //     this.propertyList = [item]
    //     this.map.centerAndZoom(new this.BMap.Point(item.lng, item.lat), this.zoom)
    //     this.center = new this.BMap.Point(item.lng, item.lat)
    //   }
    // }
    // setMapList (type, distance) {
    //   let data = {}
    //   if (type === 1) { // 获取区域级的楼盘
    //     data = {
    //       'cityId': this.location.selectCityId || this.location.cityId
    //     }
    //   } else if (type === 2) { // 获取搜索楼盘
    //     data = this.select
    //   } else if (type === 3) { // 通过搜索获取楼盘
    //     data = {
    //       'buildingGroupName': this.buildingGroupName
    //     }
    //   } else { // 获取周边楼盘
    //     // let center = this.map.getCenter()
    //     // console.log(this.map.getCenter())
    //     data = {
    //       'distance': Number(distance),
    //       'lat': this.center.lat,
    //       'lng': this.center.lng
    //     }
    //   }
    //   delete data.areaText
    //   delete data.lineText
    //   delete data.moreText
    //   delete data.orderText
    //   // if (!this.distance && data.distance) return
    //   setMapList(data).then((res) => {
    //     if (res && res.code === 1) {
    //       res.content.forEach(item => {
    //         if (item.countNum) { // 区域
    //           this.zoom = 11
    //         } else { // 楼盘
    //           this.zoom = 12
    //         }
    //         if (this.pointIds.indexOf(item.id) < 0) {
    //           this.points.push(item)
    //           item.id && this.pointIds.push(item.id)
    //         }
    //       })
    //       if (res.content[0] && res.content[0].id & this.zoom > this.changeZoom) {
    //         this.toast(`共找到${res.content.length}个楼盘`)
    //       }
    //     }
    //     // return true
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.myMap{
  height: 100%;
  .th_property_map-baidu{
    width: 100%;
    height: 100%;
  }
  .map{
    .map{
      width: 100%;
      height: 100%;
    }
  }
  /deep/ .swiper-slide{
    width: 2.5rem;
    text-align: center;
    font-size: @smallFontSize;
    .th_property_map_item-img{
      width: 1.2rem;
      margin: .3rem auto 0;
    }
  }
}
</style>
