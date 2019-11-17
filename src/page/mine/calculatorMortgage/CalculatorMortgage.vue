<template>
  <div class="th_calculator_mortgage">
    <div :class="isIos? 'none' : 'th_news_detail-share'" @click="share">分享</div>
    <th-layout>
      <div class="th_calculator_mortgage-cont" ref="cont">
        <th-swiper :bannerList="adsList"></th-swiper>
        <mt-navbar v-model="active">
          <mt-tab-item id="commercialLoan">商业贷款</mt-tab-item>
          <mt-tab-item id="providentFundLoan">公积金贷款</mt-tab-item>
          <mt-tab-item id="portfolioLoan">组合贷款</mt-tab-item>
        </mt-navbar>
        <div class="th_calculator_mortgage-info" id="cont">
          <div v-if="active === 'providentFundLoan' || active === 'portfolioLoan'">
            <mt-cell :title="active === 'portfolioLoan'?'公积金贷款金额':'贷款金额'" isLink :class="'money'">
                <input type="number" pattern= '[0-9]*' @focus="focusReF" @blur="blurReF" placeholder="请输入贷款金额" v-model="submitData.loanMoney" :class="active === 'portfolioLoan'? '' : 'inputStar'" />
            </mt-cell>
            <mt-cell :title="active === 'portfolioLoan'?'公积金按揭年数':'按揭年数'" isLink>
                <input type="text" placeholder="请选择按揭年数" v-model="submitData.monthNum" readonly @click="selectMonth(1)"/>
            </mt-cell>
            <mt-cell title="公积金利率" isLink>
              <input type="text" placeholder="请选择公积金利率" v-model="submitData.yearRate" readonly @click="goInterestRate(1)"/>
            </mt-cell>
          </div>
          <div v-if="active === 'commercialLoan' || active === 'portfolioLoan'">
            <mt-cell :title="active === 'portfolioLoan'?'商业贷款金额':'贷款金额'" isLink class="money">
                <input type="number" pattern= '[0-9]*' placeholder="请输入贷款金额" v-model="submitData.loanMoney2" @focus="focusReF" @blur="blurReF" />
            </mt-cell>
            <mt-cell :title="active === 'portfolioLoan'?'商业按揭年数':'按揭年数'" isLink>
                <input type="text" placeholder="请选择按揭年数" v-model="submitData.monthNum2" readonly  @click="selectMonth(2)"/>
            </mt-cell>
            <mt-cell title="商业利率" isLink>
              <input type="text" placeholder="请选择商业利率" v-model="submitData.yearRate2" readonly @click="goInterestRate(2)"/>
            </mt-cell>
          </div>
        </div>
      </div>
    </th-layout>
    <div slot="footer" class="th_calculator_mortgage-footer" @click="submit">
      开始计算
    </div>
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      position="bottom">
      <mt-picker :slots="slots" value-key="title" @change="onValuesChange"></mt-picker>
      <ul class="submit">
        <li @click="selectAns">确定</li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
// setGroupCalculatorMortgage
import {getAdsList} from '../../../common/httpClient.js'
import ThSwiper from '../../../components/swiper/Swiper.vue'
export default {
  data () {
    return {
      adsList: [],
      slots: [
        {
          values: []
        }
      ],
      monthMark: 0,
      popupVisible: false,
      active: sessionStorage.getItem('activeXZ') || 'commercialLoan',
      submitData: {
        'loanMoney': '',
        'loanMoney2': '',
        'monthNum': '',
        'monthNum2': '',
        'yearRate': '',
        'yearRate2': ''
      },
      onValuesChangeFalg: false,
      isIos: window.jrfw.isIos()
    }
  },
  computed: {
    location () {
      return this.$store.state.locate.location
    }
  },
  components: {
    ThSwiper
  },
  created () {
    this.getData()
    this.setMonthList()
    this.setInterestRate()
  },
  mounted () {
    this.submitData.loanMoney = +sessionStorage.getItem('houseTypePrice') || ''
    this.submitData.loanMoney2 = +sessionStorage.getItem('loanMoney2') || ''
    this.submitData.monthNum = +sessionStorage.getItem('monthNum-1') || ''
    this.submitData.monthNum2 = +sessionStorage.getItem('monthNum-2') || ''
    this.setInterestRate()
  },
  methods: {
    share () {
      this.wxShare({
        title: '今日房网-房贷计算器',
        link: 'http://h5.jrfw360.com/calculatorMortgage',
        desc: '神器在手，购房无忧'
      }, true)
    },
    focusReF (type) {
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
    setMonthList () {
      let slotsList = []
      for (let i = 30; i > 0; i--) {
        slotsList.push(i)
      }
      this.$set(this.slots[0], 'values', slotsList)
    },
    setInterestRate () {
      this.$set(this.submitData, 'yearRate', sessionStorage.getItem('interestRate-1'))
      this.$set(this.submitData, 'yearRate2', sessionStorage.getItem('interestRate-2'))
    },
    selectMonth (mark) {
      this.monthMark = mark
      this.popupVisible = true
      if (this.monthMark === 1 && this.submitData.monthNum) {
        this.$set(this.submitData, 'monthNum', this.slots[0].values[0])
      } else if (this.monthMark === 2 && this.submitData.monthNum2) {
        this.$set(this.submitData, 'monthNum2', this.slots[0].values[0])
      }
    },
    goInterestRate (num) {
      sessionStorage.setItem('activeXZ', this.active)
      sessionStorage.setItem('houseTypePrice', this.submitData.loanMoney)
      sessionStorage.setItem('loanMoney2', this.submitData.loanMoney2)
      this.$router.push({path: '/interestRate/' + num})
    },
    onValuesChange (picker, values) {
      if (this.monthMark === 1) {
        this.$set(this.submitData, 'monthNum', values[0])
        sessionStorage.setItem('monthNum-1', this.submitData.monthNum)
        this.onValuesChangeFalg = true
      } else if (this.monthMark === 2) {
        this.$set(this.submitData, 'monthNum2', values[0])
        sessionStorage.setItem('monthNum-2', this.submitData.monthNum2)
        this.onValuesChangeFalg = true
      }
    },
    selectAns () {
      if (!this.onValuesChangeFalg) {
        if (this.monthMark === 1) {
          this.$set(this.submitData, 'monthNum', 30)
          sessionStorage.setItem('monthNum-1', this.submitData.monthNum)
        } else if (this.monthMark === 2) {
          this.$set(this.submitData, 'monthNum2', 30)
          sessionStorage.setItem('monthNum-2', this.submitData.monthNum2)
        }
      }
      this.popupVisible = false
      // this.$emit('click', this.value)
    },
    getData () {
      let data = {
        'adType': 'CAL'
      }
      getAdsList(data).then((res) => {
        this.adsList = res && res.content
        this.wxShare(this.adsList[0])
      })
    },
    submit () {
      if (this.active === 'providentFundLoan') {
        if (this.submitData.loanMoney === '') {
          this.toast('请输入公积金贷款金额')
        } else if (this.submitData.monthNum === '') {
          this.toast('请选择公积金按揭年数')
        } else if (this.submitData.yearRate === '') {
          this.toast('请选择公积金利率')
        } else {
          let data = Object.assign(this.submitData, {
            active: this.active
          })
          this.$router.push({name: 'calculatorResult',
            query: data
          })
        }
      } else if (this.active === 'commercialLoan') {
        if (this.submitData.loanMoney2 === '') {
          this.toast('请输入商业贷款金额')
        } else if (this.submitData.monthNum2 === '') {
          this.toast('请选择商业按揭年数')
        } else if (this.submitData.yearRate2 === '') {
          this.toast('请选择商业利率')
        } else {
          let data = Object.assign(this.submitData, {
            active: this.active
          })
          this.$router.push({name: 'calculatorResult',
            query: data
          })
        }
      } else if (this.active === 'portfolioLoan') {
        if (this.submitData.loanMoney === '' || this.submitData.loanMoney2 === '') {
          this.toast('请输入贷款金额')
        } else if (this.submitData.monthNum === '' || this.submitData.monthNum2 === '') {
          this.toast('请选择按揭年数')
        } else if (this.submitData.yearRate === '') {
          this.toast('请选择公积金利率')
        } else if (this.submitData.yearRate2 === '') {
          this.toast('请选择商业利率')
        } else {
          let data = Object.assign(this.submitData, {
            active: this.active
          })
          this.$router.push({name: 'calculatorResult',
            query: data
          })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.th_calculator_mortgage{
 height: 100%;
  .th_news_detail-share{
    position: absolute;
    top: 0;
    right: .6rem;
    z-index: 100;
    font-size: @FontSize17;
    line-height: @headerHeight;
    color: @cf;
  }
 .th_calculator_mortgage-cont{
   /deep/ .mint-navbar{
      height: @headerHeight;
      overflow: hidden;
      .mint-tab-item{
        padding:0;
        color: @c3;
        position: relative;
        .mint-tab-item-label{
          font-size: @FontSize15;
          height: @headerHeight;
          line-height: @headerHeight;
        }
        &.is-selected{
          color: @cTheme;
          font-weight: bold;
          &:after{
            display: none
          }
        }
      }
    }
  .th_calculator_mortgage-info{
    & /deep/ .mint-cell{
      &::before{
        content: '';
        display: inline-block;
        width: @plrPage;
        height: @plrPage;
        position: absolute;
        top: 1rem;
        left: 4px;
        background: url('./imgs/star.png');
        background-size: contain;
      }
      &.money{
        .mint-cell-allow-right::after{
          content: '万';
          transform:rotate(0);
          border: 0;
          position: static;
        }
      }
      .mint-cell-mask{
        display: none;
      }
      .mint-cell-title{
        min-width: 6.5rem;
        color: @c3;
        flex: 0;
        .mint-cell-text{
          margin-left: .2rem;
        }
      }
      .mint-cell-value{
        min-height: inherit;
        margin: 1px auto;
        flex: 1;
        font-size: @smallFontSize;
        input{
          width: 100%;
          min-height: inherit;
          display: inline-block;
          outline: none;
          border:0;
        }
        &.is-link{
          margin-right: 15px;
        }
      }
      .mint-cell-allow-right::after{
        width: 8px;
        height: 8px;
        border: solid 1px @c9;
        border-bottom-width: 0;
        border-left-width: 0;
        right: 10px;
      }
    }
  }
 }
 .th_calculator_mortgage-footer{
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
  /deep/ .mint-popup{
    width: 100%;
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
  .none{
    display: none;
  }
}
</style>
