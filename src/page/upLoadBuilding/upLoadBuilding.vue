<template>
  <div class="upLoadBuilding" id="cont">
    <div class="header" :class="isIos? 'none' : ''">
      <span class="btnBack" @click="clickBack"></span>
      <span class="headerTitle">上传楼盘</span>
      <span class="headerSoy"></span>
    </div>
    <div class="main">
      <ul>
        <!-- <li class="list">
          <div class="uppLoderImg">
            <span class="upLoderCon">楼盘首页图</span>
            <img :src="uploadFlag === true ? uploadImgUrl : (uploadImgUrl ? uploadImgUrl : (upLoadBuildingData.logo||bitmap))" alt="" class="upLoader">
          </div>
          <input type="file" id="upFiles" accept="image/*" capture="camera" style="opacity: 0" @change="uploadImg($event)" multiple>
        </li> -->
        <li class="list">
          <span class="upLoderCon">楼盘名称</span>
          <input type="text" @focus="focusReF" @blur="blurReF" class="input" v-model="upLoadBuildingData.name" id="fname" placeholder="请输入楼盘名称">
        </li>
        <li class="list">
          <span class="upLoderCon">总代公司</span>
          <input type="text" @focus="focusReF" @blur="blurReF" class="input" v-model="upLoadBuildingData.developer" placeholder="请输入总代公司信息">
        </li>
        <!-- <li class="list">
          <span class="upLoderCon">总代电话</span>
          <input type="number" @focus="focusReF" @blur="blurReF" class="input" v-model="upLoadBuildingData.developerTel" placeholder="请输入总代公司电话">
        </li> -->
        <li class="list">
          <span class="upLoderCon">所在区域</span>
          <input type="text" class="input" v-model="buildPlace" placeholder="请选择所在区域" readonly>
          <span class="choice" @click="openCityPicker">选择</span>
        </li>
        <li class="list">
          <span class="upLoderCon">楼盘地址</span>
          <input type="text" class="input" v-model="upLoadBuildingData.address" placeholder="请输入楼盘地址">
          <!--<span class="choice" @click="choice(2)">选择</span>-->
        </li>
        <!-- <li class="list">
          <span class="upLoderCon">房&emsp;&emsp;型</span>
          <input type="text" @focus="focusReF" @blur="blurReF" class="input" v-model="upLoadBuildingData.roomType" placeholder="请输入房型信息">
        </li> -->
        <!-- <li class="list">
          <span class="upLoderCon">房型面积</span>
          <input type="number" @focus="focusReF" @blur="blurReF" class="input input1" v-model="upLoadBuildingData.minArea" placeholder="最小房型面积">
          <span class="lianjie">-</span>
          <input type="number" @focus="focusReF" @blur="blurReF" class="input input1" v-model="upLoadBuildingData.maxArea" placeholder="最大房型面积">
        </li> -->
        <!-- <li class="list">
          <span class="upLoderCon">均&emsp;&emsp;价</span>
          <input type="number" @focus="focusReF" @blur="blurReF" class="input" v-model="upLoadBuildingData.price" placeholder="请输入平均价格(元)">
        </li> -->
        <!-- <li class="list">
          <span class="upLoderCon">总&emsp;&emsp;价</span>
          <input type="number" @focus="focusReF" @blur="blurReF" class="input" v-model="upLoadBuildingData.numTotalPrice" placeholder="请输入总价格(万起)">
        </li> -->
        <!-- <li class="list"> -->
          <!-- <span class="upLoderCon">销售状态</span>
          <input type="text" class="input" @click="choiceShowClick" v-model="saleStatus" placeholder="请选择销售状态" readonly> -->
          <!--<span class="choice">选择</span>-->
        <!-- </li> -->
        <!-- <li class="list">
          <span class="upLoderCon">楼盘标签</span>
          <input type="text" @focus="focusReF" @blur="blurReF" class="input" v-model="upLoadBuildingData.tags" placeholder="请输入楼盘标签(多个标签请用“-”分开)" style="width: 13rem;">
        </li> -->
      </ul>
    </div>
    <div class="footer">
      <div class="footerBtn">
        <span class="uploading" @click="uploading">上传</span>
      </div>
    </div>
    <transition enter-active-class="fadeInUpBig" leave-active-class="fadeOutDownBig">
      <div class="buildStatus animated" v-show="choiceShow" @click="choiceShow = !choiceShow">
        <div class="buildStatusRange" @click="stopClick">
          <h4>销售状态</h4>
          <div class="buildStatusSelect">
            <span class="selectionCon" v-for="(item, index) in selectionCon1" v-bind:class="{buildStatusActive:index === buildStatusSpan}" :key="index"  @click="btn(item.status, index, item.content)">
              <i>{{item.content}}</i>
            </span>
          </div>
          <div class="confirmBtn">
            <span @click="cancel">取消</span>
            <span @click="sendStatus">确定</span>
          </div>
        </div>
      </div>
    </transition>
    <th-city-picker
      ref="cityPicker"
      @click="getCityPicker">
    </th-city-picker>
      <transition enter-active-class="zoomIn" leave-active-class="zoomOut">
        <div class="webAlert animated" v-show="alertInfoShow" @click="alertInfoShow = !alertInfoShow">
          <div class="alertInfo" @click="stopClick">
            <h4 class="headerAlert">流程进度提示</h4>
            <div class="main">
              <div class="processCon" v-for="(item, index) in step" :key="index">
                <div class="step" :class="{active: item.stepStatus}"><span>{{item.content}}</span></div>
                <i class="icon" v-if="index<step.length-1"></i>
              </div>
            </div>
            <div class="information">
              <span>基本资料提交成功!请登录后台完善楼盘资料并提交平台审核后台地址: <b>http://md.jrfw360.com</b>上传</span>
            </div>
            <div class="footerBtn" @click="alertShowClick">确定</div>
          </div>
        </div>
      </transition>
      <transition enter-active-class="zoomIn" leave-active-class="zoomOut">
        <div class="alert animated" v-show="alertShow" @click="alertShow = !alertShow">
          <div class="alertclick" @click="stopClick">
            <div class="main1">
              <span>基本资料提交成功!请登录后台完善楼盘资料并提交平台审核后台地址: <b>http://md.jrfw360.com</b>上传</span>
            </div>
            <div class="footerBtn">
              <span @click="comfirmClick">确定</span>
              <i class="icon"></i>
              <span @click="alertShow = false">取消</span>
            </div>
          </div>
        </div>
      </transition>
  </div>
</template>

<script>
import bitmap from '../../assets/Bitmap.png'
import ThCityPicker from './cityPicker/CityPicker.vue'
import OSS from 'ali-oss'
import {setInsert, getSecurityToken} from '../../common/httpClient.js'
/**
 * accountId (integer, optional): 发布人id ,
 address (string, optional): 地址 ,
 cityId (integer, optional): 市 ,
 developer (string, optional): 总代公司 ,
 developerTel (string, optional): 总代电话 ,
 districtId (integer, optional): 区县 ,
 loginToken (string, optional): 发布人loginToken ,
 logo (string, optional): 楼盘图片 ,
 maxArea (number, optional): 最大房型面积 ,
 minArea (number, optional): 最小房型面积 ,
 name (string, optional): 楼盘名称 ,
 numTotalPrice (integer, optional): 总价数字 万起 ,
 price (number, optional): 单价 元 ,
 provinceId (integer, optional): 省 ,
 roomType (string, optional): 房型 ,
 saleStatusId (integer, optional): 销售状态 72在售 73待售 74售罄 默认72 ,
 streetId (integer, optional): 街道/镇 ,
 tags (string, optional): 楼盘标签
 * */
export default {
  name: 'upLoadBuilding',
  data () {
    return {
      isIos: window.jrfw.isIos(),
      alertInfoShow: false,
      alertShow: false,
      step: [
        {
          content: '上传楼盘',
          stepStatus: true,
          step: 1
        },
        {
          content: '登录后台',
          stepStatus: false,
          step: 2
        },
        {
          content: '完善资料',
          stepStatus: false,
          step: 3
        },
        {
          content: '平台审核',
          stepStatus: false,
          step: 4
        },
        {
          content: '楼盘上架',
          stepStatus: false,
          step: 5
        }
      ],
      uploadFlag: false,
      choiceShow: false,
      bitmap: bitmap,
      selectionCon1: [
        {
          content: '在售',
          status: 72
        },
        {
          content: '待售',
          status: 73
        },
        {
          content: '售罄',
          status: 74
        }
      ],
      saleStatus: '在售',
      buildStatusActive: false,
      buildStatusSpan: 0,
      buildPlace: '',
      upLoadBuildingData: {
        accountId: null,
        address: '',
        cityId: null,
        developer: '',
        districtId: null,
        provinceId: null,
        name: '',
        saleStatusId: 72
        // developerTel: '',
        // logo: '',
        // maxArea: null,
        // minArea: null,
        // numTotalPrice: null,
        // price: null,
        // roomType: '',
        // streetId: null,
        // tags: ''
      },
      uploadImgUrl: ''
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    }
  },
  components: {
    ThCityPicker
  },
  created () {
    // sessionStorage.setItem('buildStatusSpan', this.buildStatusSpan)
    this.upLoadBuildingData.accountId = this.$route.query.accountId || this.userInfo.id || null
  },
  activated () {
  },
  methods: {
    focusReF () {
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollIntoView({
          block: 'start',
          behavior: 'auto'
        })
      })
    },
    blurReF () {
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollIntoView({
          block: 'end',
          behavior: 'auto'
        })
      })
    },
    choiceShowClick () {
      this.choiceShow = !this.choiceShow
      this.buildStatusSpan = 0
    },
    stopClick () {
      event.stopPropagation() || event.preventDefault()
    },
    // btn (status, index, content) { // 当点击时候点亮，同级的span标签删除Class .splice(index, 0, item);$(event.currentTarget)
    //   this.buildStatusSpan = index
    //   sessionStorage.setItem('saleStatusId', status)
    //   sessionStorage.setItem('saleStatus', content)
    //   // sessionStorage.setItem('index', index)
    //   sessionStorage.setItem('buildStatusSpan', this.buildStatusSpan)
    // },
    openCityPicker () {
      this.$refs.cityPicker.open()
    },
    getCityPicker (province, city, district, street) {
      this.$set(this.upLoadBuildingData, 'provinceId', province.id)
      this.$set(this.upLoadBuildingData, 'cityId', city.id)
      this.$set(this.upLoadBuildingData, 'districtId', district.id)
      // this.$set(this.upLoadBuildingData, 'streetId', street.id) + '-' + street.name
      this.buildPlace = province.name + '-' + city.name + '-' + district.name
      return this.buildPlace
    },
    cancel () {
      this.choiceShow = false
      this.buildStatusSpan = sessionStorage.getItem('buildStatusSpan') || 0
    },
    sendStatus () {
      this.choiceShow = false
      this.upLoadBuildingData.saleStatusId = sessionStorage.getItem('saleStatusId')
      this.saleStatus = sessionStorage.getItem('saleStatus')
      this.buildStatusSpan = sessionStorage.getItem('buildStatusSpan')
      // sessionStorage.setItem('buildStatusSpan', this.buildStatusSpan)
    },
    clickBack () {
      if (window.jrfw.isApp()) {
        window.jrfw.back()
      } else if (window.jrfw.getIsWxClient()) {
        if (window.history.length > 1) {
          history.back()
        } else {
          window.location.href = 'http://h5.jrfw360.com/home'
        }
      } else {
        history.back()
      }
    },
    uploadImg (event) {
      this.uploadFlag = false
      // console.log(event.target.files)
      let file = event.target.files[0]
      getSecurityToken().then((res) => {
        let creds = res.content
        let client = new OSS({
          region: 'oss-cn-shanghai',
          accessKeyId: creds.accessKeyId,
          accessKeySecret: creds.accessKeySecret,
          stsToken: creds.securityToken,
          bucket: 'jrfw-image'
        })
        let storeAs = 'upload-file' + file.lastModified
        let that = this
        client.multipartUpload(storeAs, file).then(function (res) {
          that.uploadFlag = true
          let url = res.res.requestUrls[0].replace('jrfw-image.oss-cn-shanghai.aliyuncs.com', 'img.jrfw360.com')
          // console.log((url.match(/(\S*)\?/) && url.match(/(\S*)\?/)[1]) || url)
          that.uploadImgUrl = (url.match(/(\S*)\?/) && url.match(/(\S*)\?/)[1]) || url
          that.upLoadBuildingData.logo = that.uploadImgUrl
        })
      })
    },
    uploading () {
      if (!this.upLoadBuildingData.name) {
        this.toast('请输入楼盘名称')
      } else if (!this.upLoadBuildingData.developer) {
        this.toast('总代公司不能为空！')
      } else if (!this.buildPlace) {
        this.toast('请选择楼盘所在区域！')
      } else if (!this.upLoadBuildingData.address) {
        this.toast('请输入楼盘详细地址！')
      } else {
        setInsert(this.upLoadBuildingData).then((res) => {
          if (res && res.code === 0) {
            this.alertInfoShow = true
          } else {
            this.toast(res.msg || '上传失败')
          }
        })
      }
    },
    alertShowClick () {
      this.alertInfoShow = false
      // this.alertShow = true
      window.jrfw.back()
    },
    comfirmClick () {
      window.location.href = 'http://md.jrfw360.com/'
    }
  }
}
</script>

<style lang="less" scoped>
.upLoadBuilding{
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .none{
    display: none;
  }
  & .header{
    width: 100vw;
    height: @headerHeight;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .lineargGradientFgj;
    .btnBack,
    .headerSoy{
      display: block;
      width: @headerHeight;
      height: @headerHeight;
    }
    .btnBack{
      background-image: url("./imgs/back.png");
      background-repeat: no-repeat;
      background-size: 50%;
      background-position: center;
    }
    .headerTitle{
      font-size: @FontSize18;
      line-height: @headerHeight;
      color: @cf;
    }
  }
  & .main{
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    ul{
      width: 100vw;
      .list{
        height: @headerHeight;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid @cD8D8D8;
        margin: 0 .3rem;
        line-height: @headerHeight;
        position: relative;
        padding: 0 .5rem;
        span.upLoderCon{
          font-size: @defaultFontSize;
          color: #333333;
          margin-right: 1rem;
        }
        span.lianjie{
          font-size: @defaultFontSize;
          color: #333333;
          margin: 0 .25rem;
        }
        input{
          border: none;
          outline: none;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          width: 70vw;
          &.input1{
            width: 25vw;
            height: 1.5rem;
            line-height: 1.5rem;
            padding: 0 .5rem;
            border: 1px solid @cD8D8D8;
            border-radius: 5px;
          }
        }
        span.choice{
          position: absolute;
          top: 0;
          right: .5rem;
          font-size: @defaultFontSize;
          color: @cTheme;
        }
        &:hover{
          border-bottom: 1px solid @c31AC48;
          margin: 0 .3rem;
        }
      }
      .list:first-child{
        // height: 5rem;
        justify-content: space-between;
        .uppLoderImg{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100vw;
          line-height: 5rem;
          .upLoader{
            width: 5rem;
            height: 4rem;
            position: relative;
            top: .5rem;
          }
        }
        #upFiles{
          width: 5rem;
          height: 4rem;
          position: absolute;
          top: .5rem;
          right: .5rem;
        }
      }
    }
  }
  .footer{
    padding: 0 .5rem;
    height: @footerHeight;
    border-top: 1px solid @cD8D8D8;
    .footerBtn{
      height: @footerHeight;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      align-content: center;
      .uploading{
        height: 1.5rem;
        display: block;
        font-size: @defaultFontSize;
        line-height: 1.5rem;
        color: @cf;
        padding: 0 1rem ;
        .lineargGradientFgj;
        border-radius: 4px;
      }
    }
  }
  .buildStatus{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, .3);
    .buildStatusRange{
      width: 100vw;
      height: 40vh;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: @cf;
      box-shadow: 0 .5rem 1.5rem .25rem #000000;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h4{
        width: 100vw;
        height: @headerHeight;
        text-align: center;
        line-height: @headerHeight;
        border-bottom: 1px solid @cD8D8D8;
      }
      .buildStatusSelect{
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        .selectionCon{
          flex: 1;
          width: 100vw;
          height: 2rem;
          color: @c9;
          line-height: 2rem;
          font-size: @FontSize16;
          &.buildStatusActive{
            background-color: @cE8E8E8;
          }
        }
      }
      .confirmBtn{
        width: 100vw;
        height: @footerHeight;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-top: 1px solid @cD8D8D8;
        span{
          flex: 1;
          width: 50vw;
          height: 100vh;
          font-size: @FontSize16;
          line-height: @footerHeight;
          text-align: center;
          color: @c9;
          &:nth-child(1){
            border-right: 0.5px solid @cD8D8D8;
          }
          &:nth-child(2){
            border-left: 0.5px solid @cD8D8D8;
          }
        }
      }
    }
  }
  .webAlert{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    background-color: rgba(0, 0, 0, .3);
    .alertInfo{
      width: 15rem;
      height: 20rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 51;
      box-shadow: 1px 1px 1px 1px @c9;
      border-radius: 3px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: rgb(255, 255, 255);
      .headerAlert{
        width: 100%;
        height: 1.9rem;
        font-size: @FontSize16;
        font-weight: normal;
        line-height: 1.9rem;
        text-align: center;
        border-bottom: 1px solid @cD8D8D8;
      }
      .main{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        padding-top: .5rem;
        .processCon{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          .step{
            width: 3.7rem;
            height: 1.2rem;
            text-align: center;
            font-size: @defaultFontSize;
            line-height: 1.2rem;
            color: @c9;
            border: 1px solid @c9;
            border-radius: 4px;
            &.active{
              color: @cf;
              border: 1px solid @cD14E33;
              background-color: @cD14E33;
            }
          }
          .icon{
            display: inline-block;
            width: .1rem;
            height: .6rem;
            background-color: @cD8D8D8;
            margin: .25rem 0;
          }
        }
      }
      .information{
        width: 100%;
        height: calc(4rem - 1px);
        span{
          display: inline-block;
          height: calc(100% - 1rem);
          padding: 0.5rem;
          font-size: @defaultFontSize;
          line-height: 1rem;
          color: @c9;
          b{
            font-weight: normal;
            color: @cTheme;
          }
        }
      }
      .footerBtn{
        width: 100%;
        height: @footerHeight;
        font-size: @FontSize16;
        font-weight: bold;
        line-height: @footerHeight;
        text-align: center;
        color: #31AC48;
        border-top: 1px solid @cD8D8D8;
      }
    }
  }
  .alert{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 52;
    background-color: rgba(0, 0, 0, .3);
    .alertclick{
      width: 12.5rem;
      height: 10rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 53;
      background-color: rgb(255, 255, 255);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .main1{
        width: 100%;
        height: calc(7.75rem - 1px);
        span{
          display: inline-block;
          height: calc(100% - 2rem);
          padding: 1rem;
          font-size: @FontSize18;
          line-height: 1rem;
          color: @c9;
          b{
            font-weight: normal;
            color: @cTheme;
          }
        }
      }
      .footerBtn{
        width: 100%;
        height: 2.25rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        border-top: 1px solid @cD8D8D8;
        span{
          flex-grow: 1;
          display: inline-block;
          width: calc(50% - 1px);
          text-align: center;
          line-height: 2.25rem;
          color: @c9;
        }
        i.icon{
          display: inline-block;
          width: 2px;
          height: 100%;
          background-color: @cD8D8D8;
        }
      }
    }
  }
}
</style>
