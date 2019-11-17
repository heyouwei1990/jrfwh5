<template>
       <mt-datetime-picker
        class="myDatePicker"
        ref="myDatePicker"
        type="date"
        v-model="pickerValue"
        :startDate="startDate"
        :endDate="endDate"
        year-format="{value}"
        month-format="{value}"
        date-format="{value}"
        @confirm="click"
        >
    </mt-datetime-picker>
</template>

<script>
export default {
  data () {
    return {
      startDate: new Date(),
      endDate: new Date(),
      pickerValue: ''
    }
  },
  components: {
  },
  created () {
    let year = +this.endDate.getFullYear() - 100
    this.startDate = new Date(year + '/01/01')
    this.pickerValue = new Date(year + '/01/01')
  },
  activated () {
    // let year = +this.startDate.getFullYear() + 50
    // this.startDate = new Date(year + '/01/01')
    // this.pickerValue = new Date(year + '/01/01')
  },
  methods: {
    open () {
      this.$refs.myDatePicker.open()
    },
    click () {
      sessionStorage.setItem('birthdayTime', this.pickerValue)
      this.$emit('click', this.pickerValue)
    }
  }
}
</script>

<style lang="less" scoped>
.myDatePicker{
  height: auto !important;
}
</style>
