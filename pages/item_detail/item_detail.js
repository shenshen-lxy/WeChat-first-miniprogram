const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    user:{ //登录者信息
      user_icon:"../../res/个人中心.png", //用户头像
      user_name: "当前用户", //用户名字
      user_info:"" //用来唯一标识该用户的id(暂时没用)
    },
    item: {
      owner_info: "卖者",
      image: ["../../res/微笑.jpg", "../../res/个人中心.png","../../res/个人中心 (2).png"],
      name: "一次性的便签",
      type: "不详",
      price: 45.35,
      phone: 13589033287
    },
    hideFlag: true, //留言板：true-隐藏  false-显示
    animationData: {}, //存放滑入滑出动画的动画数据
    replyFlag: false, //留言板：true-回复 false-留言
    current_chat:{
      current_content: null, //当前留言内容
      current_index:0, //当前留言的chatList索引
    },
    chatList:[{
      image:"../../res/个人中心.png",
      name:"用户1",
      content:"你能详细说明下情况吗？你能详细说明下情况吗？你能详细说明下情况吗？你能详细说明下情况吗？你能详细说明下情况吗？",
      time:"2020/04/06 16:24:52",
      reply:[]
    },{
      image:"../../res/个人中心 (2).png",
      name:"owner",
      content:"是这样的，这个东西有保质期。",
      time: "2020/04/06 16:24:53",
      reply: ["我知道了。","我不懂你的意思","意思就是说这东西放久了会坏？还是你这个本身就过期了？？？"]
    }]
  },

  replyInputChange:function(e){ //将content传回本page
    this.data.current_chat.current_content = e.detail.value;
    this.setData({
      current_chat: this.data.current_chat
    });
  },

  chatCommit:function(){ //回复弹框的确定按钮
    if(this.data.replyFlag){ //回复
      if(this.data.current_chat.current_content){ //有输入 留言/回复内容
        this.data.chatList[this.data.current_chat.current_index].reply.push(this.data.current_chat.current_content);
      }
    }
    else{ //留言
      if (this.data.current_chat.current_content) { //有输入 留言/回复内容
        var chat = {
          image: this.data.user.user_icon,
          name: this.data.user.user_name,
          content: this.data.current_chat.current_content,
          time: util.formatTime(new Date()),
          reply: []
        };
        this.data.chatList.push(chat); 
      }
    }
    this.data.current_chat.current_content = "";
    this.setData({
      chatList: this.data.chatList,
      current_chat: this.data.current_chat
    });
    this.hideModal();
  },


  chatReply:function(e){ //回复按钮
    this.data.current_chat.current_index = e.currentTarget.dataset.r_index;
    this.setData({
      replyFlag: true,
      current_chat:this.data.current_chat
    });
    this.showModal();
  },

  chatNew:function(){ //留言按钮
    this.setData({
      replyFlag: false
    })
    this.showModal();
  },

  previewImage: function (e) { //图片预览功能
    wx.previewImage({
      current: this.data.item.image[0], // 当前显示区域
      urls: this.data.item.image
    })
  },

  hiddenFalse: function () { //弹框flag
    this.setData({
      hideFlag: false
    })
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function () {
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
    setTimeout(function () {
      that.slideIn(); //调用动画--滑入
    }, 100);
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms
      timingFunction: 'ease', //动画的效果 默认值是linear
    })

    this.animation = animation
    that.slideDown(); //调用动画--滑出
    setTimeout(function () {
      that.setData({
        hideFlag: true
      })
    }, 220) //先执行下滑动画，再隐藏模块
  },

  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step(); // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    });
  },

  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step();
    this.setData({
      animationData: this.animation.export(),
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.item){
      var item = JSON.parse(options.item);
      this.data.item.image = item.image;
      this.data.item.name = item.name;
      this.data.item.type = item.type;
      this.data.item.price = item.price;
      this.data.item.phone = item.phone;
      this.setData({
        item: this.data.item
      })
    }   
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