// pages/myproperty/myproperty.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID: "",//唯一标识用户信息
    properties_ing: [{ //进行中数组
      id: null, //唯一标识
      image: [],//保存的是云存储的fileid
      name: null,
      type: null,
      price: null,
      phone: null,
      status: false
    }],
    properties_ed: [{ //已完成数组
      id: null,
      image: [],
      name: null,
      type: null,
      price: null,
      phone: null,
      status: true
    }],
    item_type: ["学习用品", "电子产品", "化妆品", "生活物品", "贵重物品", "不详"],
    current_properties: [], //当前列表数组
    current_navigate: "", //当前导航按钮
  },

  navigateButton: function (e) { //导航按钮事件
    var that = this;
    if (e.currentTarget.dataset.type == "all") {
      this.setData({
        current_properties: that.data.properties_ing.concat(that.data.properties_ed),
        current_navigate: "all"
      });
    } else if (e.currentTarget.dataset.type == "properties_ing") {
      this.setData({
        current_properties: that.data.properties_ing,
        current_navigate: "properties_ing"
      });
    } else {
      this.setData({
        current_properties: that.data.properties_ed,
        current_navigate: "properties_ed"
      });
    }
  },

  itemFinish: function (e) { //item完成事件
    var that = this;
    wx.showModal({
      title: '完成物品',
      content: '确定要完成该物品？',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          //小程序端修改
          var finish_item = that.data.properties_ing.splice(e.currentTarget.dataset.index, 1);//进行中数组减少 
          finish_item[0].status = true;//修改状态为已完成(true)
          that.data.properties_ed.push(finish_item[0]);//已完成数组添加
          that.setData({
            properties_ing: that.data.properties_ing,
            properties_ed: that.data.properties_ed,
          });
          that.updateCurrentProperties();
          //云端数据库修改
          const db = wx.cloud.database();
          db.collection('properties').doc(e.currentTarget.dataset.item_index).update({
            // data 传入需要局部更新的数据
            data: {
              status: true //已完成
            },
            success: function (res) {
              wx.showToast({
                title: '成功',
                duration: 500
              })
            }
          })  
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    });   
  },

  itemDelete: function (e) { //item删除事件
    var that = this;
    wx.showModal({
      title: '删除物品',
      content: '确定要删除该物品？',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          //小程序端
          that.data.properties_ing.splice(e.currentTarget.dataset.index, 1);//进行中数组减少 
          that.setData({
            properties_ing: that.data.properties_ing,
          });
          that.updateCurrentProperties();
          //云端数据库修改
          const db = wx.cloud.database();
          db.collection('properties').doc(e.currentTarget.dataset.item_index).update({
            // data 传入需要局部更新的数据
            data: {
              deleteFlag: true //逻辑删除
            },
            success: function (res) {
              wx.showToast({
                title: '成功',
                duration: 500
              })
            }
          })
          wx.showToast({
            title: '成功',
            duration: 500
          })
          console.log("物品已删除！");
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    });   
  },

  itemCorrect: function (e) { //item修改事件
    var item = JSON.stringify(e.currentTarget.dataset.item);
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
      url: '../../pages/modify_item/modify_item?item=' + item + '&index=' + index + '&page=correct' + '&array_index=' + array_index
    })
  },

  updateCurrentProperties: function () { //更新current_properties数组;
    var that = this;
    var type = that.data.current_navigate;
    if (type == "all") {
      this.setData({
        current_properties: that.data.properties_ing.concat(that.data.properties_ed)
      })
    } else if (type == "properties_ing") {
      this.setData({
        current_properties: that.data.properties_ing
      })
    } else {
      this.setData({
        current_properties: that.data.properties_ed
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { //从navigateback回到此处，不会调用。
    //数据库的查询，放入两个数组中
    this.db_getMyUnused();
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
    that.setData({ //处理modify_item返回来的小程序端逻辑。
      properties_ing: that.data.properties_ing,
      current_properties: that.data.properties_ing.concat(that.data.properties_ed),
      current_navigate: "all"
    });

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

  },

  db_getMyUnused: function () { //数据库：获得我的-闲置物品
    var that = this;

    let promiseArr = []; //事务数组
    const db = wx.cloud.database();
    promiseArr.push(new Promise((reslove, reject) => {
      db.collection('properties').where({
        _openid: that.data.openID,
        deleteFlag: false,
        status: false, //放入properties_ing数组
      }).get({
        success: function (res) {
          var itemArray = [];
          for(let i=0;i<res.data.length;i++){
            var item = {
              id: res.data[i]._id,
              name: res.data[i].name,
              price: res.data[i].price,
              phone: res.data[i].phone,
              status: res.data[i].status,
              type: that.data.item_type[res.data[i].type],
              image:res.data[i].fileid
            };
           itemArray.push(item);
          }    
          that.setData({
            properties_ing: itemArray
          })
          reslove();
        }
      })
    }));
  
    promiseArr.push(new Promise((reslove, reject) => {
      db.collection('properties').where({
        _openid: that.data.openID,
        deleteFlag: false,
        status: true, //放入properties_ed数组
      }).get({
        success: function (res) {
          var itemArray = [];
          for (let i = 0; i < res.data.length; i++) {
            var item = {
              id: res.data[i]._id,
              name: res.data[i].name,
              price: res.data[i].price,
              phone: res.data[i].phone,
              status: res.data[i].status,
              type: that.data.item_type[res.data[i].type],
              image: res.data[i].fileid
            };
            itemArray.push(item);
          }
          that.setData({
            properties_ed: itemArray
          })
          reslove();
        }
      })
    }));     
    
    Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
      that.updateCurrentProperties();
    });
     
  }
})