// let infTabSearch, retTabSearch
// infTabSearch = { 'search': `*google*`, 'openIfNotExist': true, 'active': true, 'pinned': false, 'url': `https://www.google.com/` }
// retTabSearch = await tabSearch(infTabSearch); // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
// console.log(retTabSearch)

let e = import.meta.url;
async function tabSearch(inf) {
    let ret = { 'ret': false };
    e = inf && inf.e ? inf.e : e
    try {
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'tabSearch', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let result = {};
        if (inf.search == 'ATIVA') { // ATIVA search
            result = await new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
                        let tab = tabs[0];
                        let abaInf = { 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned };
                        resolve({ 'res': abaInf })
                    } else { resolve(result) }
                })
            })
        } else {
            result = await new Promise(resolve => {
                chrome.tabs.query({}, function (tabs) {
                    if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
                        let abaInf = tabs.map(function (tab) {
                            return { 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned }
                        })
                        resolve({ 'res': abaInf })
                    } else {
                        resolve(result)
                    }
                })
            })
        };
        if (result.hasOwnProperty('res')) { // ATIVA ret
            if (inf.search == 'ATIVA') {
                ret['res'] = {
                    'id': result.res.id,
                    'title': result.res.title,
                    'url': result.res.url,
                    'active': result.res.active,
                    'index': result.res.index,
                    'pinned': result.res.pinned
                }
            } else if (inf.search == 'TODAS') { // TODAS ret
                ret['res'] = result.res
            } else if (typeof inf.search === 'number') { // ID ret
                for (let obj of result.res) {
                    let infRegex = { 'pattern': inf.search.toString(), 'text': obj.id.toString() };
                    let retRegex = regex(infRegex)
                    if (retRegex.ret) {
                        ret['res'] = {
                            'id': obj.id,
                            'title': obj.title,
                            'url': obj.url,
                            'active': obj.active,
                            'index': obj.index,
                            'pinned': obj.pinned
                        };
                        break
                    }
                }
            } else {
                for (let obj of result.res) {
                    let infRegex, retRegex;
                    infRegex = { 'pattern': inf.search, 'text': obj.url };
                    retRegex = regex(infRegex);
                    if (retRegex.ret) { // URL ret
                        ret['res'] = {
                            'id': obj.id,
                            'title': obj.title,
                            'url': obj.url,
                            'active': obj.active,
                            'index': obj.index,
                            'pinned': obj.pinned
                        };
                        break
                    };
                    infRegex = { 'pattern': inf.search, 'text': obj.title };
                    retRegex = regex(infRegex);
                    if (retRegex.ret) { // TITULO ret
                        ret['res'] = {
                            'id': obj.id,
                            'title': obj.title,
                            'url': obj.url,
                            'active': obj.active,
                            'index': obj.index,
                            'pinned': obj.pinned
                        };
                        break
                    }
                }
            };
            if (ret.hasOwnProperty('res')) {
                ret['msg'] = `SEARCH TAB: OK`
                ret['ret'] = true;
            } else {
                if (typeof inf.search === 'number') {
                    ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA ID '${inf.search}' NAO ENCONTRADA \n\n`
                } else {
                    ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA '${inf.search}' NAO ENCONTRADA \n\n`;
                }
            }
        } else {
            if (inf.search == 'ATIVA' || inf.search == 'TODAS') {
                ret['msg'] = `\n #### ERRO #### SEARCH TAB \n NENHUM ABA ATIVA \n\n`
            } else {
                ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA '${inf.search}' NAO ENCONTRADA \n\n`;
            }
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
        ret['msg'] = retRegexE.res
    }
    if (!ret.ret) {
        if (inf.openIfNotExist) {
            let retOpenTab = await openTab(inf);
            if (retOpenTab.hasOwnProperty('id')) {
                ret['res'] = retOpenTab;
                ret['msg'] = `SEARCH TAB: OK`
                ret['ret'] = true;
            } else { ret['msg'] = retOpenTab }
        }
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

async function openTab(inf) { // NAO USAR
    try {
        let active = inf.active ? true : false;
        let pinned = inf.pinned ? true : false;
        let url = inf.url ? inf.url : 'https://www.google.com';
        return await new Promise((resolve, reject) => {
            chrome.tabs.create({ 'url': url, 'active': active, 'pinned': pinned }, function (novaAba) {
                chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                    if (tabId === novaAba.id && changeInfo.status === 'complete') {
                        chrome.tabs.get(novaAba.id, function (tab) {
                            chrome.tabs.onUpdated.removeListener(listener)
                            resolve({ 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned })
                        })
                    }
                })
            })
        })
    } catch (e) {
        (async () => {
            let retRegexE = await regexE({ 'inf': inf, 'e': e });
            ret['msg'] = retRegexE.res
        })()
    }
};

if (eng) { // CHROME
    window['tabSearch'] = tabSearch;
} else { // NODEJS
    global['tabSearch'] = tabSearch;
}

