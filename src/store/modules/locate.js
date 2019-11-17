
const state = {
  location: {
    cityId: 310100,
    province: '上海市',
    city: '上海市',
    district: '松江区',
    street: '松江体育馆',
    lat: 31.2317,
    lng: 121.473,
    selectCityId: '',
    selectCity: '',
    selectCityLng: '',
    selectCityLat: ''
  }
}

const location = localStorage.getItem('location')
location && (state.location = JSON.parse(location))

// getters
const getters = {
  // location: state => state
}

// actions
const actions = {

}

// mutations
const mutations = {
  setLocation (state, status) {
    // console.log(status, state)
    localStorage.setItem('location', JSON.stringify(status))
    state.location = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
