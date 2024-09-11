import {navigationBarHeight} from '../../config/consts'

Page({
    data: {
        records: [],
        series: [
            {data: 20, color: '#7cb5ec'},
            {data: 50, color: '#f7a35c'},
            {data: 78, color: '#834348'},
            {data: 63, color: '#90ed7d'}
        ]
    },
    onLoad() {
        // 假设记录存储在本地存储中
        const records = wx.getStorageSync('records') || [];
        this.setData({
            navigationBarHeight: navigationBarHeight(),
            records
        });
    },

    onShow(){
      if (typeof this.getTabBar === 'function') {
        console.log("切换到tabBar 2");
        this.getTabBar((tabBar) => {
          tabBar.setData({
            active:2
          })
        })
      }
    },

    onReady() {
        this.Draw1();
        this.Draw2();
    },

    navigateToTopic(event) {
        //TODO 该函数需要进行更改
        const topic = event.currentTarget.dataset.topic;
        wx.navigateTo({
            url: `/pages/topic/topic?topic=${topic}`
        });
    },

    CalPieAngle (series) {
        // 计算数据总和
        let count = 0;
        series.forEach((item) => {
            count += item.data;
        });
    
        // 计算出开始的弧度和所占比例
        let startAngle = 0;
        return series.map((item) => {
            item.proportion = item.data / count;
            item.startAngle = startAngle;
            startAngle += 2 * Math.PI * item.proportion;
            return item;
        });
    },

    Draw1() {
        // 获取绘图上下文 context
        var context = wx.createContext();
        // 设置描边颜色
        context.setStrokeStyle("#000000");
        // 设置线宽
        context.setLineWidth(4);

        context.moveTo(50, 70);
        context.lineTo(150, 150);
        context.lineTo(250, 30);
        context.lineTo(350, 120);
        // 对当前路径进行描边
        context.stroke();
        wx.drawCanvas({
            canvasId: 'c1',
            actions: context.getActions()
        });
    },
    Draw2() {
        // 获取绘图上下文 context
        var context = wx.createContext();
        context.setStrokeStyle("#ffffff");
        context.setLineWidth(1);
        let pieSeries = this.CalPieAngle(this.data.series);
        pieSeries.forEach((item) => {
            context.beginPath();
            // 设置填充颜色
            context.setFillStyle(item.color);
            // 移动到原点
            context.moveTo(100, 100);    
            // 绘制弧度
            context.arc(100, 100, 80, item.startAngle, item.startAngle + 2 * Math.PI * item.proportion);
            context.closePath();
            context.fill();
            context.stroke();
        }); 

        wx.drawCanvas({
            canvasId: 'c2',
            actions: context.getActions()
        });
    }
});

