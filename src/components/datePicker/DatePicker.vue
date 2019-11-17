<template>
       <mt-datetime-picker
        class="myDatePicker"
        ref="myDatePicker"
        type="datetime"
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
      pickerValue: new Date(),
      endDate: new Date(),
      startDate: new Date()
    }
  },
  components: {
  },
  created () {
    let year = +this.startDate.getFullYear() + 50
    this.endDate = new Date(year + '/01/01 00:00:00')
  },
  activated () {
    let year = +this.startDate.getFullYear() + 50
    this.endDate = new Date(year + '/01/01 00:00:00')
    this.pickerValue = new Date(year + '/01/01 00:00:00')
  },
  methods: {
    open () {
      this.$refs.myDatePicker.open()
    },
    click () {
      // sessionStorage.setItem('pickerValue', this.pickerValue)
      console.log(this.pickerValue)
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
