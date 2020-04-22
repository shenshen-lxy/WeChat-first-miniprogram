// pages/modify_item/modify_item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: { //类型选择
      item_type: ["学习用品", "电子产品", "化妆品", "生活物品", "贵重物品", "不详"],
      index: 0,
    },
    form: {
      //correct:true,//修改项(true) 添加项(false)
      title: "修改物品信息",
      item_id: null,
      item_name: null,
      item_price: null,
      item_phone: null,
      item_image: [], //添加--存储本地路径,直接将本地path传回myproperty； 修改--存储云端fileid--修改后本地path
      fileID: [] //添加--存储上传图片fileID。不传回myproperty； 修改--null--修改后云端path
    },
    array_index: 0, //要修改的properties_ing数组的索引
    image_width: 0, //用于设置图片的高度    
  },

  inputChange: function(e) { //输入框发生变化后
    var type = e.currentTarget.dataset.input;
    switch (type) {
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
      form: this.data.form
    })
  },

  formSubmit: function(e) { //按钮提交
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (that.data.form.title == "修改物品信息") {
      //小程序端修改
      prevPage.data.properties_ing[that.data.array_index].image = that.data.form.item_image;
      if (that.data.form.item_name)
        prevPage.data.properties_ing[that.data.array_index].name = that.data.form.item_name;
      prevPage.data.properties_ing[that.data.array_index].type = that.data.picker.item_type[that.data.picker.index];
      if (that.data.form.item_price)
        prevPage.data.properties_ing[that.data.array_index].price = that.data.form.item_price;
      if (that.data.form.item_phone)
        prevPage.data.properties_ing[that.data.array_index].phone = that.data.form.item_phone;
      //云端数据库修改
      wx.showLoading({
        title: '修改中',
      })
      const db = wx.cloud.database();
      console.log(that.data.form.fileID);
      console.log(that.data.form.item_image);
      if (JSON.stringify(that.data.form.fileID) == JSON.stringify(that.data.form.item_image)) { //数组一样，说明图片没有修改  
        db.collection('properties').doc(that.data.form.item_id).update({
          // data 传入需要局部更新的数据
          data: {
            name: that.data.form.item_name,
            phone: parseInt(that.data.form.item_phone),
            price: parseFloat(that.data.form.item_price),
            type: parseInt(that.data.picker.index)
          },
          success: function(res) {
            console.log("局部修改");
          }
        })
      } else { //图片进行了修改
        //图片云存储 
        that.data.form.fileID = []; //清空，用来存储修改后的图片fileid数组      
        let promiseArr = []; //图片事务数组
        for (let i = 0; i < that.data.form.item_image.length; i++) {
          promiseArr.push(new Promise((reslove, reject) => {
            let item = that.data.form.item_image[i];
            let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
            wx.cloud.uploadFile({ //云存储图片
              cloudPath: "image/" + new Date().getTime() + suffix, // 上传至云端的路径
              filePath: item, // 小程序临时文件路径
              success: res => {
                that.data.form.fileID.push(res.fileID)
                reslove();
              },
              fail: res => {
                wx.hideLoading();
                wx.showToast({
                  title: "修改失败",
                })
              }
            })
          }));
        }
        Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
          db.collection('properties').doc(that.data.form.item_id).update({
            // data 传入需要局部更新的数据
            data: {
              name: that.data.form.item_name,
              phone: parseInt(that.data.form.item_phone),
              price: parseFloat(that.data.form.item_price),
              type: parseInt(that.data.picker.index),
              fileid: that.data.form.fileID
            },
            success: function(res) {
              console.log("带图片修改");
            }
          })
        })
      }
      wx.navigateBack({
        delta: 1,
        success: function() {
          wx.showToast({
            title: '成功',
            duration: 500
          })
        }
      })
    } else { //添加物品
      if (that.data.form.item_image != [] &&
        that.data.form.item_name != null &&
        that.data.form.item_price != null &&
        that.data.form.item_phone != null) { //如果都不为空
        var that = this;

        //图片云存储
        wx.showLoading({
          title: '上传中',
        })
        let promiseArr = []; //图片事务数组
        for (let i = 0; i < that.data.form.item_image.length; i++) {
          promiseArr.push(new Promise((reslove, reject) => {
            let item = that.data.form.item_image[i];
            let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
            wx.cloud.uploadFile({ //云存储图片
              cloudPath: "image/" + new Date().getTime() + suffix, // 上传至云端的路径
              filePath: item, // 小程序临时文件路径
              success: res => {
                that.data.form.fileID.push(res.fileID)
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
        Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
          const db = wx.cloud.database();
          db.collection('properties').add({ //数据库插入数据
            data: {
              //数据库会自动生成id(主键) 当然也可以自选
              name: that.data.form.item_name,
              type: parseInt(that.data.picker.index),
              price: parseFloat(that.data.form.item_price),
              phone: parseInt(that.data.form.item_phone),
              fileid: that.data.form.fileID,
              status: false, //进行中
              deleteFlag: false //是否是已删除记录(逻辑删除)
            },
            success: function(res) {
              that.data.form.item_id = res._id; //获取到添加新记录的id
              var item = {
                id: that.data.form.item_id,
                image: that.data.form.item_image,
                name: that.data.form.item_name,
                type: that.data.picker.item_type[that.data.picker.index],
                price: that.data.form.item_price,
                phone: that.data.form.item_phone,
                status: false
              };
              prevPage.data.properties_ing.push(item);
              prevPage.setData({
                properties_ing: prevPage.data.properties_ing
              });
              wx.navigateBack({
                delta: 1,
                success: function() {
                  wx.showToast({
                    title: '成功',
                    duration: 500
                  })
                }
              })
            }
          })
        });
      } else {
        wx.navigateBack({
          delta: 1,
          success: function() {
            wx.showToast({
              title: '失败：信息不能为空',
              icon: 'none',
              duration: 500
            })
          }
        })
      }
    }
  },

  bindPickerChange: function(e) { //类型选择器改变事件
    var that = this;
    that.data.picker.index = e.detail.value;
    this.setData({
      picker: that.data.picker
    })
  },

  //选择图片
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        //tempFilePath可以作为img标签的src属性显示图片
        var i = 0;
        for (; i < res.tempFilePaths.length; i++) {
          that.data.form.item_image.push(res.tempFilePaths[i]);
        }
        that.setData({
          form: that.data.form
        });
      },
      fail: function(res) {
        wx.showToast({
          title: "最多上传四张照片",
        })
      }
    })
  },
  //预览图片
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.form.item_image // 需要预览的图片http链接列表
    })
  },
  //清除所有图片
  imageClear: function() {
    this.data.form.item_image.splice(0, this.data.form.item_image.length);
    this.setData({
      form: this.data.form
    });
  },

  deepClone: function(obj) { //深拷贝，将fileID拷贝一份
    var _obj = JSON.stringify(obj),
      objClone = JSON.parse(_obj);
    return objClone;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var query = wx.createSelectorQuery(); //选择id
    var that = this;
    query.select('.content_image_frame_inner').boundingClientRect(function(rect) {
      that.setData({
        image_width: rect.width + 'px'
      })
    }).exec(); //以上信息设置图片的宽度
    if (options.page == "correct") { //修改物品
      var item = JSON.parse(options.item);
      var picker_index = options.index;

      that.data.picker.index = picker_index;
      that.data.form.title = "修改物品信息";
      that.data.form.item_id = item.id;
      that.data.form.item_name = item.name;
      that.data.form.item_price = item.price;
      that.data.form.item_phone = item.phone;
      that.data.form.item_image = item.image; //此时存储的是图片的fileid
      that.data.form.fileID = that.deepClone(item.image); //拷贝一份，用以后面修改图片的对比

      that.setData({
        picker: that.data.picker,
        array_index: options.array_index,
      })
    } else { //添加物品
      that.data.form.title = "添加物品";
    }
    that.setData({
      form: that.data.form
    })

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

  }
})