import TurndownService from "turndown";
// @ts-ignore
import * as turndownPluginGfm from 'turndown-plugin-gfm'

// 将当前选中内容转换成html
export function getSelectionAsHTML() {
    const selection = document.getSelection();
    if(!selection || selection.rangeCount === 0) return ''

    let containerTagName = '';

    const selectionRange = selection.getRangeAt(0); // Only consider the first range
    const container = selectionRange.commonAncestorContainer;

    // All of text in container element is selected, then use parents tag
    if (container.textContent && selectionRange.toString().trim() === container.textContent.trim()) {
        // Handle plain text selections where parent is sometimes 'Node' or 'DocumentFragment'
        // Ideally, this should not happen, but text selection in browsers is unpredictable
        if (container instanceof Element) {
            containerTagName = container.tagName.toLowerCase();
        } else {
            containerTagName = 'p';
        }
    }

    const fragment = selectionRange.cloneContents();
    const wrapper = document.createElement('div');
    wrapper.append(fragment);

    // Converts relative links to absolute links (#6)
    wrapper.querySelectorAll('a').forEach(link => link.setAttribute('href', link.href));

    // For tables, remove all immediate child nodes that are not required
    const tables = Array.from( wrapper.querySelectorAll('table'));
    for (const table of tables) {
        const floaters = Array.from(table.children).filter(node => !['THEAD', 'TBODY', 'TR', 'TFOOT'].includes(node.tagName));
        for (const floater of floaters) {
            floater.remove();
        }
    }

    if (containerTagName === '') {
        return wrapper.innerHTML;
    }

    // For preformatted tags, content needs to be wrapped inside `<code>`
    // or it would not be considered as fenced code block
    if (containerTagName === 'pre') {
        // Classes of parent or container node can be used by GFM plugin to detect language
        /*
        * Typescript compile error: Property 'classList' does not exist on type 'Node'
        * https://stackoverflow.com/questions/31106147/typescript-compile-error-property-classlist-does-not-exist-on-type-node
        * */
        const classes = (container.parentNode as HTMLElement || container ).classList.toString();

        return `
			<div class="${classes}">
				<pre><code>${wrapper.innerHTML}</code></pre>
			</div>
		`;
    }

    return '<' + containerTagName + '>' + wrapper.innerHTML + '</' + containerTagName + '>';
}


export function htmlToMd(htmlContent:string) {

    // if (typeof htmlContent === 'string') {
    //     htmlContent = document.querySelector(htmlContent)
    // } else if (!(htmlContent instanceof HTMLElement && htmlContent.nodeType === 1)) {
    //     new Error("参数不正确，必须是DOM实例或者选择器字符串")
    // }

    const turndownService = new TurndownService({
        hr: '-',
        headingStyle: 'atx',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced'
    });

    const {gfm, highlightedCodeBlock, strikethrough, tables, taskListItems} = turndownPluginGfm
    turndownService.keep(['kbd', 'sup', 'sub']); // HTML content to retain in Markdown
    turndownService.use([gfm, highlightedCodeBlock, strikethrough, tables, taskListItems]);
    turndownService.remove('style')
    turndownService.addRule('listItem', {
        filter: 'li',
        replacement: (content, node, options) => {
            content = content
                .replace(/^\n+/, '') // Remove leading newlines
                .replace(/\n+$/, '\n') // Replace trailing newlines with just a single one
                .replace(/\n/gm, '\n    '); // Indent

            let prefix = options.bulletListMarker + ' ';
            const parent = node.parentNode!;
            if (parent.nodeName === 'OL') {
                const start = (parent as HTMLElement).getAttribute('start');
                const index = Array.prototype.indexOf.call(parent.children, node);
                prefix = (start ? Number(start) + index : index + 1) + '. ';
            }

            return (prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : ''));
        }
    });
    // 内容
    return turndownService.turndown(htmlContent);
}

// 将内容写入剪贴板
export function writeToClipboard(value:string){
    const inputElement = document.createElement('textarea');
    document.body.append(inputElement);
    inputElement.value = value;
    // inputElement.focus();
    inputElement.select();
    document.execCommand('Copy');
    inputElement.remove();
}


export function fileExport(content:string, filename:string) {
    // 创建a标签
    let eleLink = document.createElement('a')
    // 设置a标签 download 属性，以及文件名
    eleLink.download = filename
    // a标签不显示
    eleLink.style.display = 'none'
    // 获取字符内容，转为blob地址
    let blob = new Blob([content])
    // blob地址转为URL
    eleLink.href = URL.createObjectURL(blob)
    // a标签添加到body
    document.body.appendChild(eleLink)
    // 触发a标签点击事件，触发下载
    eleLink.click()
    // a标签从body移除
    document.body.removeChild(eleLink)
}
