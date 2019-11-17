<template>
  <div class="th_property_report" ref="cont" id="cont" v-if="reloadFresh">
    <th-layout v-if="reloadFresh">
      <div class="th_property_report-cont">
        <!--<mt-field label="phone" placeholder="Input tel" type="tel" v-model="phone"></mt-field>-->
        <div v-if="submitData.firstId">
          <mt-cell
            title="报备楼盘"
            :isLink="!this.$route.query.back"
            @click.native='selectProperty'>
            {{this.$route.query.buildingGroupName || this.selectTextList[0]}}
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
            <div class="title">是否本人跟进带看</div>
            <div class="radioBox">
              <input type="radio" name="firstTakeLook" id="takeLook1" v-model="submitData.firstTakeLook" :value="1" @change="takeLookTrue" ><label for="takeLook1">是</label>
              <input type="radio" name="firstTakeLook" id="nottakeLook1" v-model="submitData.firstTakeLook" :value="0" @change="takeLookTrue"><label for="nottakeLook1">否</label>
            </div>
          </div>
          <div class="tips">
            报备提示：
            {{this.$route.query.housingName || this.$route.query.reportRemark || this.selectPropertyRemarkList[0] || '无'}}
          </div>
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
            <div class="title">是否本人跟进带看</div>
            <div class="radioBox">
              <input type="radio" @change="takeLookTrue"  name="secondTakeLook" id="takeLook2" v-model="submitData.secondTakeLook" :value="1" ><label for="takeLook2">是</label>
              <input type="radio" @change="takeLookTrue" name="secondTakeLook" id="nottakeLook2" v-model="submitData.secondTakeLook" :value="0"><label for="nottakeLook2">否</label>
            </div>
          </div>
          <div class="tips">报备提示：{{selectPropertyRemarkList[1]|| '无'}}</div>
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
            <div class="title">是否本人跟进带看</div>
            <div class="radioBox">
              <input type="radio" @change="takeLookTrue" name="thirdTakeLook" id="takeLook3" v-model="submitData.thirdTakeLook" :value="1"><label for="takeLook3">是</label>
              <input type="radio" @change="takeLookTrue" name="thirdTakeLook" id="nottakeLook3" v-model="submitData.thirdTakeLook" :value="0"><label for="nottakeLook3">否</label>
            </div>
          </div>
          <div class="tips">报备提示：{{selectPropertyRemarkList[2] || '无'}}</div>
        </div>
        <ul class="inputBox">
          <li>
            <div class="title">客户姓名</div>
            <input v-model="submitData.username" @focus="focusReF3" class="username" @blur="blurReF3" placeholder="请输入到访客户姓名"/>
            <div class="radioBox">
              <input type="radio" name="report" id="yes" :value="1" v-model="submitData.sex"><label for="yes">先生</label>
              <input type="radio" name="report" id="no" :value="2" v-model="submitData.sex"><label for="no">女士</label>
            </div>
          </li>
          <li>
            <div class="title">客户电话<span>（{{roleMsg}}）</span></div>
            <!--<div id="inputPhone">
              <input type="number" @focus="focusReF"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" pattern="[0-9]*" class="numPhone" v-model="inputPhone.input1">
              <input type="number" @focus="focusReF"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" pattern="[0-9]*" class="numPhone" v-model="inputPhone.input2">
              <input type="number" @focus="focusReF"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" pattern="[0-9]*" class="numPhone" v-model="inputPhone.input3">
              <input :type="inputType" @focus="focusReF" :pattern="pattern" v-if="showHidePhone2"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" class="numPhone" v-model="inputPhone.input4">
              <input :type="inputType" @focus="focusReF" :pattern="pattern" v-if="showHidePhone2"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" class="numPhone" v-model="inputPhone.input5">
              <input :type="inputType" @focus="focusReF" :pattern="pattern" v-if="showHidePhone2"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" class="numPhone" v-model="inputPhone.input6">
              <input :type="inputType" @focus="focusReF" :pattern="pattern" v-if="showHidePhone2"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" class="numPhone" v-model="inputPhone.input7">
              <input type="number" @focus="focusReF"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" pattern="[0-9]*" class="numPhone" v-model="inputPhone.input8">
              <input type="number" @focus="focusReF"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" pattern="[0-9]*" class="numPhone" v-model="inputPhone.input9">
              <input type="number" @focus="focusReF"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" pattern="[0-9]*" class="numPhone" v-model="inputPhone.input10">
              <input type="number" @focus="focusReF"
                     @blur="blurReF" oninput="if(value.length>1)value=value.slice(0,1)" maxlength="1" pattern="[0-9]*" class="numPhone" v-model="inputPhone.input11">
            </div>-->
            <input type="text" v-if="showHidePhone1" ref="count" class="telephone" @touchend="blurReF" @click="focusReF(1)"
                   v-model="submitData.phone" :placeholder="alertMsg" readonly/>
            <input type="text" v-else @click="focusReF(1)" class="telephone" v-model="phone" :placeholder="alertMsg" readonly/>
            <!--<span class="add" @click="clickTarget1"><span :class="addPhoneNumber === false ? 'decrease' : 'addPhoneNumber'"></span></span>
            <span class="showHidePhone" @click="clickTarget2(submitData.phone)"><img :src="showHidePhone1 === false? hidePhone : showPhone"></span>-->
          </li>
          <li class="noRequire" v-show="!addPhoneNumber">
            <div class="title">备用电话<span>（{{roleMsg}}）</span></div>
            <input type="text" @touchend="blurReF1" @click="focusReF1(2)" v-if="showHidePhone2"
                   v-model="submitData.backPhone" :placeholder="alertMsg" readonly/>
            <input type="text" @click="focusReF1(2)" v-else v-model="backPhone" :placeholder="alertMsg" readonly/>
            <!--<span class="showHidePhone" @click="clickTarget3(submitData.backPhone)"><img :src="showHidePhone2 === false? hidePhone : showPhone"></span>-->
          </li>
          <li>
            <div class="title">到访人数</div>
            <input type="number" v-model="submitData.visitorNum" pattern="[0-9]*" @focus="focusReF3" @blur="blurReF3" placeholder="请输入到访人数"/>
          </li>
        </ul>
        <div class="th_property_report-service">
          <mt-cell
            title="看房服务" :isLink="!this.$route.query.back" :class="{placeholder:!submitData.visitText}" @click.native="goUrl" v-if="this.houseServiceIds && this.houseServiceIds!==null && selectList.length===1">
            <span>{{this.submitData.visitText || '请选择看房服务'}}</span>
          </mt-cell>
          <mt-cell
            title="购房意向" isLink :class="{placeholder:!submitData.content}" @click.native="goIntention">
            <span>{{this.submitData.content || '请选择购房意向'}}</span>
          </mt-cell>
        </div>
        <textarea class="th_property_report-remark" v-model="submitData.remark" @focus="focusReF3" @blur="blurReF3" placeholder="请输入备注" maxlength="100"></textarea>
        <div class="th_property_report-remark-length">{{submitData.remark.length}}/100</div>
      </div>
      <div class="th_property_report-footer" @click="submit" slot="footer">
        <span>确定</span>
      </div>
      <transition enter-active-class="slideInUp" leave-active-class="slideOutDown">
        <div class="model animated" v-show="keyShow" @click="keyShow = false" >
          <th-key :submitData="submitData" @show='show'  @click="eventClick"></th-key>
        </div>
      </transition>
      <th-date-picker
          ref="datePicker"
          @click="getDatePicker">
      </th-date-picker>
    </th-layout>
  </div>
</template>
<script>
import {detailForReport, beforeInsert, setPropertyReport} from '../../../common/httpClient.js'
import ThDatePicker from '../../../components/datePicker/DatePicker.vue'
import ThKey from '../../../components/key/key.vue'
// import phone from '../../../common/phone'
// import showPhone from '../../../assets/open_eyes.png'
// import hidePhone from '../../../assets/close_eyes.png'
export default {
  name: 'propertyReport',
  data () {
    return {
      phoneIsShow: true,
      keyShow: false,
      roleMsg: '',
      alertMsg: '',
      phone: '',
      backPhone: '',
      id: '',
      pattern: '[0-9]*',
      reportRemark: '',
      buildingGroupName: '',
      // showPhone: showPhone,
      // hidePhone: hidePhone,
      reloadFresh: false,
      addUsername: true,
      addPhoneNumber: true,
      // true 全号
      showHidePhone1: true,
      showHidePhone2: true,
      showTakeLook: false,
      houseServiceIds: null,
      inputTypeFlag: true,
      reFresh: true,
      blur: true,
      blurBP: true,
      pickerNum: 1,
      inputType: 'tel',
      selectList: [],
      selectTextList: [],
      selectPropertyRemarkList: [],
      selectPhoneIsShowList: [],
      phoneData: {
        phone: ''
      },
      data: {},
      // inputPhone: {
      //   input1: '',
      //   input2: '',
      //   input3: '',
      //   input4: '',
      //   input5: '',
      //   input6: '',
      //   input7: '',
      //   input8: '',
      //   input9: '',
      //   input10: '',
      //   input11: ''
      // },
      numtrue: 0,
      submitData: {
        'firstId': this.$route.params.id || null,
        'firstVisitTime': '',
        'firstTakeLook': sessionStorage.getItem('firstTakeLook') || '',
        'secondId': null,
        'secondVisitTime': '',
        'secondTakeLook': sessionStorage.getItem('secondTakeLook') || '',
        'thirdId': null,
        'thirdVisitTime': '',
        'thirdTakeLook': sessionStorage.getItem('thirdTakeLook') || '',
        'remark': '', // 备注 onkeyup="value=value.replace(/[^\d]/g,'')"
        'visitorNum': +sessionStorage.getItem('report-visitorNum') || null,
        'phone': sessionStorage.getItem('report-phone') || '',
        'backPhone': sessionStorage.getItem('report-backPhone') || '',
        'username': sessionStorage.getItem('report-username') || '',
        'content': sessionStorage.getItem('report-content') || '', // 购房意向
        'sex': sessionStorage.getItem('report-sex') || 1 // 1：男；2:女,
      }
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
    // inputPhone: {
    //   handler (newVal, oldVal) {
    //     let inputs = $('#inputPhone .numPhone')
    //     for (let i = 0; i < inputs.length; i++) {
    //       inputs[i].index = i
    //       // inputs[i].setAttribute('readonly', true)
    //       inputs[i].onkeyup = function () {
    //         if (inputs[0].value !== '1') {
    //           inputs[0].value = ''
    //         } else if (!(/[3|4|5|6|7|8]/.test(inputs[1].value))) {
    //           inputs[1].value = ''
    //         } else if (!(/[0-9]/.test(inputs[2].value))) {
    //           inputs[2].value = ''
    //         } else if (i >= 3 && i <= 6) {
    //           if (this.inputType === 'text') {
    //             this.pattern = ''
    //             if (!((/[0-9]/.test(inputs[i].value)) || (/^*$/.test(inputs[i].value)))) {
    //               inputs[i].value = ''
    //             }
    //           } else if (this.inputType === 'number') {
    //             this.pattern = '[0-9]*'
    //             if (!(/[0-9]/.test(inputs[i].value))) {
    //               inputs[i].value = ''
    //             }
    //           }
    //         } else if (i > 6 && !(/[0-9]/.test(inputs[i].value))) {
    //           inputs[i].value = ''
    //         } else {
    //         }
    //         if (this.value === '') {
    //           this.value = this.value.slice(0, 1)
    //         } else {
    //           let next = this.index + 1
    //           if (next > inputs.length - 1) return
    //           // inputs[next].removeAttribute('readonly')
    //           inputs[next].focus()
    //         }
    //         let phoneArr = Object.values(newVal)
    //         this.submitData.phone = ''
    //         phoneArr.forEach((item, index) => {
    //           this.submitData.phone += item
    //         })
    //       }
    //     }
    //     // console.log(this.submitData.phone)
    //   },
    //   deep: true
    // },
    submitData: {
      handler (newVal, oldVal) {
        if (this.inputTypeFlag === true && this.selectPhoneIsShowList[0]) {
          if (this.userInfo.type > 3) {
            if ((this.selectList.length === 3 && this.submitData.firstTakeLook === 1 && this.submitData.secondTakeLook === 1 && this.submitData.thirdTakeLook === 1) ||
              (this.selectList.length === 2 && this.submitData.firstTakeLook === 1 && this.submitData.secondTakeLook === 1) ||
              (this.selectList.length === 1 && this.submitData.firstTakeLook === 1)) {
              this.inputType = 'text'
              this.alertMsg = '隐号报备如188****8888'
            } else {
              this.alertMsg = '请全号报备，系统将做隐号处理'
              this.inputType = 'number'
              this.pattern = '[0-9]*'
            }
          } else {
            this.alertMsg = '请全号报备，系统将做隐号处理'
            this.inputType = 'number'
            this.pattern = '[0-9]*'
          }
        } else {
          this.alertMsg = '请全号报备，系统将做隐号处理'
          this.inputType = 'number'
          this.pattern = '[0-9]*'
        }
      },
      deep: true
    },
    blur (newVal, oldVal) {
      if (newVal === true) {
        if (this.selectList && this.numtrue > 0) {
          if ((this.selectList.length === 3 && this.submitData.firstTakeLook === 1 && this.submitData.secondTakeLook === 1 && this.submitData.thirdTakeLook === 1) ||
            (this.selectList.length === 2 && this.submitData.firstTakeLook === 1 && this.submitData.secondTakeLook === 1) ||
            (this.selectList.length === 1 && this.submitData.firstTakeLook === 1)) {
            this.showHidePhone1 = false
          } else {
            this.showHidePhone1 = true
          }
        } else if (this.userInfo.type > 3) {
          if ((this.selectPhoneIsShowList.length === 3 && this.selectPhoneIsShowList[0] === true && this.selectPhoneIsShowList[1] === true && this.selectPhoneIsShowList[2] === true) ||
            (this.selectPhoneIsShowList.length === 2 && this.selectPhoneIsShowList[0] === true && this.selectPhoneIsShowList[1] === true) ||
            (this.selectPhoneIsShowList.length === 1 && this.selectPhoneIsShowList[0] === true)) {
            this.showHidePhone1 = false
          } else {
            this.showHidePhone1 = true
          }
        } else {
          this.showHidePhone1 = true
        }
      }
      this.clickTarget2(this.submitData.phone)
    },
    blurBP (newVal, oldVal) {
      if (this.showHidePhone2 === true && this.submitData.backPhone.length >= 11) {
        this.clickTarget3(this.submitData.backPhone)
      }
    }
  },
  components: {
    ThDatePicker,
    ThKey
  },
  created () {
    this.detailForReport()
    // console.log(this.selectPhoneIsShowList)
    try {
      // 报备数据-看房服务
      let reportData = sessionStorage.getItem('reportData')
      if (reportData) {
        this.submitData = Object.assign(this.submitData, JSON.parse(reportData))
      }
      sessionStorage.setItem('reportData', '')
    } catch (error) {}
    try {
      let selectList = sessionStorage.getItem('selectPropertyList')
      // 楼盘选择-楼盘id
      if (selectList) {
        this.selectList = JSON.parse(selectList)
        this.$set(this.submitData, 'firstId', this.selectList[0])
        this.$set(this.submitData, 'secondId', this.selectList[1])
        this.$set(this.submitData, 'thirdId', this.selectList[2])
      }
    } catch (error) {}
    try {
      // 楼盘选择-楼盘name
      let selectTextList = sessionStorage.getItem('selectPropertyTextList')
      if (selectTextList) {
        this.selectTextList = JSON.parse(selectTextList)
      }
    } catch (error) {}
    try {
      // 楼盘选择-楼盘报备标注
      let selectPropertyRemarkList = sessionStorage.getItem('selectPropertyRemarkList')
      if (selectPropertyRemarkList) {
        this.selectPropertyRemarkList = JSON.parse(selectPropertyRemarkList)
      }
    } catch (error) {}
    try {
      // 楼盘选择-楼盘报备标注
      let selectPhoneIsShowList = sessionStorage.getItem('selectPhoneIsShowList')
      if (selectPhoneIsShowList) {
        this.selectPhoneIsShowList = JSON.parse(selectPhoneIsShowList)
        let flag = true
        this.selectPhoneIsShowList.forEach(item => {
          if (!item) {
            flag = false
          }
        })
        if (flag) {
          this.inputTypeFlag = true
          sessionStorage.setItem('inputTypeFlag', true)
        } else {
          this.inputTypeFlag = false
          sessionStorage.setItem('inputTypeFlag', false)
        }
      }
    } catch (error) {}
    try {
      // 报备数据-意向找房
      let reportCont = sessionStorage.getItem('report-content')
      if (reportCont) {
        this.$set(this.submitData, 'content', sessionStorage.getItem('report-content'))
      }
    } catch (error) {}
    sessionStorage.setItem('selectPropertyList', '')
    sessionStorage.setItem('selectPropertyTextList', '')
    sessionStorage.setItem('selectPropertyRemarkList', '')
    sessionStorage.setItem('selectPhoneIsShowList', '')
    sessionStorage.setItem('report-content', '')
    sessionStorage.setItem('report-phone', '')
    sessionStorage.setItem('report-backPhone', '')
    sessionStorage.setItem('report-username', '')
    sessionStorage.setItem('report-visitorNum', '')
    sessionStorage.setItem('report-sex', '')
    sessionStorage.setItem('firstTakeLook', '')
    sessionStorage.setItem('secondTakeLook', '')
    sessionStorage.setItem('thirdTakeLook', '')
    sessionStorage.setItem('telephone', '')
  },
  mounted () {
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
  methods: {
    reload () {
      this.reloadFresh = false
      this.$nextTick(() => {
        this.reloadFresh = true
      })
    },
    async detailForReport () {
      let data = {
        id: this.$route.params.id
      }
      detailForReport(data).then(res => {
        this.reload()
        if (res && res.code === 1) {
          let cont = res && res.content
          this.phoneIsShow = !cont.phoneIsShow
          if (!cont.phoneIsShow && this.userInfo.type > 3) {
            this.alertMsg = '隐号报备如188****8888'
            this.roleMsg = '此楼盘可隐号报备'
          } else {
            this.alertMsg = '请全号报备，系统将做隐号处理'
            this.roleMsg = '此楼盘要求全号报备'
          }
          // 添加默认的楼盘
          this.houseServiceIds = cont.houseServiceIds
          this.id = cont.id
          this.buildingGroupName = cont.name
          this.reportRemark = cont.reportRemark
          this.$set(this.selectList, 0, this.id + '')
          this.$set(this.selectTextList, 0, this.buildingGroupName)
          this.$set(this.selectPhoneIsShowList, 0, !cont.phoneIsShow)
          this.$set(this.selectPropertyRemarkList, 0, this.reportRemark)
          if (sessionStorage.getItem('inputTypeFlag')) {
            this.inputTypeFlag = JSON.parse(sessionStorage.getItem('inputTypeFlag'))
          } else {
            this.inputTypeFlag = !cont.phoneIsShow
          }
          if (this.inputTypeFlag) {
            this.inputType = 'text'
          } else {
            this.inputType = 'number'
          }
        } else {
          this.toast(res.msg)
        }
      })
    },
    eventClick () {
      event.stopPropagation() || event.preventDefault()
    },
    readonly2 () {
      // this.showHidePhone2 = !this.showHidePhone2
    },
    clickTarget1 () {
      this.addPhoneNumber = !this.addPhoneNumber
    },
    takeLookTrue () {
      this.numtrue++
      let show = true
      if ((this.selectList.length === 3 && (this.submitData.firstTakeLook === 0 || this.submitData.secondTakeLook === 0 || this.submitData.thirdTakeLook === 0)) ||
        (this.selectList.length === 2 && (this.submitData.firstTakeLook === 0 || this.submitData.secondTakeLook === 0)) ||
        (this.selectList.length === 1 && this.submitData.firstTakeLook === 0)) {
        show = false
      }
      if (show) {
        this.showHidePhone1 = false
        // this.showHidePhone2 = false
      } else {
        this.showHidePhone1 = true
        // this.showHidePhone2 = true
      }

      this.clickTarget2(this.submitData.phone)
    },
    clickTarget2 (phone) {
      // this.showHidePhone1 = !this.showHidePhone1
      if (this.showHidePhone1 === false && phone !== '') {
        this.phone = phone.substring(0, 3) + '****' + phone.substring(7)
      } else {
        this.submitData.phone = phone
        if (this.numtrue > 0) {
          this.phone = phone
        }
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
    focusReF (type) {
      this.keyShow = true
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
      sessionStorage.setItem('selectPropertyList', JSON.stringify(this.selectList))
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollIntoView({
          block: 'end',
          behavior: 'auto'
        })
      })
    },
    focusReF1 (type) {
      sessionStorage.setItem('phoneType', type)
      this.phoneData.phone = this.submitData.backPhone
      this.submitData.telephone = this.submitData.backPhone
      sessionStorage.setItem('telephone', this.submitData.backPhone)
      this.keyShow = true
      this.blurBP = false
      // document.body.scrollTop = document.body.scrollHeight
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollIntoView({
          block: 'start',
          behavior: 'auto'
        })
      })
    },
    blurReF1 () {
      this.blurBP = true
      sessionStorage.setItem('selectPropertyList', JSON.stringify(this.selectList))
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollIntoView({
          block: 'end',
          behavior: 'auto'
        })
      })
    },
    focusReF3 () {
      // document.body.scrollTop = document.body.scrollHeight
      this.$nextTick(() => {
        let container = document.getElementById('cont')
        container.scrollIntoView({
          block: 'start',
          behavior: 'auto'
        })
      })
    },
    blurReF3 () {
      sessionStorage.setItem('selectPropertyList', JSON.stringify(this.selectList))
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
        this.$router.push({path: '/propertyServiceDetail/' + this.id,
          query: {
            buildingGroupName: this.buildingGroupName,
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
        this.$router.push({path: `/selectProperty/${this.id}`,
          query: {
            buildingGroupName: this.buildingGroupName,
            reportRemark: this.reportRemark
          }})
      }
    },
    /**
     * 存储本地数据
     */
    setSessionStorage () {
      sessionStorage.setItem('selectPropertyList', JSON.stringify(this.selectList))
      sessionStorage.setItem('selectPropertyTextList', JSON.stringify(this.selectTextList))
      sessionStorage.setItem('selectPropertyRemarkList', JSON.stringify(this.selectPropertyRemarkList))
      sessionStorage.setItem('selectPhoneIsShowList', JSON.stringify(this.selectPhoneIsShowList))
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
      sessionStorage.setItem('insertContent', '')
      // console.log(this.submitData.firstTakeLook)
      if (this.submitData.username === '') {
        this.toast('请输入姓名')
      } else if (this.submitData.phone === '') {
        this.toast('手机号不能为空')
      } else if (!(/^1[345678]\d{9}$/.test(this.submitData.phone)) && this.inputType === 'number') {
        this.toast('此楼盘要求全号报备')
      } else if (!(/^1[345678][0-9]\*{4}\d{4}$/.test(this.submitData.phone) || /^1[345678]\d{9}$/.test(this.submitData.phone)) && this.inputType === 'text') {
        this.toast('主手机号不合规则')
      } else if (this.submitData.backPhone) {
        if (!(/^1[345678]\d{9}$/.test(this.submitData.backPhone)) && this.inputType === 'number') {
          this.toast('此楼盘要求全号报备')
        } else if (!(/^1[345678][0-9]\*{4}\d{4}$/.test(this.submitData.backPhone) || /^1[345678]\d{9}$/.test(this.submitData.backPhone)) && this.inputType === 'text') {
          this.toast('备用手机号不合规则')
        }
      } else if (this.userInfo.type > 3 && (this.submitData.firstTakeLook === '' || this.submitData.firstTakeLook === '' || this.submitData.firstTakeLook === '')) {
        this.toast('还有楼盘没选择是否本人带看跟进，请选择...')
      } else if (this.userInfo.type === 2) {
        this.data = Object.assign({}, this.submitData, {
          'accountId': this.userInfo.id,
          'shareAccountId': this.$route.query.accountId
        })
        delete this.data.visitText
        beforeInsert(this.data).then(res => {
          if (res && res.content) {
            if (res.content.length === 0) {
              setPropertyReport(this.data).then(res => {
                this.reload()
                if (res && res.code === 1) {
                  this.toast(res.msg || '报备成功')
                  setTimeout(() => {
                    if (window.jrfw.isApp()) {
                      window.jrfw.back()
                    } else {
                      history.back()
                    }
                  }, 1000)
                } else {
                  this.toast(res.msg || '报备失败')
                }
              })
            } else {
              this.setSessionStorage()
              sessionStorage.setItem('insertContent', JSON.stringify(res.content))
              this.$router.push({
                path: '/beforeInsert/' + this.$route.params.id,
                query: {
                  accountId: this.$route.query.accountId,
                  data: JSON.stringify(this.data)
                }
              })
            }
          } else {
            this.toast(res.msg)
          }
        })
      } else {
        this.data = Object.assign({}, this.submitData, {
          'accountId': this.userInfo.id
        })
        delete this.data.visitText
        beforeInsert(this.data).then(res => {
          if (res && res.content) {
            if (res.content.length === 0) {
              setPropertyReport(this.data).then(res => {
                this.reload()
                if (res && res.code === 1) {
                  this.toast(res.msg || '报备成功')
                  setTimeout(() => {
                    if (window.jrfw.isApp()) {
                      window.jrfw.back()
                    } else {
                      history.back()
                    }
                  }, 1000)
                } else {
                  this.toast(res.msg)
                }
              })
            } else {
              this.setSessionStorage()
              sessionStorage.setItem('insertContent', JSON.stringify(res.content))
              this.$router.push({
                path: '/beforeInsert/' + this.$route.params.id,
                query: {
                  accountId: this.$route.query.accountId,
                  data: JSON.stringify(this.data)
                }
              })
            }
          } else {
            this.toast(res.msg || '报备失败')
          }
        })
      }
    },
    show () {
      this.keyShow = false
      this.blurReF()
    }
  }
}
</script>
<style lang="less" scoped>
.th_property_report{
 height: 100%;
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
      #inputPhone{
        width: 88.8%;
        height: 1.2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        border: 1px solid #D8D8D8;
        margin-top: 4px;
        .numPhone{
          flex-grow: 1;
          text-align: center;
          border-right: 1px solid #D8D8D8;
          &:nth-last-child(1){
            border: none;
          }
        }
      }
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
           /*height: 100vh;*/
           position: absolute;
           top: 0;
           width: @defaultFontSize;
           height: @defaultFontSize;
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
        width: 100%;
        display: inline-block;
        outline: none;
        height: 1.2rem;
        border: 0;
        font-size: 14px;
        &.telephone,
        &.username{
          font-weight: bold;
        }
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
  .model{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 150;
    background-color: rgba(0, 0, 0, .3);
  }
}
</style>
