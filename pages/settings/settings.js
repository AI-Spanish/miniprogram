Page({
    data: {
      difficulty: '',
      voice: '',
      accent: ''
    },
    onLoad() {
      // 获取之前保存的设置
      const settings = wx.getStorageSync('settings') || {};
      this.setData({
        difficulty: settings.difficulty || '',
        voice: settings.voice || '',
        accent: settings.accent || ''
      });
    },
    onShow(){
      if (typeof this.getTabBar === 'function') {
        console.log("切换到tabBar 3");
        this.getTabBar((tabBar) => {
          tabBar.setData({
            active:3
          })
        })
      }
    },
    onDifficultyChange(e) {
      this.setData({ difficulty: e.detail.value });
      this.saveSettings();
    },
    onVoiceChange(e) {
      this.setData({ voice: e.detail.value });
      this.saveSettings();
    },
    onAccentChange(e) {
      this.setData({ accent: e.detail.value });
      this.saveSettings();
    },
    saveSettings() {
      const settings = {
        difficulty: this.data.difficulty,
        voice: this.data.voice,
        accent: this.data.accent
      };
      wx.setStorageSync('settings', settings);
    }
  });
  