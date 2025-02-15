// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    phone: '',
    token: ''
  },
  gettext(e) {
    const message = e.detail.value
    this.setData({
      text: message
    })
  },
  getphone(e) {
    const telphone = e.detail.value
    this.setData({
      phone: telphone
    })
  },
  sublime() {
    if (this.data.text != '' && (/^1[34578]\d{9}$/).test(this.data.phone)) {
      wx.request({
        url: 'https://www.blackfiresoft.com/feedback/save',
        method: 'POST',
        data: {
          'openid': this.data.token,
          'message': this.data.text,
          'telNumber': this.data.phone
        },
        success(res) {
          if (res.data.code == '0') {
            wx.showToast({
              title: '反馈成功',
              icon: 'success'
            })
          }
        },
        fail() {
          wx.showToast({
            title: '系统繁忙,请稍后再试',
            icon: 'none'
          })
        }
      })
    }
    if(this.data.text==''){
      wx.showToast({
        title: '请填写反馈内容',
        icon:'none'
      })
    }
    if(!(/^1[34578]\d{9}$/.test(this.data.phone))){
      wx.showToast({
        title: '请填写正确手机号码',
        icon:'none'
      })
    }
    if(this.data.text==''&&this.data.phone==''){
      wx.showToast({
        title: '请填写内容和手机号码',
        icon:'none'
      })
    }
  },
  onLoad() {
    let openid = wx.getStorageSync('access_token')
    this.setData({
      token: openid
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
  onShow() {
    this.setData({
      text: '',
      phone: '',
    })
  }
})