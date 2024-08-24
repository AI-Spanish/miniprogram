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

    sendMessage() {
      const { inputText, messages } = this.data;
      let _inputText = inputText.trim();     //截断空格
      if (_inputText) {
        messages.push({ id: Date.now(), user: '我', text: _inputText, type:'say' });
				//TODO 把inputText发到服务器，获取echo
				postChatMsgToAi(_inputText).then(res=>{
          console.log(res)
          let obj = res   //let obj = JSON.parse(res)
					if(obj.code == undefined || obj.code!=200){
              console.log(res.msg)
              messages.push({ id: Date.now(), user: '西语AI', text: res.msg, type:'echo' });
              this.setData({ messages, inputText: '' });
							return
					}
					let rt = obj?.data
					console.log(rt)
					messages.push({ id: Date.now(), user: '西语AI', text: rt, type:'echo' });
					this.setData({ messages, inputText: '' });
				}).catch(err=>{
          console.log(err)
					messages.push({ id: Date.now(), user: '西语AI', text: '出错哦了', type:'echo' });
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
    }
  });
  