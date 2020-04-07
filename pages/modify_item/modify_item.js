// pages/modify_item/modify_item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    picker: {//类型选择
      item_type: ["学习用品", "电子产品", "化妆品", "生活物品", "贵重物品", "不详"],
      index: 0,
    },
    form:{
      correct:true,//修改项(true) 添加项(false)
      title:"修改物品信息",
      item_name:null,
      item_price:null,
      item_phone:null,
      item_image:"../../res/添加图片.png"
    },
    array_index : 0 //要修改的properties_ing数组的索引
  },

  inputChange:function(e){ //输入框发生变化后
    var type = e.currentTarget.dataset.input;
    switch(type){
      case "item_name":
        this.data.form.item_name = e.detail.value;
        break;
      case "item_price":
        this.data.form.item_price = e.detail.value;
        break;
      case "item_phone":
        this.data.form.item_phone = e.detail.value;
    }
    this.setData({
      form:this.data.form
    })
  },

  formSubmit:function(e){ //按钮提交
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];//上一个页面
    if(this.data.form.title == "修改物品信息"){
      prevPage.data.properties_ing[this.data.array_index].image = this.data.form.item_image;
      if(this.data.form.item_name)
      prevPage.data.properties_ing[this.data.array_index].name = this.data.form.item_name;
      prevPage.data.properties_ing[this.data.array_index].type = this.data.picker.item_type[this.data.picker.index];
      if(this.data.form.item_price)
      prevPage.data.properties_ing[this.data.array_index].price = this.data.form.item_price;
      if(this.data.form.item_phone)
      prevPage.data.properties_ing[this.data.array_index].phone = this.data.form.item_phone;
      wx.navigateBack({
        delta: 1,
        success: function () {
          wx.showToast({
            title: '成功',
            duration: 500
          })
        }
      })
    }
    else{ //添加物品
      if (this.data.form.item_image != "../../res/添加图片.png" && 
          this.data.form.item_name != null &&
          this.data.form.item_price != null &&
          this.data.form.item_phone != null){ //如果都不为空
            var item = {
              image: this.data.form.item_image,
              name: this.data.form.item_name,
              type: this.data.picker.item_type[this.data.picker.index],
              price: this.data.form.item_price,
              phone: this.data.form.item_phone,
              status: false
            };
            prevPage.data.properties_ing.push(item);
            prevPage.setData({
              properties_ing: prevPage.data.properties_ing
            });
            wx.navigateBack({
              delta: 1,
              success: function () {
                wx.showToast({
                  title: '成功',
                  duration: 500
                })
              }
            })
      }
      else{
        wx.navigateBack({
          delta: 1,
          success: function () {
            wx.showToast({
              title: '失败',
              icon:'none',
              duration: 500
            })
          }
        })
      }
    }
    
    
  },

  bindPickerChange: function (e) { //类型选择器改变事件
    var that = this;
    that.data.picker.index = e.detail.value;
    this.setData({
      picker:that.data.picker
    })
  },

  imageChange: function () { //图片添加/修改
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.data.form.item_image = res.tempFilePaths;
        that.setData({
          form:that.data.form
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.page == "correct" ){ //修改物品
      var item = JSON.parse(options.item);
      var picker_index = options.index;

      this.data.picker.index = picker_index;
      this.data.form.title = "修改物品信息";
      this.data.form.item_name = item.name;
      this.data.form.item_price = item.price;
      this.data.form.item_phone = item.phone;
      this.data.form.item_image = item.image;

      this.setData({
        picker: this.data.picker,
        array_index:options.array_index
      })
    }
    else{ //添加物品
      this.data.form.title = "添加物品";
    }
    this.setData({
      form: this.data.form
    })
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