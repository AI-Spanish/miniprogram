import {login} from '../../api/user'
import {navigationBarHeight} from '../../config/consts'

//微信登录： https://zhuanlan.zhihu.com/p/620589067

Page({
    openId: "",
    data: {
        navigationBarHeight: 0
    },

    onLoad(options) {
      this.setData({
        navigationBarHeight: navigationBarHeight(),
      });
    },

    onShow(){
      if (typeof this.getTabBar === 'function') {
        console.log("切换到tabBar 0");
        this.getTabBar((tabBar) => {
          tabBar.setData({
            active:0
          })
        })
      }
    },

    onClose() {
        this.setData({
        });
    },

    _goAheadToIndexPage(){
        wx.reLaunch({
            url: '/pages/index/index?from=login',
        })
    },
   
    _loginSuccess: function(data) {
        // 保存登录信息
        wx.setStorageSync('token', data.token);
        //wx.setStorageSync('openid', data.openid);

        // 显示提示
        wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000,
            success: res => {
                this._goAheadToIndexPage()
            }
        })
    },

    _loginFail: function(reason, res) {
        console.log(reason,":",res)

        let msg = "服务器提示："
        switch(reason){
            case 1: {
                msg  += JSON.stringify(res)
                break;
            }
            default:{
                msg = `调用出现未知错误[${reason}]，请通知我们，非常感谢！`
            }
        }
        wx.showModal({
            title: '登录失败',
            content: msg,
            showCancel: false,
            confirmText: "确定",
        })
    },

    //用微信登录后台
    wxLogin() {
        login().then(res => {
            if(res?.token==undefined){
                this._loginFail(0,res)
            } else {
                this._loginSuccess(res);
            }
        }).catch(err => {
            this._loginFail(1,err) 
        })
    },

    wxLoginFake() {
        this._loginSuccess(
            {
                token:"12345678"
            }
        );
    }
})
