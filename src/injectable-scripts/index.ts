import {getSelectionAsHTML, writeToClipboard, fileExport, htmlToMd} from "../utils/content";
import MarqueeTool from "../utils/MarqueeTool";


console.log("扩展进程与网页连接建立，注入脚本已加载")

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.group("监听到扩展发送的消息")
        console.log("request", request)
        console.log("sender", sender)
        console.groupEnd()
        const {id, payload} = request
        if (id === "snip") {
            console.log("文件导出")
            // htmlToMd('.markdown-body')

        } else if (id === 'copy-as-md:image') {
            let markdownContent = htmlToMd(payload)
            console.log("复制图片为markdown", markdownContent)
            writeToClipboard(markdownContent)
        } else if (id === 'copy-as-md:link') {
            let markdownContent = htmlToMd(payload)
            console.log("复制链接为markdown", markdownContent)
            writeToClipboard(markdownContent)
        } else if (request.id === 'copy-as-md:selection') {
            let selectedHtml = getSelectionAsHTML()
            let markdownContent = htmlToMd(selectedHtml)
            console.log("复制选中内容为markdown", markdownContent)
            writeToClipboard(markdownContent)
        } else if(id === 'capture'){
            MarqueeTool.init()
        }
        sendResponse({
            status: 'ok',
            payload: ''
        });
    }
);

