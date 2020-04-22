const util = require('../../utils/util.js')
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
    item: {
      owner_id: "", //卖者id
      id: "",
      image: [],
      name: null,
      type: null,
      price: null,
      phone: null
    },
    hideFlag: true, //留言板：true-隐藏  false-显示
    animationData: {}, //存放滑入滑出动画的动画数据
    replyFlag: false, //留言板：true-回复 false-留言
    current_chat: {
      current_content: null, //当前留言内容
      current_index: 0, //当前留言的chatList索引
    },
    chatList: [{
      id: null, //留言id
      user: {
        user_icon: null,
        user_name: null,
        user_id: null,
      },
      content: null,
      time: "2020/04/06 16:24:52",
      reply: [{
        name: "回复者",
        content: "123"
      }]
    }]
  },

  replyInputChange: function(e) { //将content传回本page
    this.data.current_chat.current_content = e.detail.value;
    this.setData({
      current_chat: this.data.current_chat
    });
  },

  chatCommit: function() { //回复弹框的确定按钮
    var that = this;
    const db = wx.cloud.database();
    if (that.data.replyFlag) { //回复
      if (that.data.current_chat.current_content) { //有输入 留言/回复内容
        //云端数据库添加回复
        db.collection('reply').add({ //数据库插入数据
          data: {
            //数据库会自动生成id(主键) 当然也可以自选
            comment_id: that.data.chatList[that.data.current_chat.current_index].id,
            owner_id: that.data.chatList[that.data.current_chat.current_index].user.user_id, //当被回复，可消息提醒。
            replyer_name: that.data.user.user_name, //用于显示名字
            content: that.data.current_chat.current_content,
            time: new Date(),
            type: 0, //用于区分 闲置物品(0)、失物招领(1)
          },
          success: function(res) {
            //小程序端添加回复
            var reply = {
              name: that.data.user.user_name,
              content: that.data.current_chat.current_content
            }
            that.data.chatList[that.data.current_chat.current_index].reply.push(reply);
            that.data.current_chat.current_content = "";
            that.setData({
              chatList: that.data.chatList,
              current_chat: that.data.current_chat
            });
            that.hideModal();
          }
        })
      }
    } else { //留言
      if (that.data.current_chat.current_content) { //有输入 留言/回复内容
        var time = new Date();
        //云端数据库添加留言
        db.collection('comment').add({ //数据库插入数据
          data: {
            //数据库会自动生成id(主键) 当然也可以自选
            owner_id: that.data.item.owner_id, //当被评论，可消息提醒 (通过时间排序，查看是否有新留言。并且也保存了item_id)
            item_id: that.data.item.id, //用于itemchoose时的筛选条件
            user: that.data.user, //user姓名、头像、openid
            content: that.data.current_chat.current_content,
            time: time,
            type: 0, //用于区分 闲置物品(0)、失物招领(1)
          },
          success: function(res) {
            //小程序端添加留言
            var chat = {
              id: res._id,
              user: that.data.user,
              content: that.data.current_chat.current_content,
              time: util.formatTime(time),
              reply: []
            };
            that.data.chatList.push(chat);
            that.data.current_chat.current_content = "";
            that.setData({
              chatList: that.data.chatList,
              current_chat: that.data.current_chat
            });
            that.hideModal();
          }
        });
      }
    }
  },


  chatReply: function(e) { //回复按钮
    this.data.current_chat.current_index = e.currentTarget.dataset.r_index;
    this.setData({
      replyFlag: true,
      current_chat: this.data.current_chat
    });
    this.showModal();
  },

  chatNew: function() { //留言按钮
    this.setData({
      replyFlag: false
    })
    this.showModal();
  },

  previewImage: function(e) { //图片预览功能
    console.log(e)
    wx.previewImage({
      current: e.target.id, // 当前显示区域
      urls: this.data.item.image
    })
  },

  hiddenFalse: function() { //弹框flag
    this.setData({
      hideFlag: false
    })
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function() {
    var that = this;
    that.setData({
      hideFlag: false
    })
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间
      timingFunction: 'ease', //动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    });
    this.animation = animation; //将animation变量赋值给当前动画
    setTimeout(function() {
      that.slideIn(); //调用动画--滑入
    }, 100);
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms
      timingFunction: 'ease', //动画的效果 默认值是linear
    })

    this.animation = animation
    that.slideDown(); //调用动画--滑出
    setTimeout(function() {
      that.setData({
        hideFlag: true
      })
    }, 220) //先执行下滑动画，再隐藏模块
  },

  //动画 -- 滑入
  slideIn: function() {
    this.animation.translateY(0).step(); // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    });
  },

  //动画 -- 滑出
  slideDown: function() {
    this.animation.translateY(300).step();
    this.setData({
      animationData: this.animation.export(),
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.item) {
      var item = JSON.parse(options.item);
      this.data.item.owner_id = item.owner_id;
      this.data.item.id = item.id;
      this.data.item.image = item.image;
      this.data.item.name = item.name;
      this.data.item.type = item.type;
      this.data.item.price = item.price;
      this.data.item.phone = item.phone;
      var user = JSON.parse(options.user);
      this.data.user.user_name = user.user_name;
      this.data.user.user_icon = user.user_icon;
      this.data.user.user_id = user.user_id;
      this.setData({
        item: this.data.item,
        user: this.data.user
      })
      this.db_getItemComment(this.data.item.id);
    }
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

  },

  test:function(){
    var that = this;
    console.log(that.data.chatList[0].reply.length);
    that.data.chatList[0].reply.push(1);
    that.setData({
      chatList:that.data.chatList
    })
    console.log(that.data.chatList[0].reply.length);
  },

  db_getItemComment: function(item_id) { //获取该item的评论+留言
    var that = this;
    const db = wx.cloud.database();
    db.collection('comment') //先找评论(留言)
      .aggregate()
      .match({
        item_id: item_id
      })
      .sort({
        time: 1 //时间升序
      }).end({
        success: function(res) {
          var commentArray = [];
          for (let i = 0; i < res.list.length; i++) {
            var chat = {
              id: res.list[i]._id, //留言id
              user: {
                user_icon: res.list[i].user.user_icon,
                user_name: res.list[i].user.user_name,
                user_id: res.list[i].user.user_id,
              },
              content: res.list[i].content,
              time: util.formatTime(res.list[i].time),
              reply: []
            }
            db.collection('reply') //先找评论(留言)
              .aggregate()
              .match({
                comment_id: res.list[i]._id
              })
              .sort({
                time: 1 //时间升序
              })
              .end({
                success: function(res1) {
                  for (let j = 0; j < res1.list.length; j++) {
                    var chat_reply = {
                      name:res1.list[j].replyer_name,
                      content:res1.list[j].content
                    }
                    chat.reply.push(chat_reply);
                  }
                }
              })
            commentArray.push(chat);
          }     
          setTimeout(()=>{ //延迟设置，与wxml同步
            that.setData({
              chatList: commentArray
            })
          },400)  
        }
      })
  }
})