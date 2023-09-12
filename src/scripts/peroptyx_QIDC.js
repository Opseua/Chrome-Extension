// peroptyx_QIDC()

async function peroptyx_QIDC(inf) {
    let ret = { 'ret': false };
    try {
        let infNotification, retNotification, infClipboard, retClipboard, retSniffer, retFile
        if (!inf.server) {
            const gOEve = async (i) => {
                if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
            }; gOAdd(gOEve);
        }
        if (inf.logFile) { retFile = await file({ 'action': 'read', 'path': inf.logFile }); retSniffer = JSON.parse(retFile.res) }
        else { retSniffer = JSON.parse(inf.sniffer) }
        infClipboard = { 'value': retSniffer.tasks[0].taskData.query }
        retClipboard = await clipboard(infClipboard)
        if (retSniffer.targetLocalIds.length == 1) {
            infNotification =
            {
                'duration': 4, 'iconUrl': './src/media/notification_3.png',
                'title': `BLIND`,
                'message': `${retSniffer.tasks[0].taskData.query}`,
            }
            retNotification = await notification(infNotification)
        } else {
            infNotification =
            {
                'duration': 2, 'iconUrl': './src/media/notification_1.png',
                'title': `NÃO BLIND`,
                'message': `${retSniffer.tasks[0].taskData.query}`,
            }
            // retNotification = await notification(infNotification)
        }
        ret['ret'] = true;
        ret['msg'] = `PEROPTYX: OK`;
    } catch (e) { ret['msg'] = regexE({ 'e': e }).res }; if (!ret.ret && ret.msg) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['peroptyx_QIDC'] = peroptyx_QIDC;
} else { // NODEJS
    global['peroptyx_QIDC'] = peroptyx_QIDC;
}