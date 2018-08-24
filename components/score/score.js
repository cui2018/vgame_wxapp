Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialogtext: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    stars:[
      "starw",
      "starw",
      "starw",
      "starw",
      "starw",
    ],
    starnum: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selestar:function(e){
      let stars = [
        "starw",
        "starw",
        "starw",
        "starw",
        "starw",
      ]
      for (let i = 0; i <= e.target.dataset.num; i++){
        stars[i] = "stary"
      }
      this.setData({
        stars: stars,
        starnum: e.target.dataset.num+1
      })
    },
    closescore: function () {
      this.triggerEvent('closescore')
    }
  }
})
