// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import phone from './common/phone.js'
import util from './common/util.js'
import BaiduMap from 'vue-baidu-map'
import {config, share} from './common/wx_sdk.js'
// import VConsole from 'vconsole'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import './common/WebViewJavascriptBridge.js' // 与app交互
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import {
  Indicator,
  Swipe,
  SwipeItem,
  Tabbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  Cell,
  Header,
  Button,
  Checklist,
  Radio,
  Navbar,
  Toast,
  Picker,
  IndexList,
  IndexSection,
  Popup,
  DatetimePicker,
  // Loadmore,
  InfiniteScroll,
  MessageBox
  // Spinner
} from 'mint-ui'

// 引入animate.css
import '../static/css/animate.css'
window.jrfw = {...phone, ...util}
window.jrfw.baseIcon = 'http://web.jrfw360.com/recourse/img/108x108.png'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '0iHcMzD3HRWeh2aHmVV0hbGZlWvr8och'
})
// let vConsole = new VConsole() // 初始化
// console.log(vConsole)
// 按需引入部分组件
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Cell.name, Cell)
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Checklist.name, Checklist)
Vue.component(Radio.name, Radio)
Vue.component(Navbar.name, Navbar)
Vue.component(Picker.name, Picker)
Vue.component(IndexList.name, IndexList)
Vue.component(IndexSection.name, IndexSection)
Vue.component(Popup.name, Popup)
Vue.component(DatetimePicker.name, DatetimePicker)
// Vue.component(Loadmore.name, Loadmore)
// Vue.component(Spinner.name, Spinner)
Vue.use(InfiniteScroll)
Vue.use(VueAwesomeSwiper)

Vue.use(Viewer)
Viewer.setDefaults({
  'inline': false,
  'button': true, // 右上角按钮
  'navbar': false, // 底部缩略图
  'title': false, // 当前图片标题
  'toolbar': false, // 底部工具栏
  'tooltip': true, //  显示缩放百分比
  'movable': true, // 是否可以移动
  'zoomable': true, // 是否可以缩放
  'rotatable': true, // 是否可旋转
  'scalable': true, // 是否可翻转
  'maxZoomRatio': 1, // 最大缩放比例
  'transition': false, // 使用 CSS3 过度
  'fullscreen': true, // 播放时是否全屏
  'keyboard': true, // 是否支持键盘
  'minZoomRatio': 0.5, // 最小缩放比例
  'url': 'data-source'
})
// console.log(router)
Vue.prototype.toast = function (msg) {
  if (router.history.current.name === 'chatList' || router.history.current.name === 'channel') {
    Toast({
      message: msg,
      // position: 'middle',
      duration: 3000
    })
  } else {
    Toast({
      message: msg,
      // position: 'middle',
      duration: 1000
    })
  }
}

Vue.prototype.messageBox = MessageBox
// console.log(router)
Vue.prototype.indicatorOpen = function () {
  if (!(/^chat$/.test(router.history.current.name)) && !(/^distributor$/.test(router.history.current.name)) && !(/^newInfo$/.test(router.history.current.name))) {
    Indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
      // 'snake'
      // 'fading-circle'
      // 'double-bounce'
      // 'triple-bounce'
    })
  }
}
Vue.prototype.indicatorClose = function () {
  Indicator.close()
}
Vue.prototype.call = function (tel) {
  window.location.href = `tel:${tel}`
}
// 关闭eslint
/* eslint-disable*/
// Vue.prototype.resetSetItem = (key, newVal) => {
//   if (key === 'websocketHistory') {
//     let newStorageEvent = document.createEvent('StorageEvent')
//     const storage = {
//       setItem: (k, val) => {
//         localStorage.setItem(k, val)
//         newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)
//         window.dispatchEvent(newStorageEvent)
//       }
//     }
//     return storage.setItem(key, newVal)
//   }
// }
// this.resetSetItem('websocketHistory', data)
// // 然后在需要监听的页面中，created函数中使用
// window.addEventListener('setItem', () => {
//   console.log(JSON.parse(localStorage.getItem('websocketHistory')))
// })
/* eslint-enable */
function _dealWxShareData (data) {
  let newData = {
    title: data.title || document.title,
    imgUrl: data.imgUrl || data.imageUrl || window.jrfw.baseIcon,
    link: data.link || data.url || location.href,
    desc: data.desc || data.description || '买房、卖房，今日房网帮你忙；房产购销一站式服务平台',
    backFlag: false
  }
  return newData
}
Vue.prototype.wxShare = function (data, mask = false) {
  if (mask) {
    if (window.jrfw.getIsWxClient()) {
      document.getElementById('shareImg').style = 'display:block'
    } else if (window.jrfw.isApp()) {
      window.jrfw.setShare(_dealWxShareData(data))
    } else {
      Toast({
        message: '请在微信环境或者app打开',
        position: 'bottom',
        duration: 10000
      })
      return
    }
  }
  config(function (mask) {
    share(_dealWxShareData(data))
    // document.getElementById('shareImg').style = 'display:none'
  })
}
Vue.prototype.openApp = function (url) {
  Toast({
    message: '跳转app',
    position: 'bottom',
    duration: 5000
  })
  // window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.zl.date'
}
// 实现vue中的过滤器功能  先定义过滤器 在使用        value是过滤器前面的值，type是过滤器中定义的字段
Vue.filter('formatTime', function (value, type) {
  // console.log(value)
  var dataTime = ''
  if (value) {
    var data = new Date()
    data.setTime(value)
    var year = data.getFullYear()
    var month = addZero(data.getMonth() + 1)
    var day = addZero(data.getDate())
    var hour = addZero(data.getHours())
    var minute = addZero(data.getMinutes())
    var second = addZero(data.getSeconds())
    if (type === 'YMD_') {
      dataTime = year + '年' + month + '月' + day + '日'
    } else if (type === 'YMD.') {
      dataTime = year + '.' + month + '.' + day
    } else if (type === 'YMDHM.') {
      dataTime = year + '.' + month + '.' + day + ' ' + hour + ':' + minute
    } else if (type === 'YMDHMS_') {
      dataTime = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second
    } else if (type === 'YMDHMS') {
      dataTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    } else if (type === 'HMS') {
      dataTime = hour + ':' + minute + ':' + second
    } else if (type === 'YM') {
      dataTime = year + '-' + month
    } else {
      dataTime = year + '-' + month + '-' + day
    }
    return dataTime // 将格式化后的字符串输出到前端显示
  } else {
    return dataTime
  }
})

Vue.filter('distanceTime', function (second) {
  // 获取分钟数
  var minute = parseInt(second / 60000) % 60

  // 获取小时
  var hour = parseInt(second / 3600000) % 24

  // 获取天数
  var days = parseInt(second / 3600000 / 24)

  return days + '天 ' + hour + '小时 ' + minute + '分钟'
})

Vue.filter('toTel', function (value) {
  let start = value.slice(0, 3)
  let end = value.slice(-4)
  return `${start}****${end}`
})

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
router.beforeEach((to, from, next) => {
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0
  next()
})
// 元素的补零计算
function addZero (val) {
  if (val < 10) {
    return '0' + val
  } else {
    return val
  }
};
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
