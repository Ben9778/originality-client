// pages/myhome/myhome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', //用户id
    vipicon: '/static/vip.svg', //头像处会员图标开关
    tipscontent: '开通会员不限使用次数', //提示会员业务
    btncontent: '立即开通', //开通按钮文本
    chatnum: 0,
    titlenum: 0
  },
  //支付跳转页面
  payment() {
    wx.navigateTo({
      url: '/pages/payment/payment',
    })
  },
  navtoexplain() {
    wx.navigateTo({
      url: '/pages/explain/explain',
    })
  },
  navtofeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },
  navtoequity() {
    wx.navigateTo({
      url: '/pages/equity/equity',
    })
  },
  navtoOrder(){
    wx.navigateTo({
      url: '/pages/orders/orders',
    })
  },
  formattime(){
    let format='yyyy-MM-dd HH:mm:ss'
    let time = Date.parse(new Date())
    let nowdate = new Date(time)
    let year=nowdate.getFullYear()
    let month=nowdate.getMonth()+1
    let day=nowdate.getDate()
    let hour=nowdate.getHours()
    let minute=nowdate.getMinutes()
    let second=nowdate.getSeconds()
    if(day<10){
      day="0"+day
    }
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
  onShow(){
    this.onLoad()
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let openid = wx.getStorageSync('access_token')
    let username = wx.getStorageSync('username')
    this.setData({
      id: username
    })
    /**
     * 根据openid查询会员信息
     */
    wx.request({
        url: 'https://www.blackfiresoft.com/user/vip',
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          'openid': openid
        },
        success: (res) => {
          if (res.data.result != null) {
            let currentTime = this.formattime()
            //比较现在时间和会员到期时间
            let expireTime = res.data.result.expireTime
            console.log(expireTime)
            console.log(currentTime)
            let regTime=expireTime.slice(0,10)
            if (currentTime < expireTime) {
              //会员未到期
              this.setData({
                vipicon: '/static/svip.svg',
                tipscontent: '会员'+regTime+'到期',
                btncontent: '立即续费'
              })
            } else {
              //会员过期
              this.setData({
                vipicon: '/static/vip.svg',
                tipscontent: '您的会员已到期',
                btncontent: '立即开通'
              })
            }
          }
        }
      }),
      /**
       * 根据openid查询试用次数
       */
      wx.request({
        url: 'https://www.blackfiresoft.com/textCount/api/select',
        method: "POST",
        data: {
          'openid': openid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          this.setData({
            chatnum: res.data.result.gptCount,
            titlenum: res.data.result.titleCount
          })
        }
      })
  },
})