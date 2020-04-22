// pages/unused_search/unused_search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: { //登录者信息
      user_icon: null, //用户头像
      user_name: null, //用户名字
      user_id: "" //用来唯一标识该用户的id(实际上就是当前用户的openid)
    },
    picker_type: { //类型选择
      item_type: ["学习用品", "电子产品", "化妆品", "生活物品", "贵重物品", "不详", "全部"],
      type_index: 6,
    },
    picker_price: { //价格选择
      price_type: ["价格升序", "价格降序"],
      price_index: 0,
    },
    all_ing: [{ //item数组
      owner_id:null,
      id: null,
      image: [],
      name: null,
      type: null,
      price: null,
      phone: null
    }]
  },

  chooseItem: function(e) {
    var item = JSON.stringify(this.data.all_ing[e.currentTarget.dataset.index]);
    var user = JSON.stringify(this.data.user);
    wx.navigateTo({
      url: '../../pages/item_detail/item_detail?item=' + item +"&user=" + user,
    })
  },

  bindTypePickerChange: function(e) { //类型选择器改变事件
    //小程序端改变
    this.data.picker_type.type_index = e.detail.value;
    this.setData({
      picker_type: this.data.picker_type
    });
    //云端数据库搜索
    this.db_searchItem();
  },
  bindPricePickerChange: function(e) { //价格选择器改变事件
    //小程序端改变
    this.data.picker_price.price_index = e.detail.value;
    this.setData({
      picker_price: this.data.picker_price
    })
    //云端数据库搜索
    this.db_searchItem();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo(); //获取用户信息(包含openid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.db_searchItem();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getOpenID: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        that.setData({
          "user.user_id": res.result.openid
        });
      }
    })
  },

  getUserInfo:function(){ //获得用户所有信息。包括openid
    var that = this;
    wx.showLoading({
      title: '用户授权中',
    })
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          "user.user_name":userInfo.nickName,
          "user.user_icon":userInfo.avatarUrl,
        })
      }
    })
    that.getOpenID();
    wx.hideLoading();
  },

  db_getUnuesd: function() { //获取所有的闲置物品
    var that = this;
    const db = wx.cloud.database();
    var sort = 1;//默认升序
    if (that.data.picker_price.price_index == 1) sort = -1; //降序
    db.collection('properties')
    .aggregate()
    .match({
      deleteFlag: false,
      status: false
    })
    .sort({
      price: sort
    }).end({
      success: function(res) {
        var itemArray = [];
        for (let i = 0; i < res.list.length; i++) {
          var item = {
            owner_id:res.list[i]._openid,
            id: res.list[i]._id,
            name: res.list[i].name,
            price: res.list[i].price,
            phone: res.list[i].phone,
            type: that.data.picker_type.item_type[res.list[i].type],
            image: res.list[i].fileid
          };
          itemArray.push(item);
        }
        that.setData({
          all_ing: itemArray
        })
      }
    })
  },

  db_searchItem: function() {
    var that = this;
    const db = wx.cloud.database();
    if (that.data.picker_type.type_index == 6) that.db_getUnuesd(); //全部搜索
    else {
      var sort = 1;//默认升序
      if (that.data.picker_price.price_index == 1) sort = -1; //降序
      db.collection('properties')
      .aggregate()
      .match({
          deleteFlag: false,
          status: false,
          type: parseInt(that.data.picker_type.type_index)
      })
      .sort({
        price: sort
      }).end({
        success: function(res) {
          console.log(res);
          var itemArray = [];
          for (let i = 0; i < res.list.length; i++) {
            var item = {
              owner_id: res.list[i]._openid,
              id: res.list[i]._id,
              name: res.list[i].name,
              price: res.list[i].price,
              phone: res.list[i].phone,
              type: that.data.picker_type.item_type[res.list[i].type],
              image: res.list[i].fileid
            };
            itemArray.push(item);
          }
          that.setData({
            all_ing: itemArray
          })
        }
      })
    }
  }

})