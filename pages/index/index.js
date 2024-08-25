Page({
    data: {},
    navigateToTopic(event) {
      let topic = event.currentTarget.dataset.topic;
        wx.navigateTo({
            url: `/pages/topic/topic?topic=${topic}`
        });
    },
    navigateToPractice() {
        wx.navigateTo({
            url: '/pages/index/index'
        });
    },
    navigateToRecords() {
        wx.navigateTo({
            url: '/pages/records/records'
        });
    },
    navigateToSettings() {
        wx.navigateTo({
            url: '/pages/settings/settings'
        });
    },

    onShow(){
      if (typeof this.getTabBar === 'function') {
        console.log("切换到tabBar 1");
        this.getTabBar((tabBar) => {
          tabBar.setData({
            active:1
          })
        })
      }
    },

    onLoad(options) {
        //检查是否首次登录系统
        const from = options?.from
        if (from == undefined) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return
        }

        let token = wx.getStorageSync('Token');
        this.setData({
            motto: "" + token
        })

        setTimeout(() => {
            this._loadTopicList();
        }, 1000)
    },

    _loadTopicList(){
        //TODO 加载属于当前用户的话题列表，并显示在界面中
        /*wx.reLaunch({
            url: '/pages/topic/topic'
        })*/
    }
});