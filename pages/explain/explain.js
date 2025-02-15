// pages/explain/explain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  }
})