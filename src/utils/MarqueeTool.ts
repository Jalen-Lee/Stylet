export default class MarqueeTool {
    private static instance: MarqueeTool | null
    private overlayElem: HTMLElement | undefined
    private overlayId = 'overlay-box'
    private tooltipElem: HTMLElement | undefined
    private tooltipId = 'tooltip-box'
    private tooltipPosOffset = 3

    private overlayBoxCssText = `
    display:none;
    background-color: rgba(130, 180, 230, 0.5);
    box-sizing: border-box;
    outline: rgb(15, 77, 154) solid 1px;
    position: absolute;
    z-index: 99999;
    height: 1582.84px;
    width: 714px;
    left: 0px;
    top: 0px;
    pointer-events:none;
    `

    private tooltipCssText = `
    display:none;
    position: absolute;
    left: 0;
    top: 0;
    width: auto;
    height: auto;
    padding: 10px;
    box-sizing: border-box;
    color: #fff;
    background-color: #444;
    z-index: 100000;
    font-size: 12px;
    border-radius: 5px;
    line-height: 20px;
    max-width: 45%;
    pointer-events:none;
    `

    private currTargetEl: HTMLElement | undefined

    constructor() {
        console.log("创建了对象")
        if (!MarqueeTool.instance) {
            MarqueeTool.instance = this
        }
        return MarqueeTool.instance
    }

    public static init() {
        if (!this.instance) {
            this.instance = Reflect.construct(this, [])
            this.instance!.createOverlay()
            this.instance!.createTooltip()
            document.body.addEventListener('mousemove', this.instance!.glide);
            document.body.addEventListener('mouseover', this.instance!.show);
            document.body.addEventListener('mouseleave', this.instance!.hide);
            document.body.addEventListener('click', this.instance!.selected)
        }
    }

    public static destroy() {
        document.body.removeEventListener('mousemove', this.instance!.glide);
        document.body.removeEventListener('mouseover', this.instance!.show);
        document.body.removeEventListener('mouseleave', this.instance!.hide);
        document.body.removeEventListener('click', this.instance!.selected);
        this.instance!.overlayElem!.remove()
        this.instance!.tooltipElem!.remove()
        this.instance!.overlayElem = undefined
        this.instance!.tooltipElem = undefined
        this.instance = null
    }

    private selected = (e: MouseEvent) => {
        if(e.target === this.currTargetEl){
            console.log("click",e.target);
            MarqueeTool.destroy()
        }
    }

    private hide = (e: MouseEvent) => {
        this.overlayElem!.style.display = 'none';
        this.tooltipElem!.style.display = 'none';
    }

    private show = (e: MouseEvent) => {
        if (this.overlayElem!.style.display !== 'block') {
            this.overlayElem!.style.display = 'block';
        }
        if (this.tooltipElem!.style.display !== 'block') {
            this.tooltipElem!.style.display = 'block';
        }
    }

    private glide = (e: MouseEvent) => {
        let targetEl = e.target as HTMLElement
        if(this.currTargetEl !== targetEl){
            this.reloadOverlayBox(targetEl)
        }
        this.reloadTooltip(e)
        this.currTargetEl = targetEl
    }

    private getScrollPos() {
        const ieEdge = !document.all;
        if (!ieEdge) {
            return {
                left: document.body.scrollLeft,
                top: document.body.scrollTop
            };
        } else {
            return {
                left: document.documentElement.scrollLeft,
                top: document.documentElement.scrollTop
            };
        }
    }

    private showAttributes(targetEl: HTMLElement) {
        const nodeName = `<span style="font-weight:bold;">${targetEl.nodeName.toLowerCase()}</span><br/>`;
        const attrArr = Array.from(targetEl.attributes);
        const attributes = attrArr.reduce((attrs, attr) => {
            attrs += `<span style="color:#ffffcc;">${attr.nodeName}</span>="${attr.nodeValue}"<br/>`;
            return attrs;
        }, '');
        return nodeName + attributes;
    }

    private reloadOverlayBox(targetEl: HTMLElement) {
        let { width, height, left, top } = targetEl.getBoundingClientRect();
        this.overlayElem!.style.cssText += `
        width: ${width}px;
        height: ${height}px;
        top: ${top + window.scrollY}px;
        left: ${left + window.scrollX}px;
        `
    }

    private reloadTooltip(e: MouseEvent) {
        const left = e.clientX + this.getScrollPos().left + this.tooltipPosOffset;
        const top = e.clientY + this.getScrollPos().top + this.tooltipPosOffset;
        if(this.currTargetEl !== e.target as HTMLElement){
            this.tooltipElem!.innerHTML = this.showAttributes(e.target as HTMLElement);
        }
        if (left + this.tooltipElem!.offsetWidth > window.innerWidth) {
            this.tooltipElem!.style.left = left - this.tooltipElem!.offsetWidth + 'px';
        } else {
            this.tooltipElem!.style.left = left + 'px';
        }
        this.tooltipElem!.style.top = top + 'px';
    }


    private createOverlay() {
        this.overlayElem = document.createElement('div')
        this.overlayElem.id = this.overlayId
        this.overlayElem.setAttribute('style', this.overlayBoxCssText);
        document.body.appendChild(this.overlayElem);
    }

    private createTooltip() {
        this.tooltipElem = document.createElement('div')
        this.tooltipElem.id = this.tooltipId
        this.tooltipElem.setAttribute('style', this.tooltipCssText);
        document.body.appendChild(this.tooltipElem);
    }
}

