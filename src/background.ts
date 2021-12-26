import {sendTabsMessage} from "./utils/tabs";

interface ChromeMessageBody {
    id: string | number,

    [propKey: string]: any
}

chrome.runtime.onConnect.addListener(function (){
    console.log("onConnect")
})

chrome.runtime.onInstalled.addListener(function (){
    console.log("onInstalled")
})

chrome.runtime.onRestartRequired.addListener(function (){
    console.log("onRestartRequired")
})

chrome.runtime.onStartup.addListener(function (){
    console.log("onStartup")
})

chrome.runtime.onSuspend.addListener(function (){
    console.log("onSuspend")
})

chrome.runtime.onSuspendCanceled.addListener(function (){
    console.log("onSuspendCanceled")
})

chrome.runtime.onUpdateAvailable.addListener(function (){
    console.log("onUpdateAvailable")
})

const contexts: chrome.contextMenus.ContextType[] = ['image', 'link', 'selection'];
for (const context of contexts) {
    chrome.contextMenus.create({
        id: `copy-as-md:${context}`,//该项的唯一id，用于在事件处理函数中表示自己
        title: context + "复制为markdown",//要显示的文本
        contexts: [context],//该选项显示的上下文类型
    })
}

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
    let {srcUrl, linkUrl, selectionText, menuItemId} = info
    // 图片资源url
    srcUrl = srcUrl && encodeURI(info.srcUrl!);
    // 链接href
    linkUrl = linkUrl && encodeURI(info.linkUrl!);

    console.log("info", info)
    let htmlContent = '';

    if (typeof info.menuItemId !== "number" && info.menuItemId?.endsWith('image')) {
        htmlContent = `<img alt="" src="${srcUrl}" />`;
        console.log("img", info, htmlContent)
    } else if (typeof info.menuItemId !== "number" && info.menuItemId?.endsWith('link')) {
        htmlContent = `<a href="${linkUrl}">${selectionText || linkUrl}</a>`;
        console.log("href", info, htmlContent)
    }

    let message: ChromeMessageBody = {
        id: menuItemId,
        payload: htmlContent
    }
    console.group("扩展向注入脚本发送消息")
    console.log("message", message)
    console.groupEnd()
    let response = await sendTabsMessage(message)
    console.log("收到响应", response)
})


