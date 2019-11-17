
/**
 * 设置路由
 */
const inviteDistributionRoutes = [
  {
    path: '/distributor',
    name: 'distributor',
    component: resolve => require(['../page/inviteDistribution/distributor.vue'], resolve),
    meta: {
      title: '邀请分销',
      mustH5Header: true,
      pageValue: 'distributor'
    }
  },
  {
    path: '/channel',
    name: 'channel',
    component: resolve => require(['../page/inviteDistribution/channel.vue'], resolve),
    meta: {
      title: '邀请渠道',
      mustH5Header: true,
      pageValue: 'channel'
    }
  },
  {
    path: '/inviteDistribution/propertyServiceDetail/:id',
    name: 'propertyS',
    component: resolve => require(['../page/inviteDistribution/propertyServiceDetail/PropertyServiceDetail.vue'], resolve),
    meta: {
      title: '看房服务',
      mustH5Header: true,
      requireLogin: true,
      pageValue: 'propertyS'
    }
  },
  {
    path: '/inviteDistribution/propertyDetail/:id',
    name: 'propertyD',
    component: resolve => require(['../page/inviteDistribution/propertyDetail/PropertyDetail.vue'], resolve),
    meta: {
      title: '楼盘详情',
      // mustH5Header: true,
      pageValue: 'propertyD'
    }
  },
  {
    path: '/invitePropertyDetail/:id',
    name: 'invitePropertyDetail',
    component: resolve => require(['../page/inviteDistribution/propertyDetail/PropertyDetail.vue'], resolve),
    meta: {
      title: '新分销楼盘详情',
      // mustH5Header: true,
      pageValue: 'invitePropertyDetail'
    }
  }
]
export default inviteDistributionRoutes
