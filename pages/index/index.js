Page({
    data: {
      topics:[]
    },
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

      this.setData({topics:[]})
      setTimeout(() => {
        this._loadTopicList();
    }, 0)
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
    },

    _loadTopicList(){
        //TODO 加载属于当前用户的话题列表，并显示在界面中
        /*wx.reLaunch({
            url: '/pages/topic/topic'
        })*/
        this.setData(
          {
            topics:[
            {id:1, label:'话题1', content:'自我介绍', ico:'/images/1.png'},
            {id:2, label:'话题2', content:'爱好', ico:'/images/2.png'},
            {id:3, label:'话题3', content:'生活日常', ico:'/images/3.png'},
            {id:4, label:'话题4', content:'美食', ico:'/images/4.png'},
            {id:5, label:'话题5', content:'学习和工作', ico:'/images/5.png'}
          ]
          }
        );
    }
});