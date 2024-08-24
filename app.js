// app.js
App({
    onLaunch() {
      // 展示本地存储能力
      const logs = wx.getStorageSync('logs') || [];
      logs.unshift(Date.now());
      wx.setStorageSync('logs', logs);

      //设置导航条的颜色
      wx.setTabBarStyle({
          color:'#999999',
          selectedColor:'#ff0000',
          backgroundColor:'#000000',
          borderStyle:'white'
      })
    },
    globalData: {
      userInfo: null
    }
  });
  