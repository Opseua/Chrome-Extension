// {
//     "fun": [{
//         "securityPass": "####################",
//         "funRet": { "retInf": "1111111", "funA": "ARRAY AQUI" },
//         "funRun": { "name": "notification", "par": { "title": "TITULO 1", "text": "TEXTO" } }
//     },
//     {
//         "securityPass": "####################",
//         "funRet": { "retInf": "1111111", "funA": "ARRAY AQUI" },
//         "funRun": { "name": "notification", "par": { "title": "TITULO 1", "text": "TEXTO" } }
//     }]
// }

async function webSocketRet(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) {
            return ret
        } else { retConfigStorage = retConfigStorage.res }
        const data = inf.data; const securityPass = retConfigStorage.securityPass
        let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices; let dev0 = `${url}://${host}:${port}/${dev[0].name}`
        function label(f) { return typeof (dev ? window : global)[f] === 'function' }
        await Promise.all(data.fun.map(async (value, index) => { // --------------------------------------------------
            if (value.securityPass !== securityPass) {
                ret['msg'] = `\n #### SECURITYPASS INCORRETO #### \n\n ${JSON.stringify(data)} \n\n`
            } else if (!label(value.funRun.name)) {
                ret['msg'] = `\n #### FUNCAO '${value.funRun.name}' NAO EXITE #### \n\n ${JSON.stringify(data)} \n\n`
            } else {
                let nameFunc;
                if (dev) { // CHROME
                    nameFunc = window[value.funRun.name]
                } else { // NODEJS
                    nameFunc = global[value.funRun.name]
                }
                let infNameFunc = value.funRun.par, retUrl = false;
                if (value.funRet && value.funRet.retUrl) {
                    retUrl = typeof value.funRet.retUrl === 'boolean' ? inf.wsOrigin : `${value.funRet.retUrl}`
                };
                infNameFunc['retUrl'] = retUrl;
                infNameFunc['retInf'] = value.funRet.retInf ? value.funRet.retInf : undefined;
                let retName = await nameFunc(infNameFunc);
                retName = JSON.stringify(retName)
                if (retUrl && !retName.includes('"msg":"[ENC]')) {
                    retName = !value.funRun.par.devAndFun ? retName : retName.replace('"msg":"', '"msg":"[ENC] ')
                    const send = { 'retInf2': value.funRet.retInf ? value.funRet.retInf : undefined, 'retWs': JSON.parse(retName), 'fun': value.funRet.fun };
                    await wsSend(retUrl, send)
                }; ret['ret'] = true
            } // --------------------------------------------------
        }))
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) {
        const retLog = await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': ret.msg });
        if (dev) { const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' }) } // CHROME
    }; return ret
}

if (dev) { // CHROME
    window['webSocketRet'] = webSocketRet;
} else { // NODEJS
    global['webSocketRet'] = webSocketRet;
}