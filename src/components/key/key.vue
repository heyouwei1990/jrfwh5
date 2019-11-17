<template>
  <div class='key-container'>
    <!--<div class='key-title'>请输入金额</div>-->
    <div class='input-box'>
      <div class="content">
        {{phone}}
      </div>
      <div class="cursor" :style="{visibility: cursor ? 'visible' : 'hidden'}"></div>
    </div>
    <div class='keyboard' @click.stop='_handleKeyPress'>
      <div class='key-row'>
        <div class='key-cell' data-num='1'>1</div>
        <div class='key-cell' data-num='2'>2</div>
        <div class='key-cell' data-num='3'>3</div>
      </div>
      <div class='key-row'>
        <div class='key-cell' data-num='4'>4</div>
        <div class='key-cell' data-num='5'>5</div>
        <div class='key-cell' data-num='6'>6</div>
        <!--<div class='key-cell' data-num='.'>.</div>-->
      </div>
      <div class='key-row'>
        <div class='key-cell' data-num='7'>7</div>
        <div class='key-cell' data-num='8'>8</div>
        <div class='key-cell' data-num='9'>9</div>
      </div>
      <div class='key-row'>
        <div class='key-cell' data-num='*'>*</div>
        <div class='key-cell' data-num='0'>0</div>
        <div class='key-cell' data-num='D'>C</div>
      </div>
      <div class='key-row key-confirm' data-num='S' @click="confirmClick">确认</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    phoneData: {
      type: Object
    },
    submitData: {
      type: Object
    }
  },
  data () {
    return {
      phone: '',
      cursor: true,
      cursorDuration: 500,
      intervalID: null
    }
  },
  created () {
    this.phone = this.submitData.phone
    this.showCursor()
    this.blinkCursor()
  },
  destroyed () {
    this.hideCursor()
    this.unBlinkCursor()
  },
  methods: {
    // 处理按键
    _handleKeyPress (e) {
      event.stopPropagation() || event.preventDefault()
      let num = e.target.dataset.num
      // 不同按键处理逻辑
      // -1 代表无效按键，直接返回
      // if (num === -1) return false
      switch (String(num)) {
        // 小数点
        case '.':
          this._handleDecimalPoint()
          break
        // 删除键
        case 'D':
          this._handleDeleteKey()
          break
        // 清空键
        case 'C':
          this._handleClearKey()
          break
        // 确认键
        case 'S':
          // this._handleConfirmKey()
          this.confirmClick()
          break
        // 确认键
        case '-1':
          break
        default:
          this._handleNumberKey(num)
          break
      }
    },
    // 处理小数点函数
    _handleDecimalPoint () {
      // 如果包含小数点，直接返回
      if (this.phone.indexOf('.') > -1) return false
      // 如果小数点是第一位，补0
      if (!this.phone.length) {
        this.phone = '0.'
      } else { // 如果不是，添加一个小数点
        this.phone = this.phone + '.'
      }
    },
    // 处理删除键
    _handleDeleteKey () {
      let S = this.phone
      // 如果没有输入，直接返回
      if (!S.length) return false
      // 否则删除最后一个
      this.phone = S.substring(0, S.length - 1)
    },
    // 处理清空键
    _handleClearKey () {
      this.phone = ''
    },
    _handleConfirmKey () {
      let S = this.phone
      // 未输入
      if (!S.length) {
        // alert('您目前未输入!')
        return false
      }
      // 将 8. 这种转换成 8.00
      if (S.indexOf('.') > -1 && S.indexOf('.') === (S.length - 1)) {
        S = Number(S.substring(0, S.length - 1)).toFixed(2)
      }
      // 保留两位
      S = Number(S).toFixed(2)
      this.$emit('confirmEvent', S)
    },
    // 处理数字
    _handleNumberKey (num) {
      let S = this.phone
      if (S.length > 10) return
      this.phone = S + num
    },
    showCursor () {
      this.cursor = true
    },
    hideCursor () {
      this.cursor = false
    },
    unBlinkCursor () {
      clearInterval(this.intervalID)
    },
    blinkCursor () {
      clearInterval(this.intervalID)
      this.intervalID = setInterval(() => {
        this.cursor = !this.cursor
      }, this.cursorDuration)
    },
    confirmClick () {
      if (this.phone.length !== 11 && this.phone.length !== 0) {
        this.toast('请输入11位手机号')
      } else {
        this.$emit('show')
        this.submitData.phone = this.phone
      }
    }
  }
}
</script>

<style lang="less" scoped>
.key-container{
  width: 100vw;
  height: 15rem;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 101;
  .keyboard{
    width: 100vw;
    height: 12rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #D8D8D8;
    .key-row{
      flex: 1;
      /*width: 100%;*/
      height: calc(25% - 1px);
      display: flex;
      flex-direction: row;
      justify-content: center;
      box-shadow: 0 -1px 0 0 #efefef;
      align-content: center;
      align-items: center;
      .key-cell{
        flex: 1;
        /*width: calc(33.33% - 1px);*/
        height: 100%;
        /*border-right: 1px solid #efefef;*/
        box-shadow: 1px 0 0 0 #efefef;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        text-align: center;
        &:nth-last-child(1){
          border-right: none;
        }
      }
    }
  }
  .input-box{
    padding: 10px;
    background-color: #D8D8D8;
    position: relative;
    box-shadow: 0 1px 0 0 #efefef;
    .content{
      width: calc(100% - 10px);
      height: 2rem;
      font-size: 16px;
      line-height: 2rem;
      border: 1px solid #efefef;
      text-align: right;
      padding: 0 5px;
    }
    .cursor {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
      z-index: 10000000000;
      background-color: #4788c5;
      width: 2px;
      height: 1.5rem;
      margin-left: 2px;
    }
  }
}
</style>
