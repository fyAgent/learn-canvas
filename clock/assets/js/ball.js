// 小球降落
var animation;
class Ball extends MyCan {
    constructor(config) {
        super(config.el);
        this.ball = config.ball;
        this.count = 0; //反弹次数
        this.totalCount = 4;
       
        
        // animation = window.requestAnimationFrame(this.init.bind(this))
    }
    init() {
        // this.draw();
        // const y = this.update();

        // animation = window.requestAnimationFrame(this.init.bind(this))

    }

    draw() {
        return new Promise((res, rej) => {
            const {
                x,
                y,
                r,
                color,
            } = this.ball;
            const {
                ctx
            } = this;

            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = color
            ctx.fill()
            res()
        })

    }
    update() {

        const {
            vx,
            vy,
            g,
            r
        } = this.ball
        this.ball.x += vx;
        this.ball.y += vy;
        this.ball.vy += g;

        if (this.ball.y > this.height - r) {

            this.ball.y = this.height - r;
            this.ball.vy = -this.ball.vy * 0.8;

        }
     
    }


}