import ThCell from './cell'
import ThImgTextlevel from './imgTextlevel'
import ThImgBox from './imgBox'
import ThLayout from './layout'
import TxLayout from './layoutX'

export default {
  install (Vue, options) {
    [
      ThImgBox,
      ThImgTextlevel,
      ThLayout,
      TxLayout,
      ThCell
    ].forEach(item => {
      Vue.use(item, options)
    })
  }
}
