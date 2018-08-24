Component({
  /**
   * 组件的属性列表
   */
  properties: {
    alertbtn: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closealert: function () {
      this.triggerEvent('closealert')
    },
    clickbtn: function () {
      this.triggerEvent('alertbtn')
    }
  }
})
