// pages/myproperty/myproperty.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    properties_ing:[{ //进行中数组
      image: ["../../res/全部.png"],
      name: "物品1",
      type: "生活物品",
      price: 99,
      phone: 13590273894,
      status:false
    },{
        image: ["../../res/全部.png"],
        name: "物品2",
        type: "化妆品",
        price: 300,
        phone: 13592348911,
        status: false
      }, {
        image: ["../../res/全部.png"],
        name: "物品3",
        type: "不详",
        price: 0,
        phone: 10086,
        status: false
      }, {
        image: ["../../res/全部.png"],
        name: "物品4",
        type: "化妆品",
        price: 11.11,
        phone: 13592222911,
        status: false
      }],
    properties_ed: [{ //已完成数组
      image: ["../../res/全部 (2).png"],
      name: "物品5",
      type: "贵重物品",
      price: 99,
      phone: 13590273894,
      status: true
    }, {
      image: ["../../res/全部 (2).png"],
      name: "物品6",
      type: "电子产品",
      price: 300,
      phone: 13592348911,
      status: true
      }, {
        image: ["../../res/全部 (2).png"],
        name: "物品7",
        type: "贵重物品",
        price: 10000,
        phone: 13523348911,
        status: true
      }, {
        image: ["../../res/全部 (2).png"],
        name: "物品8",
        type: "电子产品",
        price: 200.2,
        phone: 13592111922,
        status: true
      }],
    current_properties:[], //当前列表数组
    current_navigate:"", //当前导航按钮
  },

  navigateButton:function(e){ //导航按钮事件
    var that = this;
    if(e.currentTarget.dataset.type == "all"){
      this.setData({
        current_properties: that.data.properties_ing.concat(that.data.properties_ed),
        current_navigate:"all"
      });
    }else if(e.currentTarget.dataset.type == "properties_ing"){
      this.setData({
        current_properties: that.data.properties_ing,
        current_navigate:"properties_ing"
      });
    }else{
      this.setData({
        current_properties: that.data.properties_ed,
        current_navigate:"properties_ed"
      });
    }
  },

  itemFinish:function(e){ //item完成事件
    var that = this;
    var finish_item = that.data.properties_ing.splice(e.currentTarget.dataset.index, 1);//进行中数组减少 
    finish_item[0].status = true;//修改状态为已完成(true)
    that.data.properties_ed.push(finish_item[0]);//已完成数组添加
    this.setData({
      properties_ing: that.data.properties_ing,
      properties_ed: that.data.properties_ed,
    });
    that.updateCurrentProperties();
    wx.showToast({
      title: '成功',
      duration: 500
    })
  },

  itemDelete:function(e){ //item删除事件
    var that = this;
    that.data.properties_ing.splice(e.currentTarget.dataset.index, 1);//进行中数组减少 
    this.setData({
      properties_ing: that.data.properties_ing,
    });
    that.updateCurrentProperties();
    wx.showToast({
      title: '成功',
      duration: 500
    })
    console.log("物品已删除！");
  },

  itemCorrect:function(e){ //item修改事件
    var item = JSON.stringify(e.currentTarget.dataset.item);
    console.log(e);
    var index = 0;//存放物品类型对应的index
    var array_index = e.currentTarget.dataset.index;//数组下标
    switch (e.currentTarget.dataset.item.type) {
      case "学习用品":
        index = 0;
        break;
      case "电子产品":
        index = 1;
        break;
      case "化妆品":
        index = 2;
        break;
      case "生活物品":
        index = 3;
        break;
      case "贵重物品":
        index = 4;
        break;
      default:
        index = 5;
    };
    wx.navigateTo({
      url: '../../pages/modify_item/modify_item?item=' + item + '&index=' + index +'&page=correct'+'&array_index='+array_index
      })
  },

  updateCurrentProperties:function(){ //更新current_properties数组
    var that = this;
    var type = that.data.current_navigate; 
    if(type == "all"){
      this.setData({
        current_properties: that.data.properties_ing.concat(that.data.properties_ed)
      })
    }else if(type == "properties_ing"){
      this.setData({
        current_properties: that.data.properties_ing
      })
    }else{
      this.setData({
        current_properties: that.data.properties_ed
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
   // console.log(this.data.current_properties);
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
    var that = this;
    that.setData({
      properties_ing: that.data.properties_ing,
      current_properties: that.data.properties_ing.concat(that.data.properties_ed),
      current_navigate: "all"
    });
    console.log(that.data.properties_ing);
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