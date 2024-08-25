import {postChatMsgToAi} from '../../api/topics';

Page({
    data: {
      topic: '',
      messages: [],
      inputText: '',

      autosize: {
        minRows: 1,
        maxRows: 5,
      }
    }, 
    onLoad(arg) {
      this.setData({ topic: arg.topic });
      wx.setNavigationBarTitle({
        title: "话题 " + arg.topic,
      })
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

    onInput(event) {
      let str  = event.detail.value;
      this.setData({ inputText: str });
    },

    //格式化多行文本
    formatTxt: function(multiLineString){
      return multiLineString.replace(/\n/g, '<br>');
    },

    sendMessage() {
      const { inputText, messages } = this.data;
      let _inputText = inputText.trim();     //截断空格
      if (_inputText) {
        messages.push({ id: Date.now(), user: '我', text: this.formatTxt(_inputText), type:'say' });
				//TODO 把inputText发到服务器，获取echo
				postChatMsgToAi(_inputText).then(res=>{
          console.log(res)
          let obj = res   //let obj = JSON.parse(res)
					if(obj.code == undefined || obj.code!=200){
              console.log(res.msg)
              messages.push({ id: Date.now(), user: '西语AI', text: this.formatTxt(res.msg), type:'echo' });
              this.setData({ messages, inputText: '' });
							return
					}
					let rt = obj?.data
					console.log(rt)
					messages.push({ id: Date.now(), user: '西语AI', text: this.formatTxt(rt), type:'echo' });
					this.setData({ messages, inputText: '' });
				}).catch(err=>{
          console.log(err)
					messages.push({ id: Date.now(), user: '西语AI', text: `<div style="display:flex;align-items: center;">出错了哦...<img src="/images/err.jpg" style="height:48px" /></div>`, type:'echo' });
					this.setData({ messages, inputText: '' });
				}) 
					
      }
    },

    onInputheightChange(e) {
      //console.log("keyboardheight===", e.detail.height);
      this.setData({
        keyboardheight: e.detail.height ? `${e.detail.height + 20}px` : undefined,
      });
    },

    onLineChange(e) {
      //console.log("lineCount: ", e.detail);
    },

    //点击界面中的分享按钮
    onShareAppMessage: function () {
      return {
        title: '转发给朋友', // 自定义转发标题
        path: 'pages/index/index', // 自定义转发路径
        success: function(res) {
          // 转发成功后的回调函数
        },
        fail: function(res) {
          // 转发失败后的回调函数
        }
      }
    },

    //点击界面中的图标（除分享），在此处理相关数据
    onIconTap: function(e){      
      let target = e.target;
      let data = target.dataset;
      let id = data.id;
      let name = data.name;

      if(name=="sound") {
        console.log("点击了声音按钮" + id);
      }else if(name=="wave"){
        console.log("点击了音频按钮" + id);
      }else if(name=="play-circle-filled"){
        console.log("点击了播放按钮" + id);
      }else if(name=="file-copy"){
        console.log("点击了拷贝内容按钮" + id);
      }
    }


  });
  