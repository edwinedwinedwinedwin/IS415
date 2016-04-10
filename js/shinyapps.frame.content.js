function detectFrame() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


function notifyParentFrame(message) {
    if ('parentIFrame' in window) {
        parentIFrame.sendMessage(message, '*');
    }
}