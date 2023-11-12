await import('./resources/@functions.js');
let time = dateHour().res; console.log('onStart', `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`);

if (eng) { // CHROME
    let keys = ['webSocket', 'chatGptOra.aiAAAAA', 'chatGptOpenAi', 'sniffer'];
    for (let key of keys) { let infConfigStorage = { 'action': 'del', 'key': key }; let retConfigStorage = await configStorage(infConfigStorage) }
    await chromeActions({ 'action': 'badge', 'text': '' });
    chrome.downloads.onChanged.addListener(async function (...inf) { // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        if (inf[0].state && inf[0].state.current === 'complete') {
            chrome.downloads.search({ id: inf.id }, async function (inf) {
                if (inf.length > 0) {
                    let d = inf[0]; if (d.byExtensionName === 'BOT' && !d.filename.includes('[KEEP]')) {
                        setTimeout(function () {
                            chrome.downloads.erase({ id: d.id }); console.log('DOWNLOAD REMOVIDO DA LISTA'); URL.revokeObjectURL(d.url)
                        }, 5000);
                    }
                }
            });
        }
    }); chrome.browserAction.onClicked.addListener(async function (...inf) { // ######################### CLICK NO ICONE
        console.log('ON START: ICONE PRESSIONADO'); //chrome.browserAction.setPopup({popup: './popup.html'});
    }); chrome.commands.onCommand.addListener(async function (...inf) { // ######################### ATALHO PRESSIONADO
        let ret = { 'ret': false }; try {
            let infShortcutPressed = { 'shortcut': inf[0] } //console.log('ON START: ATALHO PRESSIONADO')
            if (infShortcutPressed.shortcut == 'atalho_1') { command1(); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK` }
            else if (infShortcutPressed.shortcut == 'atalho_2') {
                let infNotification = { 'duration': 3, 'icon': './src/media/icon_3.png', 'title': `AGUARDE...`, 'text': `Alternando sniffer` }
                let par; let retNotification = await notification(infNotification);
                let infFile = { 'action': 'read', 'path': `${conf[1]}:/ARQUIVOS/Projetos/Sniffer_Python/log/state.txt` };
                let retFile = await file(infFile); par = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`;
                if (retFile.res == 'ON') { par = `${par} "taskkill /IM nodeSniffer.exe /F"` }
                else { par = `${par} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\1_BACKGROUND.exe"` };
                await commandLine({ 'command': par, 'retInf': false })
                ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK`;
            } else if (infShortcutPressed.shortcut == 'atalho_3') { command3(); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK` }
            else { ret['msg'] = `\n #### ERRO #### ON START | ACAO DO ATALHO NAO DEFINIDA \n\n` }
        } catch (e) { let m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
    });
}

async function keepCookieLive(inf) {
    let retGetCookies, infChromeActions, retChromeActions
    let retConfigStorage = await configStorage({ 'action': 'get', 'key': 'chatGptOra.ai' }); retConfigStorage = retConfigStorage.res
    let retTabSearch = await tabSearch({ 'search': '*ora.ai*', 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage.meu });
    chrome.tabs.update(retTabSearch.res.id, { url: retConfigStorage.meu }); await new Promise(resolve => { setTimeout(resolve, 5000) })
    retGetCookies = await getCookies({ 'url': retConfigStorage.meu, 'cookieSearch': '__Secure-next-auth.session-token' });
    if (!retGetCookies.ret) {
        infChromeActions = {
            'id': retTabSearch.res.id, 'action': 'script', 'method': 'xpath', 'execute': 'click',
            'element': `//*[@id="__next"]/div/div/div[2]/div/div[2]/div/div/main/div/div/div/div/div[3]/div/div/div[1]/div/button`
        }; retChromeActions = await chromeActions(infChromeActions); await new Promise(resolve => { setTimeout(resolve, 1500) })
        infChromeActions = {
            'id': retTabSearch.res.id, 'action': 'script', 'method': 'xpath', 'execute': 'click',
            'element': `//*[@id="radix-:r4:"]/div/div/div/a/button`
        }; retChromeActions = await chromeActions(infChromeActions); await new Promise(resolve => { setTimeout(resolve, 1500) })
        infChromeActions = {
            'id': retTabSearch.res.id, 'action': 'script', 'method': 'xpath', 'execute': 'click',
            'element': `//*[@id="__next"]/div/div/div[2]/div[2]/div/main/div/div/button`
        }; retChromeActions = await chromeActions(infChromeActions); await new Promise(resolve => { setTimeout(resolve, 10000) })
        infChromeActions = {
            'id': retTabSearch.res.id, 'action': 'script', 'method': 'xpath', 'execute': 'click',
            'element': `//*[@id="view_container"]/div/div/div[2]/div/div[1]/div/form/span/section/div/div/div/div/ul/li[1]/div/div[1]/div/div[2]/div[2]`
        }; retChromeActions = await chromeActions(infChromeActions); await new Promise(resolve => { setTimeout(resolve, 10000) })
        retGetCookies = await getCookies({ 'url': retConfigStorage.meu, 'cookieSearch': '__Secure-next-auth.session-token' });
    }
    retConfigStorage['cookie'] = retGetCookies.res.concat; let infConfigStorage = { 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage }
    retConfigStorage = await configStorage(infConfigStorage); let send = {
        'fun': [{
            'securityPass': securityPass, 'retInf': false, 'name': 'configStorage', 'par': infConfigStorage
        },
        {
            'securityPass': securityPass, 'retInf': false, 'name': 'log', 'par': { 'folder': 'JavaScript', 'path': `log.txt`, 'text': `keepCookieLive` }
        }]
    }; wsSend(devNodeJS, send);
};

// *************************
async function run(inf) {
    let ret = { 'ret': false };
    try {
        await wsConnect([devChrome, devNodeJS, devBlueStacks,]);

        wsList(devChrome, async (nomeList, par1) => {
            let data = {}; try { data = JSON.parse(par1) } catch (e) { };
            if (data.fun) { // FUN
                let infNewDevFun = { 'data': data, 'wsOrigin': nomeList }
                let retNewDevFun = await devFun(infNewDevFun)
            } else if (data.other) { // OTHER
                // console.log('OTHER', data.other)

                if (data.other == 'keepCookieLive') {
                    await keepCookieLive(); wsSend(nomeList, { 'other': 'OK: keepCookieLive' })
                } else if (data.other == 'TryRating_QueryImageDeservingClassification') {
                    let infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/TryRating/reg.txt' }
                    let retFile = await file(infFile); let old = Number(retFile.res); let now = Number(dateHour().res.tim); let dif = now - old

                    if (dif < 15) { let wait = 15 - dif; let retRandom = await random({ 'min': wait, 'max': wait + 9, 'await': true }) }
                    console.log('FIM', data.inf, '\n', data.res, '\n', data.query)

                    let infTabSearch = { 'search': '*tryrating.com*', 'openIfNotExist': false, 'active': true, 'pinned': false }
                    let retTabSearch = await tabSearch(infTabSearch); if (!retTabSearch.res) { console.log('voltou'); return }
                    let element, action, code, array = data.inf; for (let [index, value] of array.entries()) {
                        await new Promise(resolve => { setTimeout(resolve, 800) });// console.log(`INDEX: ${index} | VALUE: ${value}`)
                        if (index == 0) {
                            if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[1]/label/span[2]` }
                            else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[2]/label/span[2]` }
                            else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[3]/label/span[2]` }
                            else if (value == 4) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[4]/label/span[2]` }
                        } else if (index == 1) {
                            if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[1]/label/span[2]` }
                            else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[2]/label/span[2]` }
                            else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[3]/label/span[2]` }
                        } else if (index == 2) {
                            if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[1]/label/span[2]` }
                            else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[2]/label/span[2]` }
                            else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[3]/label/span[2]` }
                        }; element = `document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
                        action = `.click()`; code = `${element}${action}`
                        let infChromeActions = { 'action': 'script', 'code': code, 'search': retTabSearch.res.id }; let retChromeActions = await chromeActions(infChromeActions)
                    }
                    // ###### SUBMIT (topo)
                    element = `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[2]/button[2]`
                    element = `document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
                    action = `.click()`; code = `${element}${action}`; await new Promise(resolve => { setTimeout(resolve, 800) })
                    let infChromeActions = { 'action': 'script', 'code': code, 'search': retTabSearch.res.id }; let retChromeActions = await chromeActions(infChromeActions)
                    wsSend(nomeList, { 'other': 'OK: TryRating_QueryImageDeservingClassification' })
                }

            } else {
                console.log(`\nMENSAGEM DO WEBSCKET\n\n${par1}\n`)
            }
        });

        ret['ret'] = true
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            let retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` })
        }
    }
}
run()

let infConfigStorage, retConfigStorage;
infConfigStorage = { 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
infConfigStorage = { 'action': 'get', 'key': 'chatGptOra.ai' }
//infConfigStorage = { 'action': 'del', 'key': 'NomeDaChave' }
//retConfigStorage = await configStorage(infConfigStorage); console.log(retConfigStorage)

let infFile, retFile
infFile = { 'action': 'inf' }
infFile = { 'action': 'write', 'functionLocal': false, 'path': './PASTA/ola.txt', 'rewrite': true, 'text': '1234\n' }
infFile = { 'action': 'read', 'functionLocal': false, 'path': './PASTA/ola.txt' }
infFile = { 'action': 'list', 'functionLocal': false, 'path': './PASTA/', 'max': 10 }
infFile = { 'action': 'change', 'functionLocal': false, 'path': './PASTA/', 'pathNew': './PASTA2/' }
infFile = { 'action': 'del', 'functionLocal': false, 'path': './PASTA2/' }
// retFile = await file(infFile); console.log(retFile)

let infChatGpt = { 'provider': 'ora.ai', 'input': `Quanto é 1+1999?` }
//let retChatGpt = await chatGpt(infChatGpt); console.log(retChatGpt)


let infGoogleSheet
infGoogleSheet = {
    'action': 'get',
    'id': '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8',
    'tab': 'CNPJ_DO_DIA',
    'range': 'E1:F1', // PERÍMETRO
    'range': 'E1', // CÉLULA ÚNICA
}
// infGoogleSheet = {
//     'action': 'send',
//     'id': '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8',
//     'tab': 'CNPJ_DO_DIA',
//     'range': 'D', // ÚLTIMA LINHA EM BRANCO DA COLUNA 'D'
//     'range': 'D22', // FUNÇÃO JÁ CALCULA A ÚLTIMA COLUNA DE ACORDO COM O 'values'
//     'values': [['a', 'b', 'c']]
// }
// let retGoogleSheet = await googleSheet(infGoogleSheet)
// console.log(retGoogleSheet)

