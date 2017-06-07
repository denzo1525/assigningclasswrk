chrome.browserAction.setBadgeBackgroundColor({
    color: [190, 190, 190, 230]
});

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch (message.type) {
            case "setCount":
                chrome.browserAction.setBadgeText({
                    text: "" + message.count
                });
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);
