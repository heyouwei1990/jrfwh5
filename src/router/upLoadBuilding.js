
/**
 * 设置路由
 */
const upLoadBuildingRoutes = [
  {
    path: '/calendar',
    name: 'calendar',
    component: resolve => require(['../components/base/calendar/calendar.vue'], resolve),
    meta: {
      title: '日历',
      pageValue: 'calendar'
    }
  },
  {
    path: '/upLoadBuilding',
    name: 'upLoadBuilding',
    component: resolve => require(['../page/upLoadBuilding/upLoadBuilding'], resolve),
    meta: {
      title: '上传楼盘',
      pageValue: 'upLoadBuilding'
    }
  }
]
export default upLoadBuildingRoutes
