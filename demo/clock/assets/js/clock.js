class Clock extends MyCan {
    constructor(config = {
        interval: 50, //防止在某些情况下1000毫秒间隔出现误差（计时器性能，或者getTime()parseInt计算不精准）
        textColor: "blue" //默认时钟字体颜色
    }) {
        super(config.el);
        this.config = config;
        this.endTime = config.endTime || null;
        this.ballArray = [];
        this.clockTime = [0, 0, 10, 0, 0, 10, 0, 0] //初始化始终渲染数组 时时 冒号 分分 冒号 秒秒

        window.requestAnimationFrame(this.init.bind(this))
          
    }
    //
    init() {
         const {
             ballArray,
             width
         } = this;
      
        const time = this.endTime ? this.getCurShowTime(this.endTime) : this.getTime();
        const startX = Math.round(width/10); //时钟最左侧坐标
        const startY = 50;
        const r = Math.round(width * 4 / 5 / 108) - 1.8 //半径
        // GC 清楚出了屏幕外的小球实例
        let cnt = 0;
        if (ballArray.length > 1)
            for (let i in ballArray)
                if (ballArray[i].ball.x + ballArray[i].ball.r > 0 && (ballArray[i].ball.x - ballArray[i].ball.r) < width) //还停留在屏幕内小球
                    ballArray[cnt++] = ballArray[i]

        while (ballArray.length > cnt) {
            ballArray.pop()
        }

        for (let i in time) {
            if (time[time.length - i] != this.clockTime[this.clockTime.length - i]) { //秒数不同 发生重绘

                this.clockTime[this.clockTime.length - i] = time[time.length - i]; //更新本次时间

                this.addBall(Math.max(time[time.length - i], 0), startX + (time.length - i) * 15 * (r + 1), startY, r)

            }

        }



        // 重绘
        this.clear();

        for (let i in time) {

            /*Math.max(time[i],0)保证时间最小为0*/
            this.drawDigit(Math.max(time[i], 0), startX + i * 15 * (r + 1), startY,r)
        };

        this.upDataBalls();
        // 重绘

        if (this.isEnded(time) == false) {


            window.requestAnimationFrame(this.init.bind(this))
        } else {
            this.end()
        }
    }
    // 小球动画
    addBall(drawNum, startX, startY, r = 8) {
        console.log(r)
        const {
            ctx,
            width,
            height,
            el
        } = this;
        ctx.beginPath();
        for (let i in digit[drawNum])
            for (let j in digit[drawNum][i]) {
                if (digit[drawNum][i][j] === 1) {
                    //小球颜色
                    const ballColor = [
                        "#33B5E5",
                        "#0099CC",
                        "#AA66CC",
                        "#9933CC",
                        "#99CC00",
                        "#669900",
                        "#FFBB33",
                        "#FF8800",
                        "#FF4444",
                        "#CC0000"
                    ]

                    this.ballArray.push(new Ball({
                        el: this.config.el,
                        ball: {
                            x: startX + 2 * j * (r + 1) + (r + 1),
                            y: startY + 2 * i * (r + 1) + (r + 1),
                            r: r,
                            g: 1 + Math.random(),
                            vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 5,
                            vy: -4,
                            color: ballColor[Math.ceil(Math.random() * 10)],
                        }
                    }))
                }
            }
    }
    // 更新小球的状态
    upDataBalls() {
        for (let i of this.ballArray) {
            i.draw()
            i.update()
        }
    }

    drawDigit(drawNum, startX, startY, r = 8) { //数字  起点x 起点Y 半径F

        const {
            ctx,
            width,
            height
        } = this;

        for (let i in digit[drawNum])
            for (let j in digit[drawNum][i]) {
                if (digit[drawNum][i][j] === 1) {
                    ctx.beginPath()
                    ctx.arc(startX + 2 * j * (r + 1) + (r + 1), startY + 2 * i * (r + 1) + (r + 1), r, 0,
                        Math.PI * 2)
                    ctx.closePath();
                    ctx.fillStyle = this.config.textColor;
                    ctx.fill();


                }
            }


    }
    getTime() { //普通时钟 获取当前时间
        const date = new Date();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        this.second = second; //秒数一旦发生变化就重绘画布
        this.currentTime = [hour, minute, second]; //外部获取显示时间
        return [parseInt(hour / 10), hour % 10, 10, parseInt(minute / 10), minute % 10, 10, parseInt(second /
            10), second % 10];
    }
    getCurShowTime(date) { //获取倒计时差值
        const st = new Date().getTime();
        const et = date.getTime();
        const remainTime = et - st;
        const hour = this.getHour(remainTime);
        const minute = this.getMinutes(remainTime) - hour * 60;
        const second = this.getSeconds(remainTime) - this.getMinutes(remainTime) * 60;

        this.second = second; //秒数一旦发生变化就重绘画布
        this.currentTime = [hour, minute, second]; //外部获取显示时间
        return [Math.floor(hour /
                10), hour % 10, 10, parseInt(minute / 10), minute % 10, 10, parseInt(second / 10),
            second % 10
        ];

    }
    getHour(date) {
        return parseInt(date / (3600000))
    }
    getMinutes(date) {
        return parseInt(date / (60000))
    }
    getSeconds(date) {
        return parseInt(date / (1000))
    }
    isEnded(time) { //查看倒计时是否已经结束
        let flag = false;
        // 冒号为10

        if (parseInt(time.join("")) <= 10001000) flag = true
        return flag
    }
    end() { //倒计时结束
        if (this.config.end && typeof (this.config.end) === "function") {
            this.config.end();
        }
    }
};