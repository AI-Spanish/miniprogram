import {navigationBarHeight} from '../../config/consts'

Page({
    data: {
      navigationBarHeight: navigationBarHeight(),
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

        this.setData({
          navigationBarHeight: navigationBarHeight(),
        })

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
            topics: [{
                id: 1,
                label: 'How do you say "where is the bus stop" in spanish?',
                content: 'With these 100+ ChatGPT prompts for Crypo Trading!',
                ico: '/images/1.png'
              },
              {
                id: 2,
                label: 'What are some other orange-coloured foods?',
                content: 'I am not sure what the funniest joke is, but i can try to generate one for you ,Here it is ...',
                ico: '/images/2.png'
              },
              {
                id: 3,
                label: 'How do you say "where is the bus stop" in spanish?',
                content: 'With these 100+ ChatGPT prompts for Crypo Trading! With these 100+ ChatGPT prompts for Crypo Trading! With these 100+ ChatGPT prompts for Crypo Trading! With these 100+ ChatGPT prompts for Crypo Trading! ',
                ico: '/images/3.png'
              },
              {
                id: 4,
                label: 'How do you say "where is the bus stop" in spanish?',
                content: 'I am not sure what the funniest joke is, but i can try to generate one for you ,Here it is ...',
                ico: '/images/4.png'
              },
              {
                id: 5,
                label: 'How do you say "where is the bus stop" in spanish?',
                content: 'I am not sure what the funniest joke is, but i can try to generate one for you ,Here it is ...',
                ico: '/images/5.png'
              }
            ],
            scrollIntoView:"recordBottomScroll"
          }
        );
    },

    onIconTapAdd : function(arg){
      const {topics} = this.data;
      topics.push({
        id: Date.now(),
        label: 'How do you say "where is the bus stop" in spanish?',
        content: 'I am not sure what the funniest joke is, but i can try to generate one for you ,Here it is ...',
        ico: '/images/5.png'
      });
      this.setData({topics,scrollIntoView:""});
      this.setData({scrollIntoView:"recordBottomScroll"});

    },

});