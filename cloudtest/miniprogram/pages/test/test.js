// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [],
    picker:{
      index:1,
    },
    form: {
      item_id :"",
      item_name: "item_name",
      item_price: "item_price",
      item_phone: 12345678900,
      item_image: [],
      fileID:[]
    },
    openID : ""
  },

  getOpenID(){
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        that.setData({
          openID:res.result.openid
        });
        console.log('云函数获取到的openid: ', res.result.openid);
      }
    })
  },

/*
  添加物品：
    提交按钮：把picker.index、form里面的三个text + form.image(此时保存的是临时路径) 存储到数据库

 */
  add:function(){ 
    var that = this;
    //图片云存储
    wx.showLoading({ 
      title: '上传中',
    })
    let promiseArr = []; //图片事务数组
    for (let i = 0; i < that.data.form.item_image.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = that.data.form.item_image[i];
        let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
        wx.cloud.uploadFile({ //云存储图片
          cloudPath: "image/" + new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            that.data.form.fileID.concat(res.fileID)
            reslove();
          },
          fail: res => {
            wx.hideLoading();
            wx.showToast({
              title: "上传失败",
            })
          }
        })
      }));
    }
    Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
      const db = wx.cloud.database();
      console.log("!!!");
      db.collection('properties').add({ //数据库插入数据
        data: {
          //数据库会自动生成id(主键) 当然也可以自选
          name: that.data.form.item_name,
          type: that.data.picker.index,
          price: that.data.form.item_price,
          phone: that.data.form.item_phone,
          image: that.data.fileIDs, 
          status: false, //进行中
          deleteFlag : false //是否是已删除记录(逻辑删除)
        },
        success: res=>{
          that.data.form.item_id = res._id;
          that.setData({
            form:that.data.form
          })
         // console.log(res._id)//获取到添加新记录的id
        }
      })

      console.log(that.data.form);
      wx.hideLoading();
      wx.showToast({
        title: "上传成功",
      })
      // console.log(that.data.fileIDs);
    })
  },

  getobj:function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection('properties').where({
      //闲置物品
      status : false,
      deleteFlag : false,
      //我的-全部
      _openid : that.data.openID,
      deleteFlag : false,
      status : false , //放入properties_ing数组
      _openid : that.data.openID,
      status : true,  //放入properties_ed数组
      //我的-进行中,我的-已完成 通过数组传递
      //删除item,找到id，把deleteFlag字段置为true。(小程序端的数组看情况是手动删，还是通过数据库。)
      //完成item,找到id，把status字段置为true。(...)
      //修改item，找到id，(若修改(即新增)了图片，先上传图片??)用set替换
    }).get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data)
      }
    })
  },

  chat:function(){

  },

  reply:function(){

  },

  // 上传图片(添加物品chooseImage——返回/存储fileIDs数组)
  imagechoose: function () {
    var self = this;
    // 选择图片
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var pathLen = res.tempFilePaths.length;
        for (let i = 0; i < pathLen; i++) {
          self.data.form.item_image.push(res.tempFilePaths[i]);
        }
        console.log(self.data.form.item_image);
      }
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