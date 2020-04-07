// pages/unused_search/unused_search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker_type: {//类型选择
      item_type: ["学习用品", "电子产品", "化妆品", "生活物品", "贵重物品", "不详"],
      type_index: 0,
    },
    picker_price: {//价格选择
      price_type: ["价格升序", "价格降序"],
      price_index: 0,
    },
    all_ing: [{ //item数组
      image: "../../res/全部.png",
      name: "物品1",
      type: "生活物品",
      price: 9999999.23,
      phone: 13590273894
    }, { 
        image: "../../res/全部.png",
        name: "物品2",
        type: "电子产品",
        price: 109,
        phone: 13523473894
      },
      { 
        image: "../../res/全部.png",
        name: "乌龟",
        type: "不详",
        price: 91,
        phone: 13590273334
      },
      { 
        image: "../../res/全部.png",
        name: "纸巾",
        type: "生活物品",
        price: 5,
        phone: 12222273894
      }]
  },

  chooseItem:function(e){
    var item = JSON.stringify(this.data.all_ing[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '../../pages/item_detail/item_detail?item='+item,
    })
  },

  bindTypePickerChange: function (e) { //类型选择器改变事件
    this.data.picker_type.type_index = e.detail.value;
    this.setData({
      picker_type: this.data.picker_type
    })
  },
  bindPricePickerChange: function (e) { //价格选择器改变事件
    this.data.picker_price.price_index = e.detail.value;
    this.setData({
      picker_price: this.data.picker_price
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})