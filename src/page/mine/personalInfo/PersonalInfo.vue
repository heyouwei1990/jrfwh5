<template>
  <div class="th_personalInfo">
    <th-layout>
      <div class="th_personalInfo-header" slot="header">
        <th-back-btn></th-back-btn>
        <span>{{$route.meta.title}}</span>
        <div class="th_personalInfo-right" @click="goCertificationInfo">认证信息</div>
      </div>
      <div class="th_personalInfo-cont" ref="cont" @click="this.dateShow=false">
        <div class="th_personalInfo-schedule">
          <div class="th_personalInfo-schedule-bg" ref="bgProgress"></div>
          <div class="th_personalInfo-schedule-text">资料完整度：完成度{{bgProgressWindth}}%</div>
        </div>
        <mt-cell title="头像" class="imgBox" isLink>
          <div class="th_personalInfo-img">
            <th-img-box :imgUrl="uploadFlag === true ? uploadImgUrl : (uploadImgUrl ? uploadImgUrl : (submitData.avatar||baseIcon))"></th-img-box>
            <input type="file" class="fileUp" name='file' id="ossfile" accept="image/*" capture="camera" @change="uploadImg($event)" multiple>
          </div>
        </mt-cell>
        <mt-cell title="昵称">
            <input type="text" placeholder="请输入昵称" v-model="submitData.userName" />
        </mt-cell>
        <mt-cell title="性别" @click.native="openGenderPopup" >
          <input type="text" placeholder="性别选择" :value="submitData.gender === 1?'男':'女'" class="text" readonly/>
          <!--<span class="text"></span>openDatePicker-->
        </mt-cell>
        <mt-cell title="生日" @click.native="clickDateOpen" >
          <span class="text" v-if="submitData.birthDay">{{submitData.birthDay | formatTime('YMD')}}</span>
          <input v-else type="text" placeholder="请输入生日" readonly />
        </mt-cell>
        <mt-cell title="电话" isLink to="/changePhone">
            <input type="text" placeholder="请输入电话" v-model="submitData.phone" readonly/>
        </mt-cell>
        <mt-cell title="祖籍" @click.native="openCityPicker">
          <span class="text">{{birthplace}}</span>
             <!--<input type="text" placeholder="请输入祖籍" v-model="submitData.provinceId" readonly/> -->
        </mt-cell>
      </div>
      <div slot="footer" class="th_personalInfo-footer" @click="submit">
        <span>确认</span>
      </div>
      <!--<div class="dateAnimate">-->
        <transition enter-active-class="fadeInUp" leave-active-class="fadeOutDown">
          <div class="date animated" v-show="dateShow">
            <th-date-picker @clickDateOpen="getDatePicker" @click="getDatePicker"></th-date-picker>
          </div>
        </transition>
      <!--</div>-->
      <!--<th-date-picker-->
          <!--ref="datePicker"-->
          <!--@click="getDatePicker">-->
      <!--</th-date-picker>-->
      <th-city-picker
          ref="cityPicker"
          @click="getCityPicker">
      </th-city-picker>
      <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        position="bottom">
        <mt-picker :slots="slots" value-key="title" @change="onValuesChange"></mt-picker>
        <ul class="submit">
          <li @click="popupVisible=false">确定</li>
        </ul>
      </mt-popup>
    </th-layout>
  </div>
</template>
<script>
// getPutOssAuthUrl,
import {getByAccountId, updateUser, getSecurityToken} from '../../../common/httpClient.js'
import OSS from 'ali-oss'
import ThBackBtn from '../../../components/base/backBtn/BackBtn.vue'
import ThDatePicker from '../../../components/base/calendar/calendar.vue'
// import ThDatePicker from './datePicker/DatePicker.vue'
import ThCityPicker from '../../../components/cityPicker/CityPicker.vue'
export default {
  data () {
    return {
      dateShow: false,
      baseIcon: window.jrfw.baseIcon,
      uploadFlag: false,
      phone: '',
      bgProgressWindth: 0,
      birthplace: '',
      submitData: {
        'avatar': '',
        'userName': '',
        'gender': 1,
        'birthDay': '',
        'phone': '',
        'province': ''
      },
      provinceCity: {
        provinceId: '',
        cityId: ''
      },
      num: 0,
      popupVisible: false,
      slots: [
        {
          values: ['男', '女']
        }
      ],
      uploadData: {},
      uploadImgUrl: ''
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    }
  },
  watch: {
    submitData: {
      handler (val) {
        this.num = 0
        let arr = Object.values(val)
        for (let i in arr) {
          if (arr[i] === '') {
            this.num++
          }
        }
        // console.log(this.num)
        this.bgProgressWindth = ((1 - this.num / Object.keys(val).length) * 100).toFixed(2)
        this.$refs.bgProgress.style.width = this.bgProgressWindth + '%'
      },
      deep: true
    }
  },
  components: {
    ThBackBtn,
    ThDatePicker,
    ThCityPicker
  },
  created () {
    this.setData()
    // this.compatibleInput()
  },
  mounted () {
    // if (sessionStorage.getItem('birthdayTime')) {
    //   this.submitData.birthDay = new Date(sessionStorage.getItem('birthdayTime'))
    // }
    if (sessionStorage.getItem('dayDate')) {
      this.submitData.birthDay = new Date(sessionStorage.getItem('dayDate'))
    }
    // this.getSecurityToken()
  },
  methods: {
    // compatibleInput () {
    //   // 获取浏览器的userAgent,并转化为小写
    //   var ua = navigator.userAgent.toLowerCase()
    //   // 判断是否是苹果手机，是则是true
    //   var isIos = (ua.indexOf('iphone') !== -1) || (ua.indexOf('ipad') !== -1)
    //   if (isIos) {
    //     this.$el.querySelector('#ossfile').removeAttr('capture')
    //   }
    // },
    openGenderPopup () {
      this.popupVisible = true
      // console.log(this.slots[0].values[0])
      // this.$set(this.submitData, 'gender', this.slots[0].values[0] === '女' ? 2 : 1)
    },
    onValuesChange (picker, values) {
      picker.setSlotValue(1, this.submitData.gender ? '女' : '男')
      this.$set(this.submitData, 'gender', values[0] === '女' ? 2 : 1)
    },
    clickDateOpen () {
      this.dateShow = !this.dateShow
    },
    openDatePicker () {
      this.$refs.datePicker.open()
    },
    openCityPicker () {
      this.$refs.cityPicker.open()
    },
    getDatePicker () {
      // console.log(time)
      let date = sessionStorage.getItem('dayDate')
      if (date) {
        this.$set(this.submitData, 'birthDay', new Date(date))
        console.log(this.submitData.birthDay)
      }
      this.dateShow = !this.dateShow
    },
    getCityPicker (province, city, district) {
      this.$set(this.provinceCity, 'provinceId', province.id)
      this.$set(this.provinceCity, 'cityId', city.id)
      this.birthplace = province.name + city.name
      return this.birthplace
    },
    setData () {
      let data = {
        'accountId': this.userInfo.id,
        'loginToken': this.userInfo.loginToken
      }
      getByAccountId(data).then((res) => {
        if (res && res.code === 1) {
          let userInfo = res.content.account
          this.phone = userInfo.hiddenPhone
          let province = userInfo.yyUser.province && userInfo.yyUser.province.name
          let city = userInfo.yyUser.city && userInfo.yyUser.city.name
          this.birthplace = province + city || ''
          this.submitData = Object.assign(this.submitData, {
            'avatar': userInfo.yyUser.avatar || '',
            'userName': userInfo.yyUser.userName || '',
            'gender': userInfo.yyUser.gender || 1,
            'birthDay': userInfo.yyUser.birthDay || '',
            'phone': this.phone || '',
            'province': this.birthplace || ''
          })
          // let num01 = Object.keys(this.submitData).length
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    },
    goCertificationInfo () {
      this.appDownLoad()
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
          // console.log(res)
          that.uploadFlag = true
          let url = res.res.requestUrls[0].replace('jrfw-image.oss-cn-shanghai.aliyuncs.com', 'img.jrfw360.com')
          console.log((url.match(/(\S*)\?/) && url.match(/(\S*)\?/)[1]) || url)
          that.uploadImgUrl = (url.match(/(\S*)\?/) && url.match(/(\S*)\?/)[1]) || url
          that.submitData.avatar = that.uploadImgUrl
        })
      })
    },
    appDownLoad () {
      if (this.roles === 5 || this.type >= 9) {
        if (navigator.userAgent.match(/Android/i)) {
          location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.steward'
        } else if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
          location.href = 'https://itunes.apple.com/cn/app/%E8%84%89%E6%A5%BC/id1457937506?mt=8'
        }
      } else if (this.type > 3 && this.type < 9) {
        if (navigator.userAgent.match(/Android/i)) {
          location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.broker'
        } else if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
          location.href = 'https://itunes.apple.com/cn/app/%E6%88%BF%E7%BB%8F%E7%BA%AA/id1456333516?mt=8'
        }
      } else {
        if (navigator.userAgent.match(/Android/i)) {
          location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.housing.network.app'
        } else if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
          location.href = 'https://itunes.apple.com/cn/app/%E4%BB%8A%E6%97%A5%E6%88%BF%E7%BD%91/id1457181046?mt=8'
        }
      }
    },
    submit () {
      let data = {
        'accountId': this.userInfo.id,
        'loginToken': this.userInfo.loginToken,
        'avatar': this.submitData.avatar || '',
        'userName': this.submitData.userName || '',
        'gender': this.submitData.gender || 1,
        'birthDay': this.submitData.birthDay || '',
        ...this.provinceCity
      }
      updateUser(data).then((res) => {
        if (res && res.code === 1) {
          this.$router.go(-1)
          this.toast(res.msg || '更新提交成功')
        } else {
          this.toast(res.msg || '加载失败')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.th_personalInfo{
  position: relative;
  .th_personalInfo-header{
    width: 100%;
    height: 100%;
    line-height: @headerHeight;
    text-align: center;
    font-size: @FontSize17;
    color: @cf;
    .th_personalInfo-right{
      width: 4rem;
      position: absolute;
      top: 0;
      right: .4rem;
      font-size: @defaultFontSize;
    }
  }
  .th_personalInfo-cont{
    .th_personalInfo-schedule{
      height: 1rem;
      background-color: @ce;
      margin: .5rem @plrPage;
      position: relative;
      .th_personalInfo-schedule-bg{
        /*width: 50%;*/
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: @cFCCD50;
      }
      .th_personalInfo-schedule-text{
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: @smallFontSize;
      }
    }
    & /deep/ .mint-cell{
        &.imgBox{
          min-height: 3rem;
          .mint-cell-value{
            justify-content: flex-end;
          }
        }
        min-height: 1.8rem;
        .text{
          color: @c3;
        }
        .mint-cell-title{
          min-width: 4rem;
          color: @c3;
          flex: 0;
          .mint-cell-text{
            margin-left: .2rem;
          }
        }
        .mint-cell-mask{
          display: none;
        }
        .mint-cell-value{
          min-height: inherit;
          margin: 1px auto;
          flex: 1;
          font-size: @smallFontSize;
          .th_personalInfo-img{
            width: 2.25rem;
            position: relative;
            right: 15%;
            top: 0;
            .fileUp{
              width: 200%;
              height: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-25%, -50%);
              opacity: 0;
            }
          }
          input{
            width: 100%;
            min-height: inherit;
            display: inline-block;
            outline: none;
            border:0;
          }
          .code{
            width: 100%;
            display: flex;
            input{
              flex: 1;
              min-height: inherit;
              display: inline-block;
              outline: none;
              border:0;
            }
            span{
              line-height: 1.8rem;
              font-size: @FontSize13;
              color: @cTheme;
            }
          }
        }
      }
  }
  .th_personalInfo-footer{
    width: 100%;
    height: @footerHeight;
    line-height: @footerHeight;
    position: absolute;
    z-index: 10;
    bottom: 0;
    left: 0;
    text-align: right;
    color: @cTheme;
    border-top:1px solid @cD8D8D8;
    span{
      width: 3.75rem;
      height: 1.4rem;
      line-height: 1.4rem;
      text-align: center;
      display: inline-block;
      font-size:@FontSize13;
      background-color: @cTheme;
      border-radius: @borderRadius;
      color: @cf;
      font-weight: bold;
      margin-right: .6rem;
    }
  }
   /deep/ .mint-popup{
    width: 100%;
    height: auto !important;
    .picker-center-highlight{
      background-color: @cDBE0FF;
      z-index: -1;
    }
    .submit{
      display: flex;
      text-align: center;
      font-size: @FontSize15;
      line-height: 1.875rem;
      li{
        flex: 1;
        .lineargGradient();
        color: @cf;
      }
    }
  }
  .date{
    width: 247px;
    height: 239px !important;
    position: absolute;
    top: 216px;
    left: 0;
    z-index: 100;
    margin-left: 17%;
    background-color: @cf;
    border-radius: 5px;
  }
}
</style>
