function startupFun(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}`; }; let startup = new Date();
await import('./resources/@export.js'); let e = import.meta.url, ee = e;

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ e, ee, 'msg': `**************** SERVER **************** [${startupFun(startup, new Date())}]`, });

        // RESETAR BADGE
        chromeActions({ e, 'action': 'badge', 'text': '', });

        // ATALHO PRESSIONADO
        chrome.commands.onCommand.addListener(async function (...inf) {
            try {
                // logConsole({ e, ee, 'msg': `ON START: ATALHO PRESSIONADO` })
                if (inf[0] === 'atalho_1') {
                    command1({ 'origin': 'chrome', });

                    // chrome.tabs.executeScript({
                    //     code: `(function () {
                    //             function pw(j, pw, ph, u) {let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; 
                    //             let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
                    //             return j.open(u, '', 'width=' + w + ',height=' + h + ',top=' + y + ',left=' + x); }; pw(window, 30, 35, 'http://127.0.0.1:1234/?act=page&roo=&mes=0'); })();`
                    // });

                } else if (inf[0] === 'atalho_2') { command2(); } else { logConsole({ e, ee, 'msg': `ACAO DO ATALHO NAO DEFINIDA`, }); }
            } catch (catchErr) { await regexE({ inf, 'e': catchErr, }); };
        });

        // *************************

        // CLIENT (NÃO POR COMO 'await'!!!) [MANTER NO FINAL]
        client({ e, }); await new Promise(resolve => { setTimeout(resolve, 500); });

        // CHAMAR PARA DEFINIR A FUNÇÃO
        await chromeActionsNew();


        // let infChromeActionsNew, retChromeActionsNew
        // infChromeActionsNew = { // FILTROS # 'includeChildrens' INCLUIR OS NÃO OS ELEMENTOS FILHOS | 'useCase' CONSIDERAR OU NÃO CASE SENSITIVE
        //     'tags': [
        //         { 'tagName': 'textarea', 'includeChildrens': false, 'useCase': false, },
        //     ],
        //     'attributes': [
        //         { 'attributeName': 'name', 'attributeValue': 'field-6L8VfNKO7NQ', 'includeChildrens': false, 'useCase': false, },
        //     ],
        // }

        // // attributeGetName attributeGetValue elementGetValue elementSetValue elementClick elementGetDiv elementIsHidden elementGetPath elementHighLight
        // infChromeActionsNew.action = 'elementSetValue'; infChromeActionsNew.elementValue = 'TESTE';
        // // infChromeActionsNew.path = '/html/body/div[1]/div/div[4]/div[2]/div[2]/div[1]/div[2]/div/div/div/div/div/div/div/div/div/div[4]/div/div/div/div/div/div[1]/div/div/div/div[1]/div/div/form/div/div/div/div[1]'; // SELECIONAR ELEMENTO PELO PATH

        // // retChromeActionsNew = await chromeActions({ e, 'action': 'inject', 'target': `*page_tryrating.mhtml*`, 'fun': chromeActionsNew, 'funInf': infChromeActionsNew, }); console.log(retChromeActionsNew);

        // let infTryRatingSet, retTryRatingSet
        // infTryRatingSet = { 'hitApp': `BroadMatchRatings`, 'process': `good`, } // good acceptable bad
        // retTryRatingSet = await tryRatingSet(infTryRatingSet); console.log(retTryRatingSet);



        // let message = { fun: [{ securityPass: gW.securityPass, retInf: true, name: 'commandLine', par: { command: 'notepad', awaitFinish: true, action: 'read', path: 'D:/Área de Trabalho/CHAT.txt', }, },], };

        // let infMessageSend, retMessageSend;
        // infMessageSend = { 'destination': '127.0.0.1:8889/?roo=OPSEUA-NODEJS-WEBSOCKET-SERVER', 'message': message, 'secondsAwaita': 2, };
        // // infMessageSend = { 'destination': '22.333.444.555:1234/DESTINO_AQUI', 'message': message, };
        // // infMessageSend = { 'destination': '0.1:1234/DESTINO_AQUI', 'message': message, };
        // // retMessageSend = await messageSend(infMessageSend); console.log(retMessageSend);

        // retMessageSend = await messageSend(infMessageSend); console.log(retMessageSend);




        // // ADICIONAR NOVO CHAVE | SALVAR NO STORAGE
        // let retCS = await configStorage({ e, 'action': 'get', 'key': 'sniffer', }); retCS = retCS.res;
        // retCS.platforms.TryRating[`z_search20Viewport`] = 'teste'; retCS = await configStorage({ e, 'action': 'set', 'key': 'sniffer', 'value': retCS, });


        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


