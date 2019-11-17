<template>
  <div class="th_property_report" id="cont">
    <th-layout>
      <div class="th_property_report-cont" ref="cont">
        <div >
          <mt-cell
            title="报备楼盘"
            isLink
            @click.native='selectProperty'>
            <span class="color999">{{this.selectTextList[0] || '请选择报备楼盘'}}</span>
          </mt-cell>
          <mt-cell
            :class="{placeholder:!submitData.firstVisitTime}"
            title="预计到访时间"
            isLink
            @click.native="openDatePicker(1)">
            <span v-if="submitData.firstVisitTime">{{submitData.firstVisitTime | formatTime('YMDHMS')}}</span>
            <span v-else>选择预计到访时间</span>
          </mt-cell>
          <div class="firstTakeLook takeLook" v-if="userInfo.type > 3">
            <div class="title">是否带看</div>
            <div class="radioBox">
              <input type="radio" name="firstTakeLook" id="takeLook1" :value="1" v-model="submitData.firstTakeLook"><label for="takeLook1">是</label>
              <input type="radio" name="firstTakeLook" id="nottakeLook1" :value="0" v-model="submitData.firstTakeLook"><label for="nottakeLook1">否</label>
            </div>
          </div>
          <div class="tips">
            报备提示：
            {{$route.query.reportRemark || selectPropertyRemarkList[0] || '无'}}</div>
        </div>
        <div v-if="submitData.secondId">
          <mt-cell
            title="报备楼盘"
            isLink
            @click.native='selectProperty'>
            {{this.selectTextList[1]}}
          </mt-cell>
          <mt-cell
            :class="{placeholder:!submitData.secondVisitTime}"
            title="预计到访时间"
            isLink
            @click.native="openDatePicker(2)">
            <span v-if="submitData.secondVisitTime">{{submitData.secondVisitTime | formatTime('YMDHMS')}}</span>
            <span v-else>选择预计到访时间</span>
          </mt-cell>
          <div class="secondTakeLook takeLook" v-if="userInfo.type > 3">
            <div class="title">是否带看</div>
            <div class="radioBox">
              <input type="radio" name="secondTakeLook" id="takeLook2" :value="1" v-model="submitData.secondTakeLook"><label for="takeLook2">是</label>
              <input type="radio" name="secondTakeLook" id="nottakeLook2" :value="0" v-model="submitData.secondTakeLook"><label for="nottakeLook2">否</label>
            </div>
          </div>
          <div class="tips">报备提示：{{selectPropertyRemarkList[1] || '无'}}</div>
        </div>
        <div v-if="submitData.thirdId">
          <mt-cell
            title="报备楼盘"
            isLink
            @click.native='selectProperty'>
            {{this.selectTextList[2]}}
          </mt-cell>
          <mt-cell
            :class="{placeholder:!submitData.thirdVisitTime}"
            title="预计到访时间"
            isLink
            @click.native="openDatePicker(3)">
            <span v-if="submitData.thirdVisitTime">{{submitData.thirdVisitTime | formatTime('YMDHMS')}}</span>
            <span v-else>选择预计到访时间</span>
          </mt-cell>
          <div class="thirdTakeLook takeLook" v-if="userInfo.type > 3">
            <div class="title">是否带看</div>
            <div class="radioBox">
              <input type="radio" name="thirdTakeLook" id="takeLook3" :value="1" v-model="submitData.thirdTakeLook"><label for="takeLook3">是</label>
              <input type="radio" name="thirdTakeLook" id="nottakeLook3" :value="0" v-model="submitData.thirdTakeLook"><label for="nottakeLook3">否</label>
            </div>
          </div>
          <div class="tips">报备提示：{{selectPropertyRemarkList[2]|| '无'}}</div>
        </div>
        <ul class="inputBox">
          <li>
            <div class="title">客户姓名</div>
            <input v-model="submitData.username" v-if="!$route.query.reportId"  placeholder="请输入到访客户姓名"/>
            <input v-model="submitData.username" v-else  placeholder="请输入到访客户姓名" readonly/>
            <!--<span class="add" @click="choiceShow = !choiceShow"><span class=" addPhoneNumber"></span></span>-->
            <div class="radioBox">
              <input type="radio" name="report" id="yes" :value="1" v-model="submitData.sex"><label for="yes">先生</label>
              <input type="radio" name="report" id="no" :value="2" v-model="submitData.sex"><label for="no">女士</label>
            </div>
          </li>
          <li>
            <div class="title">客户电话<span>（系统将做隐号处理）</span></div>
            <input :type="inputType" @focus="focusReF"  @blur="blurReF" v-if="showHidePhone1 && !$route.query.reportId" oninput="if(value.length>11)value=value.slice(0,11)" maxlength="11" v-model="submitData.phone" placeholder="请输入到客户电话"/>
            <input type="text" v-else @click="readonly1" v-model="phone" placeholder="请输入到客户电话" readonly/>
            <span class="add" @click="clickTarget1"><span :class="addPhoneNumber === false ? 'decrease' : 'addPhoneNumber'"></span></span>
            <span class="showHidePhone" @click="clickTarget2(submitData.phone)"><img :src="showHidePhone1 === false? hidePhone : showPhone"></span>
          </li>
          <li class="noRequire" v-show="!addPhoneNumber">
            <div class="title">备用电话<span>（系统将做隐号处理）</span></div>
            <input :type="inputType" @focus="focusReF" @blur="blurReF" v-if="showHidePhone2 && submitData.backPhone && !$route.query.reportId" oninput="if(value.length>11)value=value.slice(0,11)" maxlength="11" id="backPhone" v-model="submitData.backPhone" placeholder="请输入到客户备用电话"/>
            <input type="text" @click="readonly2" v-else v-model="backPhone" placeholder="请输入到客户备用电话" readonly/>
            <span class="showHidePhone" @click="clickTarget3(submitData.backPhone)"><img :src="showHidePhone2 === false? hidePhone : showPhone"></span>
          </li>
          <li>
            <div class="title">到访人数</div>
            <input type="number" v-model="submitData.visitorNum" @focus="focusReF" @blur="blurReF" placeholder="请输入到访人数"/>
          </li>
        </ul>
        <div class="th_property_report-service">
          <mt-cell
            title="看房服务" :isLink="!this.$route.query.back" :class="{placeholder:!submitData.visitText}" @click.native="goUrl" v-show="selectList.length===1 && selectHouseServiceIds[0] !== ''">
            <span>{{this.submitData.visitText || '请选择看房服务'}}</span>
          </mt-cell>
          <mt-cell
            title="购房意向" isLink :class="{placeholder:!submitData.content}" @click.native="goIntention">
            <span>{{this.submitData.content || '请选择购房意向'}}</span>
          </mt-cell>
        </div>

        <textarea class="th_property_report-remark" @focus="focusReF" @blur="blurReF" v-model="submitData.remark" placeholder="请输入备注" maxlength="100"></textarea>
        <div class="th_property_report-remark-length">{{submitData.remark.length}}/100</div>
      </div>
      <div class="th_property_report-footer" @click="submit" slot="footer">
        <span>确定</span>
      </div>
      <th-date-picker
        ref="datePicker"
        @click="getDatePicker">
      </th-date-picker>
      <!--<transition enter-active-class="fadeInUpBig" leave-active-class="fadeOutDownBig">
        <div class="buildStatus animated" v-show="choiceShow" @click="choiceShow = false">
          <div class="buildStatusRange" @click="stopClick">
            <div class="buildStatusSelect">
              <span class="selectionCon" v-for="(item, index) in selectionCon1" v-bind:class="{buildStatusActive:index === buildStatusSpan}" :key="index"  @click="clickTarget0(item.status, index, item.content)">
                <i>{{item.content}}</i>
              </span>
            </div>
          </div>
        </div>
      </transition>-->
    </th-layout>
  </div>
</template>
<script>
import {setPropertyReport} from '../../common/httpClient.js'
import ThDatePicker from '../../components/datePicker/DatePicker.vue'
import showPhone from '../../assets/open_eyes.png'
import hidePhone from '../../assets/close_eyes.png'
export default {
  name: 'newPropertyReport',
  data () {
    return {
      phone: this.$route.query.phone || '',
      backPhone: this.$route.query.backPhone || '',
      showPhone: showPhone,
      hidePhone: hidePhone,
      addUsername: true,
      addPhoneNumber: true,
      showHidePhone1: true,
      showHidePhone2: true,
      choiceShow: false,
      pickerNum: 1,
      selectionCon1: [
        {
          content: '从手机通讯录导入',
          status: 0
        },
        {
          content: '从房经纪客户列表导入',
          status: 1
        }
      ],
      buildStatusActive: false,
      buildStatusSpan: -1,
      list: [],
      selectList: [],
      selectTextList: [],
      selectPropertyRemarkList: [],
      selectHouseServiceIds: [],
      inputType: '',
      data: {},
      submitData: {
        'firstId': null,
        'firstVisitTime': '',
        'firstTakeLook': sessionStorage.getItem('firstTakeLook') || 1,
        'secondId': null,
        'secondVisitTime': '',
        'secondTakeLook': sessionStorage.getItem('secondTakeLook') || 1,
        'thirdId': null,
        'thirdVisitTime': '',
        'remark': '', // 备注 onkeyup="value=value.replace(/[^\d]/g,'')"
        'visitorNum': +sessionStorage.getItem('report-visitorNum') || null,
        'phone': sessionStorage.getItem('report-phone') || this.$route.query.phone || '',
        'backPhone': sessionStorage.getItem('report-backPhone') || this.$route.query.backPhone || '',
        'username': sessionStorage.getItem('report-username') || this.$route.query.username || '',
        'content': sessionStorage.getItem('report-content') || '', // 购房意向
        'sex': sessionStorage.getItem('report-sex') || 1 // 1：男；2:女
      },
      blur: true
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user
    },
    location () {
      return this.$store.state.locate.location
    }
  },
  watch: {
    'submitData.firstVisitTime' (newValue, oldValue) {
      // console.log(newValue, oldValue)
    },
    submitData: {
      handler (newVal, oldVal) {
        if (newVal.firstTakeLook !== 1 || newVal.thirdTakeLook !== 1 || newVal.secondTakeLook !== 1) {
          this.inputType = 'number'
        } else {
          this.inputType = 'text'
        }
      },
      deep: true
    },
    'submitData.phone' (newVal, oldVal) {
      console.log(newVal)
      let newValArr = newVal.split('')
      console.log(newValArr)
      if (newVal.length === 1 && !(/^1$/.test(newValArr[0]))) {
        this.submitData.phone = ''
      } else if (newVal.length === 2 && !(/[3|4|5|6|7|8]/.test(newValArr[1]))) {
        this.submitData.phone = '1'
      } else if (newVal.length === 3 && !(/\d/.test(newValArr[2]))) {
        newVal.slice(2)
        this.submitData.phone = newVal
      } else if (newVal.length > 3 && newVal.length < 11) {
        if (this.inputType === 'number') {
          if (!(/\d/.test(newValArr[3]))) {
            newVal.slice(3)
            this.submitData.phone = newVal
          } else if (!(/\d/.test(newValArr[4]))) {
            newVal.slice(4)
            this.submitData.phone = newVal
          } else if (!(/\d/.test(newValArr[5]))) {
            newVal.slice(5)
            this.submitData.phone = newVal
          } else if (!(/\d/.test(newValArr[6]))) {
            newVal.slice(6)
            this.submitData.phone = newVal
          }
        } else if (this.inputType === 'text') {
          if (/\d/.test(newValArr[3])) {
            if (!(/\d/.test(newValArr[4]))) {
              newVal.slice(4)
              this.submitData.phone = newVal
            } else if (!(/\d/.test(newValArr[5]))) {
              newVal.slice(5)
              this.submitData.phone = newVal
            } else if (!(/\d/.test(newValArr[6]))) {
              newVal.slice(6)
              this.submitData.phone = newVal
            }
          }
          if (/\*/.test(newValArr[3])) {
            if (!(/\*/.test(newValArr[4]))) {
              newVal.slice(4)
              this.submitData.phone = newVal
            } else if (!(/\*/.test(newValArr[5]))) {
              newVal.slice(5)
              this.submitData.phone = newVal
            } else if (!(/\*/.test(newValArr[6]))) {
              newVal.slice(6)
              this.submitData.phone = newVal
            }
          } else {
            newVal.slice(3)
            this.submitData.phone = newVal
          }
        }
        if (newVal.length > 8) {
          if (!(/\d/.test(newValArr[7]))) {
            newVal.slice(7)
            this.submitData.phone = newVal
          } else if (!(/\d/.test(newValArr[8]))) {
            newVal.slice(8)
            this.submitData.phone = newVal
          } else if (!(/\d/.test(newValArr[9]))) {
            newVal.slice(9)
            this.submitData.phone = newVal
          } else if (!(/\d/.test(newValArr[10]))) {
            newVal.slice(10)
            this.submitData.phone = newVal
          }
        }
      } else {
        newVal.slice(0, 11)
        this.submitData.phone = newVal
      }
    },
    'submitData.backPhone' (newVal, oldVal) {
      let newValArr = newVal.split('')
      // console.log(newValArr)
      if (newVal.length === 1 && !(/^1$/.test(newValArr[0]))) {
        this.submitData.backPhone = ''
      } else if (newVal.length === 2 && !(/[3|4|5|6|7|8]/.test(newValArr[1]))) {
        this.submitData.backPhone = '1'
      } else if (newVal.length === 3 && !(/\d/.test(newValArr[2]))) {
        newVal.slice(2)
        this.submitData.backPhone = newVal
      } else if (newVal.length > 3 && newVal.length < 11) {
        if (this.inputType === 'number') {
          if (!(/\d/.test(newValArr[3]))) {
            newVal.slice(3)
            this.submitData.backPhone = newVal
          } else if (!(/\d/.test(newValArr[4]))) {
            newVal.slice(4)
            this.submitData.backPhone = newVal
          } else if (!(/\d/.test(newValArr[5]))) {
            newVal.slice(5)
            this.submitData.backPhone = newVal
          } else if (!(/\d/.test(newValArr[6]))) {
            newVal.slice(6)
            this.submitData.backPhone = newVal
          }
        } else if (this.inputType === 'text') {
          if (/\d/.test(newValArr[3])) {
            if (!(/\d/.test(newValArr[4]))) {
              newVal.slice(4)
              this.submitData.backPhone = newVal
            } else if (!(/\d/.test(newValArr[5]))) {
              newVal.slice(5)
              this.submitData.backPhone = newVal
            } else if (!(/\d/.test(newValArr[6]))) {
              newVal.slice(6)
              this.submitData.backPhone = newVal
            }
          }
          if (/\*/.test(newValArr[3])) {
            if (!(/\*/.test(newValArr[4]))) {
              newVal.slice(4)
              this.submitData.backPhone = newVal
            } else if (!(/\*/.test(newValArr[5]))) {
              newVal.slice(5)
              this.submitData.backPhone = newVal
            } else if (!(/\*/.test(newValArr[6]))) {
              newVal.slice(6)
              this.submitData.backPhone = newVal
            }
          } else {
            newVal.slice(3)
            this.submitData.backPhone = newVal
          }
        }
        if (newVal.length > 8) {
          if (!(/\d/.test(newValArr[7]))) {
            newVal.slice(7)
            this.submitData.backPhone = newVal
          } else if (!(/\d/.test(newValArr[8]))) {
            newVal.slice(8)
            this.submitData.backPhone = newVal
          } else if (!(/\d/.test(newValArr[9]))) {
            newVal.slice(9)
            this.submitData.backPhone = newVal
          } else if (!(/\d/.test(newValArr[10]))) {
            newVal.slice(10)
            this.submitData.backPhone = newVal
          }
        }
      } else {
        newVal.slice(0, 11)
        this.submitData.backPhone = newVal
      }
    },
    blur (newVal, oldVal) {
      let that = this
      if (newVal === true && this.showHidePhone1 === true && this.submitData.phone.length >= 11) {
        setTimeout(function () {
          that.clickTarget2(that.submitData.phone)
        }, 3000)
      }
      if (newVal === true && this.showHidePhone2 === true && this.submitData.backPhone.length >= 11) {
        setTimeout(function () {
          that.clickTarget3(that.submitData.backPhone)
        }, 3000)
      }
    }
  },
  components: {
    ThDatePicker
  },
  created () {
    if (+this.$route.query.phoneIsShow === 1) {
      this.inputType = 'text'
      // this.toast('')
    } else {
      this.inputType = 'number'
    }
    // 添加默认的楼盘
    try {
      // 报备数据-看房服务
      let reportData = sessionStorage.getItem('reportData')
      reportData && (this.submitData = Object.assign(this.submitData, JSON.parse(reportData)))
      sessionStorage.setItem('reportData', '')
    } catch (error) {}
    try {
      // 楼盘选择-楼盘id
      let selectList = sessionStorage.getItem('newSelectPropertyList')
      if (selectList) {
        this.selectList = JSON.parse(selectList)
        this.$set(this.submitData, 'firstId', this.selectList[0])
        this.$set(this.submitData, 'secondId', this.selectList[1])
        this.$set(this.submitData, 'thirdId', this.selectList[2])
      }
    } catch (error) {}
    try {
      // 楼盘选择-楼盘name
      let selectTextList = sessionStorage.getItem('newSelectPropertyTextList')
      selectTextList && (this.selectTextList = JSON.parse(selectTextList))
    } catch (error) {}
    // console.log(this.selectTextList)
    try {
      // 楼盘选择-看房服务
      let selectHouseServiceIds = sessionStorage.getItem('newSelectHouseServiceIds')
      selectHouseServiceIds && (this.selectHouseServiceIds = JSON.parse(selectHouseServiceIds))
    } catch (error) {}
    try {
      // 楼盘选择-楼盘报备标注
      let selectPropertyRemarkList = sessionStorage.getItem('newSelectPropertyRemarkList')
      selectPropertyRemarkList && (this.selectPropertyRemarkList = JSON.parse(selectPropertyRemarkList))
    } catch (error) {}

    try {
      // 报备数据-意向找房
      let reportCont = sessionStorage.getItem('report-content')
      reportCont && this.$set(this.submitData, 'content', sessionStorage.getItem('report-content'))
    } catch (error) {}
    sessionStorage.setItem('selectHouseServiceIds', '')
    sessionStorage.setItem('selectPropertyList', '')
    sessionStorage.setItem('selectPropertyTextList', '')
    sessionStorage.setItem('selectPropertyRemarkList', '')
    sessionStorage.setItem('report-content', '')
    sessionStorage.setItem('report-phone', '')
    sessionStorage.setItem('report-backPhone', '')
    sessionStorage.setItem('report-username', '')
    sessionStorage.setItem('report-visitorNum', '')
    sessionStorage.setItem('report-sex', '')
    sessionStorage.setItem('firstTakeLook', '')
    sessionStorage.setItem('secondTakeLook', '')
    sessionStorage.setItem('thirdTakeLook', '')
  },
  mounted () {
    let selectList = sessionStorage.getItem('selectPropertyList')
    selectList && (this.selectList = JSON.parse(selectList))
    let selectTextList = sessionStorage.getItem('selectPropertyTextList')
    selectTextList && (this.selectTextList = JSON.parse(selectTextList))
    let selectPropertyRemarkList = sessionStorage.getItem('selectPropertyRemarkList')
    selectPropertyRemarkList && (this.selectPropertyRemarkList = JSON.parse(selectPropertyRemarkList))
    let selectHouseServiceIds = sessionStorage.getItem('selectHouseServiceIds')
    selectHouseServiceIds && (this.selectHouseServiceIds = JSON.parse(selectHouseServiceIds))
    if (sessionStorage.getItem('firstVisitTime')) {
      this.submitData.firstVisitTime = new Date(sessionStorage.getItem('firstVisitTime'))
    }
    if (sessionStorage.getItem('secondVisitTime')) {
      this.submitData.secondVisitTime = new Date(sessionStorage.getItem('secondVisitTime'))
    }
    if (sessionStorage.getItem('thirdVisitTime')) {
      this.submitData.thirdVisitTime = new Date(sessionStorage.getItem('thirdVisitTime'))
    }
  },
  activated () {
  },
  methods: {
    stopClick () {
      event.stopPropagation() || event.preventDefault()
    },
    readonly1 () {
      if (!this.$route.query.reportId) {
        this.showHidePhone1 = !this.showHidePhone1
      }
    },
    readonly2 () {
      this.showHidePhone2 = !this.showHidePhone2
    },
    clickTarget1 () {
      this.addPhoneNumber = !this.addPhoneNumber
    },
    clickTarget2 (phone) {
      this.showHidePhone1 = !this.showHidePhone1
      if (this.showHidePhone1 === false && phone !== '') {
        this.phone = phone.substring(0, 3) + '****' + phone.substring(7)
      } else {
        this.submitData.phone = phone
      }
    },
    clickTarget3 (phone) {
      this.showHidePhone2 = !this.showHidePhone2
      if (this.showHidePhone2 === false && phone !== '') {
        this.backPhone = phone.substring(0, 3) + '****' + phone.substring(7)
      } else {
        this.submitData.backPhone = phone
      }
    },
    focusReF () {
      this.blur = false
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollIntoView({
          block: 'start',
          behavior: 'auto'
        })
      })
    },
    blurReF () {
      this.blur = true
      let that = this
      if (this.showHidePhone1 === true && this.submitData.phone.length >= 11) {
        setTimeout(function () {
          that.clickTarget2(that.submitData.phone)
        }, 3000)
      }
      if (this.showHidePhone2 === true && this.submitData.backPhone.length >= 11) {
        setTimeout(function () {
          that.clickTarget3(that.submitData.backPhone)
        }, 3000)
      }
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollIntoView({
          block: 'end',
          behavior: 'auto'
        })
      })
    },
    openDatePicker (num) {
      this.pickerNum = num
      this.$refs.datePicker.open()
    },
    getDatePicker (time) {
      if (this.pickerNum === 1) {
        this.$set(this.submitData, 'firstVisitTime', time)
        sessionStorage.setItem('firstVisitTime', time)
      } else if (this.pickerNum === 2) {
        this.$set(this.submitData, 'secondVisitTime', time)
        sessionStorage.setItem('secondVisitTime', time)
      } else {
        this.$set(this.submitData, 'thirdVisitTime', time)
        sessionStorage.setItem('thirdVisitTime', time)
      }
    },
    /**
     * 选择看房服务
     */
    goUrl () {
      if (!this.$route.query.back) {
        this.setSessionStorage()
        this.$router.push({path: '/propertyServiceDetail/' + this.submitData.firstId,
          query: {
            buildingGroupName: this.selectTextList[0],
            back: 1
          }})
      }
    },
    /**
     * 选择意向
     */
    goIntention () {
      this.setSessionStorage()
      this.$router.push({path: '/intention?isSelect=1'})
    },
    /**
     * 选择楼盘
     */
    selectProperty () {
      if (!this.$route.query.back) {
        this.setSessionStorage()
        this.$router.push({path: '/newSelectProperty'})
      }
    },
    /**
     * 存储本地数据
     */
    setSessionStorage () {
      sessionStorage.setItem('newSelectPropertyList', JSON.stringify(this.selectList))
      sessionStorage.setItem('newSelectPropertyTextList', JSON.stringify(this.selectTextList))
      sessionStorage.setItem('newSelectPropertyRemarkList', JSON.stringify(this.selectPropertyRemarkList))
      sessionStorage.setItem('newSelectHouseServiceIds', JSON.stringify(this.selectHouseServiceIds))
      sessionStorage.setItem('report-content', this.submitData.firstVisitTime)
      sessionStorage.setItem('report-content', this.submitData.content)
      sessionStorage.setItem('report-phone', this.submitData.phone)
      sessionStorage.setItem('report-backPhone', this.submitData.backPhone)
      sessionStorage.setItem('report-username', this.submitData.username)
      sessionStorage.setItem('report-visitorNum', this.submitData.visitorNum)
      sessionStorage.setItem('report-sex', this.submitData.sex)
      sessionStorage.setItem('reportData', JSON.stringify(this.submitData))
      sessionStorage.setItem('firstTakeLook', this.submitData.firstTakeLook)
      sessionStorage.setItem('secondTakeLook', this.submitData.secondTakeLook)
      sessionStorage.setItem('thirdTakeLook', this.submitData.thirdTakeLook)
    },
    submit () {
      // console.log(this.submitData.firstTakeLook) /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
      if (this.submitData.username === '') {
        this.toast('请输入姓名')
      } else if (this.submitData.phone === '') {
        this.toast('手机号不能为空')
      } else if (!(/^1[345678]\d{9}$/.test(this.submitData.phone)) && this.inputType === 'number') {
        this.toast('主手机号不合法')
      } else if (!(/^1[345678][*{4}|\d{4}]\d{5}$/.test(this.submitData.phone)) && this.inputType === 'text') {
        this.toast('主手机号不合规则')
      } else if (this.submitData.backPhone) {
        if (!(/^1[345678]\d{9}$/.test(this.submitData.backPhone)) && this.inputType === 'number') {
          this.toast('备用手机号不合法')
        } else if (!(/^1[345678][*{4}|\d{4}]\d{5}$/.test(this.submitData.backPhone)) && this.inputType === 'text') {
          this.toast('备用手机号不合规则')
        }
      } else if (this.userInfo.type > 3 && (this.submitData.firstTakeLook === '' || this.submitData.firstTakeLook === '' || this.submitData.firstTakeLook === '')) {
        this.toast('还有楼盘没选择是否本人跟进带看，请选择...')
      } else if (this.$route.query.reportId) {
        this.data = Object.assign({}, this.submitData, {
          'accountId': this.userInfo.id,
          'reportId': this.$route.query.reportId
        })
        delete this.data.visitText
        setPropertyReport(this.data).then(res => {
          if (res && res.content) {
            this.toast(res.msg || '报备成功')
            if (window.jrfw.isApp()) {
              window.jrfw.back()
            } else {
              history.back()
            }
          } else {
            this.toast(res.msg || '报备失败')
          }
        })
      } else {
        this.data = Object.assign({}, this.submitData, {
          'accountId': this.userInfo.id
        })
        delete this.data.visitText
        setPropertyReport(this.data).then(res => {
          if (res && res.content) {
            this.toast(res.msg || '报备成功')
            if (window.jrfw.isApp()) {
              window.jrfw.back()
            } else {
              history.back()
            }
          } else {
            this.toast(res.msg || '报备失败')
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .th_property_report{
    height: 100%;
    .buildStatus{
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      background-color: rgba(0, 0, 0, .4);
      .buildStatusRange{
        width: 100vw;
        height: 5rem;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #eee;
        box-shadow: 0 .5rem 1.5rem .25rem #000000;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .buildStatusSelect{
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          .selectionCon{
            flex: 1;
            width: 100vw;
            height: 2.25rem;
            color: @c3;
            line-height: 2rem;
            font-size: @FontSize16;
            background-color: @cf;
            &:nth-child(1){
              margin-bottom: 0.5rem;
            }
          }
        }
      }
    }
    .th_property_report-cont{
      .takeLook{
        height: 1.5rem;
        padding-left: calc(8px + 1.2rem);
        position: relative;
        .title{
          font-size: @defaultFontSize;
          line-height: 1.5rem;
        }
        .radioBox{
          position: absolute;
          bottom: .1rem;
          right: 0;
          input[type='radio'] {
            display: none;
            -webkit-appearance: none;
            &:checked + label{
              &::before{
                background-color: @cD14E33;
                border-color: @cD14E33;
              }
              &::after{
                transform: rotate(45deg) scale(1);
              }
            }
          }
          label{
            position: relative;
            color: @c9;
            margin-right: 1rem;
            font-size: @FontSize13;
            &::before{
              content: '';
              display: inline-block;
              border-radius: 100%;
              border: 1px solid #ccc;
              vertical-align: middle;
              width: 20px;
              height: 20px;
              position: relative;
              top: -2px;
              margin-right: @plrPage;
            }
            &:after{
              border: 2px solid @cf;
              border-left: 0;
              border-top: 0;
              content: " ";
              top: 2px;
              left: 8px;
              position: absolute;
              width: 4px;
              height: 8px;
              transform: rotate(45deg) scale(0);
              transition: transform .2s, -webkit-transform .2s;
            }
          }
        }
      }
      /deep/ .mint-cell{
        .mint-cell-title{
          min-width: 5rem;
          padding-left: 1.2rem;
          font-size: @defaultFontSize;
        }
        .mint-cell-value{
          font-size: @defaultFontSize;
          height: @defaultFontSize;
          color: @c6;
          .lineClamp(1);
          .color999{
            color: @c9;
          }
        }
        &.placeholder .mint-cell-value{
          color: @c9;
        }
        &:nth-child(odd)::before{
          content: '';
          display: inline-block;
          width: @plrPage;
          height: @plrPage;
          position: absolute;
          top: 50%;
          left: @plrPage;
          transform: translateY(-55%);
          background: url('./imgs/star.png');
          background-size: contain;
        }
      }
      .tips{
        padding: 0 @plrPage;
        color: @cf;
        font-size: @smallFontSize;
        line-height: 1.5rem;
        background:rgba(94,109,228,0.4497);
      }
      .inputBox{
        li{
          padding: @plrPage .5rem;
          padding-left: calc(@plrPage + 1.2rem);
          background-size: 100% 1px;
          background-repeat: no-repeat;
          background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 45%, transparent 50%);
          background-position: bottom;
          position: relative;
          // height: 3rem;
          .title{
            font-size: @smallFontSize;
            span{
              color: @c9;
            }
          }
          .showHidePhone {
            width: 1rem;
            height: 1rem;
            position: absolute;
            top: 1.5rem;
            right: 18px;
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              right: 0;
            }
          }
          .add{
            width: @defaultFontSize;
            height: @defaultFontSize;
            position: absolute;
            top: 0.5rem;
            right: 1rem;
            .addPhoneNumber{
              height: @defaultFontSize;
              position: absolute;
              top: 0;
              width: @defaultFontSize;
              transform: translateX(-50%);
              &:before{
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 3px;
                height: @defaultFontSize;
                background-color: @c9;
              }
              &:after{
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 3px;
                height: @defaultFontSize;
                background-color: @c9;
                transform: rotateZ(90deg);
              }
            }
            .decrease{
              position: absolute;
              top: 0;
              width: @defaultFontSize;
              background-color: @c9;
              transform: translateX(-50%);
              &:before{
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 3px;
                height: @defaultFontSize;
                background-color: @c9;
                transform: rotateZ(90deg);
              }
            }
          }
          input{
            width: 80%;
            display: inline-block;
            outline: none;
            border: 0;
          }
          &:first-child{
            padding-right: 7rem;
          }
          &:last-child{
            background-size: 100% 0px;
          }
          &::before{
            content: '';
            display: inline-block;
            width: @plrPage;
            height: @plrPage;
            position: absolute;
            top: .6rem;
            left: @plrPage;
            background: url('./imgs/star.png');
            background-size: contain;
          }
          &.noRequire:before{
            display: none
          }
        }
        .radioBox{
          position: absolute;
          bottom: @plrPage/2;
          right: 0;
          input[type='radio'] {
            display: none;
            -webkit-appearance: none;
            &:checked + label{
              &::before{
                background-color: @cD14E33;
                border-color: @cD14E33;
              }
              &::after{
                transform: rotate(45deg) scale(1);
              }
            }
          }
          label{
            position: relative;
            color: @c9;
            margin-right: .3rem;
            font-size: @FontSize13;
            &::before{
              content: '';
              display: inline-block;
              border-radius: 100%;
              border: 1px solid #ccc;
              vertical-align: middle;
              width: 20px;
              height: 20px;
              position: relative;
              top: -2px;
              margin-right: @plrPage;
            }
            &:after{
              border: 2px solid @cf;
              border-left: 0;
              border-top: 0;
              content: " ";
              top: 2px;
              left: 8px;
              position: absolute;
              width: 4px;
              height: 8px;
              transform: rotate(45deg) scale(0);
              transition: transform .2s, -webkit-transform .2s;
            }
          }
        }
      }
      .th_property_report-service{
        /deep/ .mint-cell {
          &::before{
            display: none;
          }
          .mint-cell-wrapper{
            // background-size: 120% 0;
            .mint-cell-title{
              padding-left: 0;
            }
          }
        }
      }
      .th_property_report-remark{
        width: 100%;
        height: 6rem;
        display: block;
        padding: 0;
        font-size: .7rem;
        line-height: 1rem;
        word-break: break-all;
        padding: @plrPage;
        box-sizing: border-box;
        color:@c3;
      }
      .th_property_report-remark-length{
        text-align: right;
        font-size: @smallFontSize;
        color: @c9;
        padding-bottom: @plrPage;
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 45%, transparent 50%);
        background-position: bottom;
      }
    }
    .th_property_report-footer{
      width: 100%;
      height: @footerHeight;
      line-height: @footerHeight;
      position: absolute;
      z-index: 10;
      bottom: 0;
      left: 0;
      text-align: center;
      color: @cTheme;
      font-size: @FontSize15;
      font-weight: bolder;
      border-top:1px solid @cD8D8D8;
    }
  }
</style>
