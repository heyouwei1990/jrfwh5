
const state = {
  user: {
    'id': null,
    'phone': '',
    'userName': '',
    'avatar': '',
    'loginToken': '',
    'type': null,
    'authenticationFlag': null
    // 'id': 146,
    // 'phone': '',
    // 'userName': '戏子•辰',
    // 'avatar': 'http://img.jrfw360.com/usertrend/image1557469080554.jpg',
    // 'loginToken': '5c07bd525e42aa92da621345f7217b08041e1592',
    // 'hiddenPhone': '176****9486',
    // 'type': 8,
    // 'roles': '4',
    // 'authenticationFlag': 1
    // 'id': 150,
    // 'phone': '',
    // 'userName': '梦辰007',
    // 'avatar': 'http://thirdwx.qlogo.cn/mmopen/vi_32/aiaJNBib164qhShTnAKEefeDDRVDAOH4cekHxr42iawCLDDQbwRC9fLF91W5c8ibre5oJLRPECZncvx2SBf82kic77w/132', // http://img.jrfw360.com/upload-file1553651372308 151
    // 'loginToken': '49cbb1b2299d811158350900023e0ba2a6e704d1',
    // 'type': 9,
    // 'authenticationFlag': 0
  }
}
try {
  const user = localStorage.getItem('user')
  user && (state.user = JSON.parse(user))
} catch (error) {

}

// getters
const getters = {
  // location: state => state
}

// actions
const actions = {

}

// mutations
const mutations = {
  setUser (state, status) {
    localStorage.setItem('user', JSON.stringify(status))
    state.user = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
