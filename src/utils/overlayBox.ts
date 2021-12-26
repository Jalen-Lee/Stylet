export default class OverlayBox {
    private static instance: OverlayBox | null

    private elem: HTMLElement | undefined

    private id = 'overlay-box'

    private cssText = `
    display:none;
    background-color: rgba(130, 180, 230, 0.5);
    box-sizing: border-box;
    outline: rgb(15, 77, 154) solid 1px;
    position: absolute;
    z-index: 9999;
    height: 1582.84px;
    width: 714px;
    left: 0px;
    top: 0px;
    pointer-events:none;
    `

    constructor() {
        if (!OverlayBox.instance) {
            OverlayBox.instance = this
        }
        return OverlayBox.instance
    }
    public static init() {
        if (!this.instance) {
            this.instance = Reflect.construct(this, [])
            console.log("instance",this.instance);
            this.instance && this.instance.create()
            document.body.addEventListener('mousemove', this.instance!.glide);
            document.body.addEventListener('mouseover', this.instance!.show);
            document.body.addEventListener('mouseleave', this.instance!.hide);
            document.body.addEventListener('click', (e)=>{
                console.log("click");
                this.destroy()
            })
        }
    }

    public static destroy() {
        this.instance!.elem!.remove()
        document.body.removeEventListener('mousemove', this.instance!.glide);
        document.body.removeEventListener('mouseover', this.instance!.show);
        document.body.removeEventListener('mouseleave', this.instance!.hide);
        this.instance = null
    }

    private hide = (e: MouseEvent)=>{
        this.elem && (this.elem.style.display = 'none');
    }

    private show = (e: MouseEvent)=>{

        if (this.elem && this.elem.style.display !== 'block') {
            this.elem.style.display = 'block';
        }
    }

    private glide = (e: MouseEvent)=>{
        let targetEl = e.target as HTMLElement
        let elRect = targetEl.getBoundingClientRect();
        let { width, height, left, top } = elRect
        this.elem && (this.elem.style.cssText += `
        width: ${width}px;
        height: ${height}px;
        top: ${top + window.scrollY}px;
        left: ${left + window.scrollX}px;
        `)
    }

    private create() {
        this.elem = document.createElement('div')
        this.elem.id = this.id
        this.elem.setAttribute('style', this.cssText);
        document.body.appendChild(this.elem);
    }
}
