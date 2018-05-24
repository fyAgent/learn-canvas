class MyCan {
    constructor(el) {
        this.el = document.querySelector(el);
        this.ctx = this.el.getContext("2d");
        this.width = this.el.offsetWidth;
        this.height = this.el.offsetHeight;
    }
    /*
     *   擦除
     */
    clear(ctx) {

        this.ctx.clearRect(0, 0, this.width, this.height)

    }
}