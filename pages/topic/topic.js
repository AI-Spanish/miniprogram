import {getWaveResult, postChatMsgToAi,getAiEchoByMsg } from '../../api/topics';

const dayjs = require('dayjs');

Page({
    data: {
      topic: '',      //标题
      messages: [],   //消息流
      inputText: '',  //输入
      isRecording: false,      //是否正在录音

      autosize: {
        minRows: 1,
        maxRows: 5,
      }
    }, 
    innerAudioContext: undefined,
    recorderManager: undefined,

    onLoad(arg) {
      this.setData({ 
        topic: arg.topic,
        isRecording: false
      });

      wx.setNavigationBarTitle({
        title: "话题 " + arg.topic,
      })

      //播放
      this.innerAudioContext = wx.createInnerAudioContext();

      //录音
      this.recorderManager = wx.getRecorderManager();
      this.recorderManager.onStop(res=>{
        this.sendVoice(res)
      });
    },

    onShow(){
      if (typeof this.getTabBar === 'function') {
        console.log("切换到tabBar 1");
        this.getTabBar((tabBar) => {
          tabBar.setData({
            active: 1
          })
        })
      }
    },

    sendVoice(res){
      var that = this;
      console.log(res);
      wx.saveFile({        
        tempFilePath: res.tempFilePath,
        success:(res)=>{
          var inputMp3Path = res.savedFilePath;

          that.setData({
            isRecording: false
          });

          wx.showToast({
            title: '录音完成！',
          })
    
          //刷新列表
          const { messages} = that.data;
          messages.push({ id: Date.now(), user: '我', text: that.formatTxt('[语音]'), type:'say', wav: inputMp3Path});
          that.setData({ messages, inputText: '' });
        }
      });
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

        //1 刷新列表
        messages.push({ id: Date.now(), user: '我', text: this.formatTxt(_inputText), type:'say' });
        this.setData({ messages, inputText: '' });

        //2 把inputText发到服务器，获取echo
        //  使用async是为了使用异步调用，以便让主线程能够先刷新一次列表。也可使用setTimeout(()=>{...},0)语法
        (async ()=>{
            postChatMsgToAi(_inputText).then(res=>{
              console.log(res)  //直接是字符串？？？
              let rt = res
              messages.push({ id: Date.now(), user: '西语AI', text: this.formatTxt(rt), type:'echo' });
              this.setData({ messages });
            }).catch(err=>{
              console.log(err)
              messages.push({ id: Date.now(), user: '西语AI', text: `<div style="display:flex;align-items: center;">服务器不知所踪...<img src="/images/err.jpg" style="height:48px" /></div>`, type:'echo' });
              this.setData({ messages });
            })
          } // end of postChatMsgToAi
        )();  //end of async
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
    onShareAppMessage() {
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
    onIconTap(e){
      let target = e.target;
      let data = target.dataset;
      let id = data.id;     //界面中的消息ID
      let name = data.name; //界面中的图标按钮类型

      //1 从数据集合中线性查找，找到消息ID对应的消息
      const { messages } = this.data;    //数据集合
      let ele = messages.find(e => e.id==id);
      if(ele== undefined){
        return;
      } 

      //2 根据点击图标的类型，分别处理
      if(name=="sound") {
        console.log("点击了声音按钮" + id);
      }else if(name=="wave"){
        console.log("点击了音频按钮" + id);
        getAiEchoByMsg(ele.text).then(res=>{
            console.log(res)
            ele.wav = res;
            this.setData({ messages});
        }).catch(err=>{
            ele.wav = undefined;
            this.setData({ messages});
        }) 
      }else if(name=="play-circle-filled"){
        console.log("点击了播放按钮" + id);
        console.log(ele)
        if(ele.wav==undefined)
            return
        this.innerAudioContext.stop();
        this.innerAudioContext.src = ele.wav;   
        //this.innerAudioContext.src = 'https://www.cambridgeenglish.org/images/153149-movers-sample-listening-test-vol2.mp3';
        //http://downsc.chinaz.net/files/download/sound1/201206/1638.mp3
        //ele.wav=undefined;
        //this.setData({ messages });
        this.innerAudioContext.play();
      }else if(name=="file-copy"){
        console.log(`拷贝内容:${ele.text}`);
        wx.setClipboardData({
          data: `${ele.text}`,
          success(res){
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail(res){}
        })
      }
    },

    //点击 开始录音
    startRecording() {
        this.recorderManager.start({  //
            duration:10000,
            sampleRate:44100,
            numberOfChannels:1,
            encodeBitRate:192000,
            format:'mp3', 
            frameSize:50
        });
        this.setData({ isRecording: true });
    },
    //点击 结束录音
    stopRecording() {
        this.recorderManager.stop();
    }

  });
  