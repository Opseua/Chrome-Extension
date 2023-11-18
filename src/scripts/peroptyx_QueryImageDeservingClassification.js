// peroptyx_QueryImageDeservingClassification()

async function peroptyx_QueryImageDeservingClassification(inf) {
    await import('../resources/@functions.js');
    let ret = { 'ret': false };
    try {
        let infNotification, retNotification, retSniffer, retFile
        if (inf.snifferChrome) {
            let gOEve = async (i) => {
                if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
            }; gOAdd(gOEve);
        }; if (inf.logFile) { retFile = await file({ 'action': 'read', 'path': inf.logFile }); retSniffer = JSON.parse(retFile.res) }
        else { retSniffer = JSON.parse(inf.sniffer) }; let query = retSniffer.tasks[0].taskData.query; await clipboard({ 'value': query })
        if (retSniffer.targetLocalIds.length == 1) {
            infNotification = { 'duration': 4, 'icon': './src/media/notification_3.png', 'title': `BLIND`, 'text': `${query}` }
            retNotification = await notification(infNotification)
        } else {
            infNotification = { 'duration': 2, 'icon': './src/media/notification_1.png', 'title': `NÃO BLIND`, 'text': `${query}` }
            // retNotification = await notification(infNotification)
        }; let infChatGpt = {
            'provider': 'ora.ai',
            'input': `Eu preciso identificar se uma consulta que foi feita no Google faz sentido ou não. Com base nos dados que você tem da internet até 2021, só me responda '####SIM####' se fizer sentido ou '####NAO####' caso não faça sentido. A consulta é a seguinte: \n\n '${query}'`
        }; let retChatGpt = await chatGpt(infChatGpt); if (!retChatGpt.ret) {
            infNotification = {
                'duration': 3, 'icon': './src/media/notification_3.png', 'title': `ERRO PESQUISA NO CHATGPT`, 'text': `'ret' → false`
            }; retNotification = await notification(infNotification)
        } else if (!retChatGpt.res.includes('####SIM####') && !retChatGpt.res.includes('####NAO####')) {
            infNotification = {
                'duration': 3, 'icon': './src/media/notification_3.png', 'title': `ERRO CHATGPT`, 'text': `Resposta diferente de 'SIM' ou 'NAO'`
            }; retNotification = await notification(infNotification); console.log(`\n\n@@@\n${retChatGpt.res}\n@@@\n\n`)
        } else if (retChatGpt.res.includes('####NAO####')) {
            infNotification = {
                'duration': 3, 'icon': './src/media/notification_3.png', 'title': query, 'text': `🔵 GIBBERISH`
            }; retNotification = await notification(infNotification)
            let radio = { "other": "peroptyx_QueryImageDeservingClassification", "inf": [2], "res": "🔵 GIBBERISH", "query": query }
            // ws1.send(JSON.stringify(radio))
            let infApi = {
                'method': 'POST', 'url': `http://18.119.140.20:8888/OPSEUA_CHROME/`,
                'headers': { 'accept-language': 'application/json' }, 'body': radio
            }; let retApi = await api(infApi);
        } else {
            // ws1.send(JSON.stringify({ "name": "google", "par": { "search": query } }))
            wsSend(gO.inf.wsArr[0], { "name": "google", "par": { "search": query } })
        }; ret['ret'] = true; ret['msg'] = `PEROPTYX: OK`;
    } catch (e) { let m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (eng) { // CHROME
    window['peroptyx_QueryImageDeservingClassification'] = peroptyx_QueryImageDeservingClassification;
} else { // NODEJS
    // global['peroptyx_QueryImageDeservingClassification'] = peroptyx_QueryImageDeservingClassification;
}