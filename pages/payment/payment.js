// pages/payment/payment.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: '', //加密后的openid
    content1: '开通会员',
    content2: '畅享智能助手',
    btntext: '立即支付',
    payOptions: [{
        'time': '1个月',
        'price': '特价 10元',
        'originprice': '原价20元'
      },
      {
        'time': '3个月',
        'price': '特价 30元',
        'originprice': '原价60元'
      },
      {
        'time': '6个月',
        'price': '特价 50元',
        'originprice': '原价100元'
      },
      {
        'time': '12个月',
        'price': '特价 100元',
        'originprice': '原价188元'
      }
    ],
    currentTab: -1,
    /**生产订单发送的参数 */
    total: 0, //金额
    duration: 0, //会员时长
    payWay: 'jsapi', //支付方式
    payChannel: '微信支付', //支付渠道
    terminal: '小程序', //终端
    descriptions: '会员充值', //商品描述
    /**接受返回的参数 */
    orderNo: '', //系统订单号
    prepayId: '', //服务器返回的prepayid
    orderTime: '', //时间戳
    paySign: '', //支付签名
    nonceStr: '' //随机字符串
  },
  change(e) {
    let idx = e.currentTarget.dataset.index
    this.setData({
      currentTab: idx
    })
    if (idx == 0) {
      this.setData({
        total: 1000,
        duration: 1
      })
    }
    if (idx == 1) {
      this.setData({
        total: 3000,
        duration: 3
      })
    }
    if (idx == 2) {
      this.setData({
        total: 5000,
        duration: 6
      })
    }
    if (idx == 3) {
      this.setData({
        total: 10000,
        duration: 12
      })
    }
  },
  /**
   * 发起下单请求
   */
  prepay() {
    if (this.data.total == 0) {
      wx.showToast({
        title: '请选择金额',
        icon:'none'
      })
    } else {
      wx.request({
        url: 'https://www.blackfiresoft.com/payment/unifiedOrder',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          'token': this.data.token,
          'total': this.data.total,
          'payWay': this.data.payWay,
          'payChannel': this.data.payChannel,
          'terminal': this.data.terminal,
          'descriptions': this.data.descriptions,
          'duration': this.data.duration
        },
        success: (res) => { //获取后台签名数据
          let jsonData = res.data.result
          let prepayid = jsonData.prepayId
          let outTradeNo = jsonData.payOrderNo
          let getTime = jsonData.timeStamp
          let paysign = jsonData.paySign
          let nonstr = jsonData.nonceStr
          this.setData({
            orderNo: outTradeNo,
            prepayId: prepayid,
            orderTime: getTime,
            nonceStr: nonstr,
            paySign: paysign
          })
          //发起支付请求
          this.pay()
        }
      })
    }
  },
  /**
   * 发起支付请求
   */
  pay() {
    wx.requestPayment({
      "timeStamp": this.data.orderTime,
      "nonceStr": this.data.nonceStr,
      "package": this.data.prepayId,
      "signType": "RSA",
      "paySign": this.data.paySign,
      success() {},
      fail() {}
    })
  },
  onShareAppMessage() {
    return {
      title: '创造是一门艺术',
      path: 'pages/index/index',
      imageUrl: '/static/l.png'
    }
  },
  onShareTimeline() {
    return {
      title: '创造是一门艺术',
      path: 'pages/index/index'
    }
  },
  onAddToFavorites() {
    return {
      title: '创造是一门艺术',
      path: 'pages/index/index'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let openid = wx.getStorageSync('access_token')
    this.setData({
      token: openid
    })
  },
})