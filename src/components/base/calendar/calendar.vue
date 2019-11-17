<template>
  <div id="calendar">
    <!-- 年份 月份 -->
    <div class="month">
      <ul>
        <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
        <li class="arrow" @click="pickYearPre(currentYear,currentMonth)">❮❮</li>
        <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
        <li class="year-month">
          <span class="choose-year" @click="pickYear">{{currentYear}}</span>
          <span class="choose-month">{{currentMonth}}月</span>
        </li>
        <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
        <li class="arrow" @click="pickYearNext(currentYear,currentMonth)">❯❯</li>
      </ul>
    </div>
    <!-- 星期 -->
    <ul class="weekdays" v-if="!yearsSelect">
      <li>一</li>
      <li>二</li>
      <li>三</li>
      <li>四</li>
      <li>五</li>
      <li style="color:red">六</li>
      <li style="color:red">日</li>
    </ul>
    <!-- 日期 -->
    <ul class="years" v-if="yearsSelect">
      <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
      <li v-for="(year, i) in years" :key="i">
        {{year}}
      </li>
    </ul>
    <!-- 日期 -->
    <ul class="days" v-if="!yearsSelect">
      <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
      <li v-for="(dayobject, i) in days" :key="i">
        <!--本月-->
        <!--如果不是本月  改变类名加灰色-->
        <span v-if="dayobject.day.getMonth()+1 !== currentMonth" class="other-month" @click="currentDaySelect1(currentYear,currentMonth,dayobject.day.getDate(), $event)">{{dayobject.day.getDate()}}</span>
        <!--如果是本月  还需要判断是不是这一天-->
        <span v-else>
          <!--今天  同年同月同日-->
          <span v-if="dayobject.day.getFullYear() === new Date().getFullYear() && dayobject.day.getMonth() === new Date().getMonth() && dayobject.day.getDate() === new Date().getDate()"
                class="active" @click="currentDaySelect2(currentYear,currentMonth,dayobject.day.getDate(), $event)">{{dayobject.day.getDate()}}</span>
          <span v-else @click="currentDaySelect2(currentYear,currentMonth,dayobject.day.getDate(), $event)">{{dayobject.day.getDate()}}</span>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      yearsSelect: false,
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1900,
      currentWeek: 1,
      days: [],
      years: [],
      dateText: '',
      dateDay: ''
    }
  },
  watch: {
  },
  created () {
    // this.selectDate()
    this.initData(null)
  },
  methods: {
    initData (cur) {
      let that = this
      // let leftcount = 0 // 存放剩余数量
      let date
      if (cur) {
        date = new Date(cur)
      } else {
        let now = new Date()
        let d = new Date(that.formatDate(now.getFullYear(), now.getMonth(), 1))
        d.setDate(35)
        date = new Date(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      }
      that.currentDay = date.getDate()
      that.currentYear = date.getFullYear()
      that.currentMonth = date.getMonth() + 1
      that.currentWeek = date.getDay() // 1...6,0
      if (that.currentWeek === 0) {
        that.currentWeek = 7
      }
      let str = that.formatDate(that.currentYear, that.currentMonth, that.currentDay)
      that.days.length = 0
      // 今天是周日，放在第一行第7个位置，前面6个
      // 初始化本周
      for (let i = that.currentWeek - 1; i >= 0; i--) {
        let d = new Date(str)
        d.setDate(d.getDate() - i)
        let dayobject = {} // 用一个对象包装Date对象  以便为以后预定功能添加属性
        dayobject.day = d
        that.days.push(dayobject) // 将日期放入data 中的days数组 供页面渲染使用
      }
      // 其他周
      for (let i = 1; i <= 35 - that.currentWeek; i++) {
        let d = new Date(str)
        d.setDate(d.getDate() + i)
        let dayobject = {}
        dayobject.day = d
        that.days.push(dayobject)
      }
    },
    selectDate () {
      let date = new Date()
      // let dateTime = date.getTime()
      this.dateDay = date.getDate()
      // console.log(this.dateDay)
      return this.dateDay
    },
    currentDaySelect1 (year, month, day, event) {
      if (day >= 4) {
        // console.log(event.target)
        // this.pickPre(year, month)
        this.dateText = year + '-' + (month - 1) + '-' + day
      } else {
        // this.pickNext(year, month)
        this.dateText = year + '-' + (month + 1) + '-' + day
      }
      sessionStorage.setItem('dayDate', this.dateText)
      this.$emit('clickDateOpen')
      // console.log(this.dateText)
    },
    currentDaySelect2 (year, month, day, event) {
      // console.log(event.target)
      this.dateText = year + '-' + month + '-' + day
      sessionStorage.setItem('dayDate', this.dateText)
      this.$emit('clickDateOpen')
      // console.log(this.dateText)
    },
    pickPre (year, month) {
      let that = this
      // setDate(0); 上月最后一天
      // setDate(-1); 上月倒数第二天
      // setDate(dx) 参数dx为 上月最后一天的前后dx天
      let d = new Date(that.formatDate(year, month, 1))
      d.setDate(0)
      that.initData(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
    },
    pickYearPre (year, month) {
      let that = this
      // setDate(0); 上年最后一天
      // setDate(-1); 上年倒数第二天
      // setDate(dx) 参数dx为 上年最后一天的前后dx天
      let d = new Date(that.formatDate(year - 1, month, 1))
      d.setDate(0)
      that.initData(that.formatDate(d.getFullYear(), d.getMonth() + 2, 1))
    },
    pickNext (year, month) {
      let that = this
      let d = new Date(that.formatDate(year, month, 1))
      d.setDate(35)
      that.initData(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
    },
    pickYearNext (year, month) {
      let that = this
      let d = new Date(that.formatDate(year + 1, month, 1))
      d.setDate(35)
      that.initData(that.formatDate(d.getFullYear(), d.getMonth(), 1))
    },
    pickYear () {
      // this.yearsSelect = true
      // this.years = []
      let date = new Date()
      // let dateTime = date.getTime()
      let nowYear = date.getFullYear()
      let yearsLength = nowYear - 1900
      for (let y = 0; y < yearsLength; y++) {
        this.years.push(1900 + y)
      }
      // alert(year + ',' + month)
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate (year, month, day) {
      let y = year
      let m = month
      if (m < 10) m = '0' + m
      let d = day
      if (d < 10) d = '0' + d
      return y + '-' + m + '-' + d
    }
  }
}
</script>
<style lang="less" scoped>
  #calendar {
    width: 245px;
    height: 237px;
    border: 1px solid #d8d8d8;
    border-radius: 5px;
    overflow: hidden;
  }

  .month {
    height: 30px;
    border: 1px solid #FFFFFF;
    margin: 0 10px;
  }

  .month ul {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .month ul li{
    height: 100%;
    line-height: 30px;
  }

  .year-month {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  .choose-year {
    padding: 0 10px;
    font-size: 16px;
    font-weight: 200;
  }

  .choose-month {
    text-align: center;
    font-size: 16px;
    font-weight: 200;
  }
  .arrow {
    /*height: 100%;*/
    /*line-height: 30px;*/
  }

  .arrow1 {
    background: url(../../../assets/left.png) no-repeat 0 0 /100% 100%;
    margin-left: 44px;
  }

  .arrow2 {
    background: url(../../../assets/right.png) no-repeat 0 0 /100% 100%;
    margin-right: 44px;
  }

  .month ul li {
    color: #999;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: -1px;
    list-style: none;
  }
  .weekdays {
    margin: 0;
    color: #FFFFFF;
    background: #A4A7B0;
    height: 30px;
    line-height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .weekdays li {
    flex: 1;
    text-align: center;
    color: #101526;
    font-size: 14px;
    font-weight: 100;
  }

  .days {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }

  .days li {
    text-align: center;
    /*padding: 5px 0;*/
    font-size: 12px;
    color: #3847D3;
    font-weight: 200;
    width: calc(100% / 7 - .5rem);
    margin: .25rem;
  }
  .days li span,
  .days li span span {
    height: 25px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
  .days li span:hover,
  .days li span span:hover {
    background-color: #A4A7B0;
  }
  .active{
    background-color: #ff7900;
  }
  .days li .other-month {
    color: #101526;
  }
  .days li .class-30 {
    // background: url(bg_30.png) no-repeat 0 0 /100% 100%;
  }

  .days li .class-60 {
    // background: url(bg_60.png) no-repeat 0 0 /100% 100%;
  }

  .days li .class-3060 {
    // background: url(bg_3060.png) no-repeat 0 0 /100% 100%;
  }
  .years{
    width: 100%;
    height: 215px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    li{
      font-size: 14px;
    }
  }
</style>
