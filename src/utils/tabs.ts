
async function getCurrentTab(): Promise<chrome.tabs.Tab> {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}


// Sending a request from the extension to a content script
async function sendTabsMessage(message: {}): Promise<any> {
    let currentTab = await getCurrentTab()
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(currentTab.id!, message, {},resolve);
    })
}

export {
    getCurrentTab,
    sendTabsMessage
}
