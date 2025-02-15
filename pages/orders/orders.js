// pages/orders/orders.js
Page({
  data: {
    token: '',
    icons: '',
    imgpath: '/static/l.png',
    tipimg: '/static/zoro.svg',
    description: '会员支付',
    flag: false,
    tips: '暂无订单',
    orderlist: [],
    nav: ['全部订单', '已支付', '待支付', '已关闭']
  },
  onLoad() {
    let openid = wx.getStorageSync('access_token')
    this.setData({
      token: openid
    })
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
  queryOrders() {
    let that = this
    wx.request({
      url: 'https://www.blackfiresoft.com/PayOrder/selectOrders',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openid': that.data.token
      },
      success(res) {
        let datas = res.data.result
        if (datas != '') {
          that.setData({
            flag: true,
            orderlist: datas
          })
        }else{
          that.setData({
            flag: false
          })
        }
      },
      fail() {
        wx.showToast({
          title: '系统忙碌,请稍后再试',
          icon: 'loading'
        })
      }
    })
  },
  onShow() {
    this.onLoad()
    this.setData({
      flag: false
    })
    this.queryOrders()
  }
})