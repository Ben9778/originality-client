// pages/topic/topic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disbtn: false, //文本区禁止输入开关
    tips: "建议文本控制在200字以上,不超过1500字",
    flag: false, //清空开关
    content: "", //文本输入区内容
    currentlength: 0, //当前文本长度
    titles: [], //标题列表
    iconbtn: true, //标题区图标显示开关
    titleimage: '/static/title.svg', //标题区图标
    textbtn: false, //标题内容展示开关
    subtext: '快速生成', //快速生成按钮内容开关
    screenclass: '',
    clearmedia: '',
    token: '',
    hadcount:0,
    isvip:0
  },
  //生成标题
  producetitle() {
    if (this.data.hadcount==0 && this.data.isvip==0) {
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
      let text = this.data.content
      if (text == "") {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
      } else {
        this.setData({
          disbtn: true,
          titles: [],
          titleimage: '/static/m.gif',
          subtext: '生成中...'
        })
        this.httpTemplate(text)
      }
    }
  },
  //发送请求
  httpTemplate(doc) {
    wx.request({
      url: 'https://www.blackfiresoft.com/title/generate',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'access_token': this.data.token,
        'doc': doc
      },
      success: (res) => {
        let datas=JSON.parse(res.data.result)
        this.setData({
          hadcount:this.data.hadcount-1,
          iconbtn: false,
          textbtn: true,
          disbtn: false,
          subtext: '快速生成',
          titles: datas.reference_titles
        })
      },
      fail() {
        this.setData({
          titleimage: '/static/title.svg'
        })
        wx.showToast({
          title: '当前系统繁忙,请稍后再试',
          icon: 'loading'
        })
      }
    })
  },
  //清空
  clearword() {
    this.setData({
      content: "",
      flag: false,
      currentlength: 0
    })
  },
  //记录已经输入字数
  countlength(e) {
    const word = e.detail.value
    this.setData({
      content: word,
      flag: true,
      currentlength: word.length
    })
    if (this.data.currentlength == 0) {
      this.setData({
        flag: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this
    try {
      const res = wx.getSystemInfoSync()
      if (res.screenHeight >= 667 || res.screenHeight <= 736) {
        that.setData({
          screenclass: 'lenmedia',
          clearmedia: 'clearmedia'
        })
      }
      if (res.screenHeight > 736) {
        that.setData({
          screenclass: 'len',
          clearmedia: 'clear'
        })
      }
    } catch (e) {
      console.log(e)
    }
    let openid = wx.getStorageSync('access_token')
    that.setData({
      token: openid
    })
    that.checkCount()
    that.checkVip()
  },
  onShow(){
    this.setData({
      disbtn: false, //文本区禁止输入开关
      tips: "建议文本控制在200字以上,不超过1500字",
      flag: false, //清空开关
      content: "", //文本输入区内容
      currentlength: 0, //当前文本长度
      titles: [], //标题列表
      iconbtn: true, //标题区图标显示开关
      titleimage: '/static/title.svg', //标题区图标
      textbtn: false, //标题内容展示开关
      subtext: '快速生成', //快速生成按钮内容开关
    })
    this.checkVip()
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
  //查试用次数
  checkCount() {
    wx.request({
      url: 'https://www.blackfiresoft.com/textCount/api/select',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openid': this.data.token
      },
      success: (res) => {
        let count = res.data.result.titleCount
        if(count>0){
          this.setData({
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
})