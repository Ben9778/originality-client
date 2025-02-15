// index.js
Page({
  data: {
    flag: false, //顶部问题框显示触发按钮
    questiondocker: '',
    timedocker: '',
    responsedocker: '',
    content: '', //获取用户输入
    icon: "/static/icon-send.svg", //发送按钮开关
    resshow: false, //回复文本框显示开关
    copyswitch: false, //显示一键复制开关
    stopswitch: false, // 停止回答开关
    exampleswitch: true,
    timer: '',
    example1: '帮我写一份珠宝行业年度工作报告',
    example2: '写一份新能源汽车行业的调研报告',
    screenclass1: '',
    screenclass2: '',
    token: '', //用户加密后的openid
    hadcount: 0,
    isvip:0
  },
  //获取输入内容
  getcontent(e) {
    let values = e.detail.value
    this.setData({
      content: values
    })
  },
  //提交按钮控制事件
  showquestion() {
    let that=this
    if (that.data.hadcount==0&&that.data.isvip==0){
      wx.showModal({
        title: '提示',
        content: '您还不是会员，立刻开通？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/payment/payment',
            })
          } else if (res.cancel) {}
        }
      })
    } else {
      if (that.data.content == '') {
        wx.showToast({
          title: "请输入内容",
          icon: 'none'
        })
      }
      if (that.data.content != "" && that.data.exampleswitch) {
        that.setData({
          exampleswitch: false,
          flag: true, //显示对话框和时间
          resshow: true, //显示回复框
          icon: "/static/icon-loading.svg", //设置提交按钮为等待状态
          questiondocker: that.data.content,
          content: '', //清空输入内容
          responsedocker: "思考中...", //回复框内容
          timedocker: that.formattime() //时间
        })
        that.htmltemplate() //发起网络请求
      }
      if (that.data.content != '' && !that.data.exampleswitch) {
        that.setData({
          questiondocker: that.data.content,
          timedocker: that.formattime(), //时间
          responsedocker: "思考中...", //回复框内容
          copyswitch: false,
          content: ''
        })
        that.htmltemplate()
      }
    }
  },
  //时间格式化
  formattime() {
    let time = Date.parse(new Date())
    let nowdate = new Date(time)
    let hour = nowdate.getHours()
    let minute = nowdate.getMinutes()
    if (minute < 10) {
      minute = "0" + minute
    }
    return hour + ":" + minute
  },

  /*发送请求*/
  htmltemplate() {
    let that = this
    wx.request({
      url: 'https://www.blackfiresoft.com/chat/v2',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'access_token': that.data.token,
        'content': that.data.questiondocker
      },
      success(res) {
        let jsonData = JSON.parse(res.data.result)
        that.setData({
          stopswitch: true, //开启停止按钮
          hadcount:that.data.hadcount-1
        })
        //流式间隔输出文本
        let str = jsonData.result
        let i = 0
        that.data.timer = setInterval(function () {
          let text = str.substring(0, i);
          i++;
          that.setData({
            responsedocker: text,
          })
          if (text.length == str.length) {
            that.setData({
              icon: "/static/icon-send.svg",
              copyswitch: true,
              stopswitch: false
            })
            clearInterval(that.data.timer);
          }
        }, 50)
      },
      fail() {
        this.setData({
          icon: "/static/icon-send.svg"
        })
        wx.showToast({
          title: '当前系统繁忙,请稍后再试',
          icon: 'loading'
        })
      }
    })
  },
  //复制文本
  copy() {
    wx.setClipboardData({
      data: this.data.responsedocker,
      success() {}
    })
  },
  stop() {
    clearInterval(this.data.timer)
    if(this.data.responsedocker=='思考中...'){
      this.setData({
        stopswitch: false,
        copyswitch: false,
        icon: "/static/icon-send.svg"
      })
    }
    this.setData({
      stopswitch: false,
      copyswitch: true,
      icon: "/static/icon-send.svg"
    })
  },
  copyexample1() {
    this.setData({
      content: this.data.example1
    })
  },
  copyexample2() {
    this.setData({
      content: this.data.example2
    })
  },
  //页面初始化
  onLoad() {
    let that = this
    try {
      let res = wx.getSystemInfoSync()
      if (res.screenHeight >= 667 || res.screenHeight <= 736) {
        that.setData({
          screenclass1: 'example1',
          screenclass2: 'example-box1'
        })
      }
      if (res.screenHeight > 736) {
        that.setData({
          screenclass: 'example',
          clearmedia: 'example-box'
        })
      }
    } catch (e) {
      console.log(e)
    }
    let openid = wx.getStorageSync('access_token')
    if (openid == '') {
      that.registerAndLogin()
    } else {
      that.setData({
        token: openid
      })
      that.checkCount()
      that.checkVip()
    }
  },
  onShareAppMessage(){
    return{
      title:'创造是一门艺术',
      path:'pages/index/index',
      imageUrl:'/static/l.png'
    }
  },
  onShareTimeline(){
    return{
      title:'创造是一门艺术',
      path:'pages/index/index'
    }
  },
  onAddToFavorites(){
    return{
      title:'创造是一门艺术',
      path:'pages/index/index'
    }
  },
  onShow(){
    this.setData({
      flag: false, //顶部问题框显示触发按钮
      questiondocker: '',
      timedocker: '',
      responsedocker: '',
      content: '', //获取用户输入
      icon: "/static/icon-send.svg", //发送按钮开关
      resshow: false, //回复文本框显示开关
      copyswitch: false, //显示一键复制开关
      stopswitch: false, // 停止回答开关
      exampleswitch: true,
      timer: ''
    })
    this.checkVip()
  },
  //查试用次数
  checkCount() {
    let that=this
    wx.request({
      url: 'https://www.blackfiresoft.com/textCount/api/select',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openid': that.data.token
      },
      success: (res) => {
        let count = res.data.result.gptCount
        if (count > 0) {
          that.setData({
            hadcount:count
          })
        }
      }
    })
  },
  //查会员信息
  checkVip() {
    wx.request({
      url: 'https://www.blackfiresoft.com/user/vip',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openid': this.data.token
      },
      success: (res) => {
        if (res.data.result!= null) {
          let currentTime=this.getnowtime()
          let expireTime=res.data.result.expireTime
          if(currentTime < expireTime){
            this.setData({
              isvip:1
            })
          }
        }
      }
    })
  },
  getnowtime(){
    let format='yyyy-MM-dd HH:mm:ss'
    let time = Date.parse(new Date())
    let nowdate = new Date(time)
    let year=nowdate.getFullYear()
    let month=nowdate.getMonth()+1
    let day=nowdate.getDate()
    let hour=nowdate.getHours()
    let minute=nowdate.getMinutes()
    let second=nowdate.getSeconds()
    if(minute<10){
      minute="0"+minute
    }
    return format.replace('yyyy',year)
    .replace('MM',month)
    .replace('dd',day)
    .replace('HH',hour)
    .replace('mm',minute)
    .replace('ss',second)
  },
  //根据openid判断用户是否第一次登录,是则注册,否则继续使用
  registerAndLogin() {
    wx.login({
      success: (res) => {
        wx.request({
          url: 'https://www.blackfiresoft.com/user/register',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            'code': res.code
          },
          success: (msg) => {
            let openid = msg.data.result.openid
            let username = msg.data.result.username
            wx.setStorageSync('access_token', openid)
            wx.setStorageSync('username', username)
            this.setData({
              token: openid
            })
            this.checkCount()
            this.checkVip()
          },
          fail(){
            wx.showToast({
              title: '系统繁忙,请稍后再试',
              icon:'loading'
            })
            return false
          }
        })
      },
    })
  }
})