// let infTabSearch, retTabSearch; // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
// infTabSearch = { e, 'search': `*google*`, 'openIfNotExist': true, 'active': true, 'pinned': false, 'url': `https://www.google.com/`, };
// retTabSearch = await tabSearch(infTabSearch); console.log(retTabSearch);

let e = import.meta.url, ee = e;
async function tabSearch(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { search, } = inf;

        let result = {};
        if (search === 'ATIVA') { // ATIVA search
            result = await new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true, }, function (tabs) {
                    if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
                        let tab = tabs[0]; let abaInf = { 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned, }; resolve({ 'res': abaInf, });
                    } else { resolve(result); }
                });
            });
        } else {
            result = await new Promise(resolve => {
                chrome.tabs.query({}, function (tabs) {
                    if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
                        let abaInf = tabs.map(function (tab) { return { 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned, }; });
                        resolve({ 'res': abaInf, });
                    } else { resolve(result); }
                });
            });
        };
        if ('res' in result) { // ATIVA ret
            if (search === 'ATIVA') {
                ret['res'] = { 'id': result.res.id, 'title': result.res.title, 'url': result.res.url, 'active': result.res.active, 'index': result.res.index, 'pinned': result.res.pinned, };
            } else if (search === 'TODAS') { // TODAS ret
                ret['res'] = result.res;
            } else if (typeof search === 'number') { // ID ret
                for (let obj of result.res) {
                    let retRegex = regex({ e, 'pattern': search.toString(), 'text': obj.id.toString(), });
                    if (retRegex.ret) { ret['res'] = { 'id': obj.id, 'title': obj.title, 'url': obj.url, 'active': obj.active, 'index': obj.index, 'pinned': obj.pinned, }; break; }
                }
            } else {
                for (let obj of result.res) {
                    let retRegex; retRegex = regex({ e, 'pattern': search, 'text': obj.url, });
                    // URL ret
                    if (retRegex.ret) { ret['res'] = { 'id': obj.id, 'title': obj.title, 'url': obj.url, 'active': obj.active, 'index': obj.index, 'pinned': obj.pinned, }; break; };
                    retRegex = regex({ e, 'pattern': search, 'text': obj.title, });
                    // TITULO ret
                    if (retRegex.ret) { ret['res'] = { 'id': obj.id, 'title': obj.title, 'url': obj.url, 'active': obj.active, 'index': obj.index, 'pinned': obj.pinned, }; break; }
                }
            };
            if ('res' in ret) {
                ret['msg'] = `SEARCH TAB: OK`;
                ret['ret'] = true;
            } else if (typeof search === 'number') {
                ret['msg'] = `TAB SEARCH: ERRO | ABA ID '${search}' NAO ENCONTRADA`;
            } else {
                ret['msg'] = `TAB SEARCH: ERRO | ABA '${search}' NAO ENCONTRADA`;
            }
        } else if (search === 'ATIVA' || search === 'TODAS') {
            ret['msg'] = `TAB SEARCH: ERRO | NENHUM ABA ATIVA`;
        } else {
            ret['msg'] = `TAB SEARCH: ERRO | ABA '${search}' NAO ENCONTRADA`;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }
    if (!ret.ret) {
        if (inf.openIfNotExist) {
            let retOpenTab = await openTab(inf);
            if ('id' in retOpenTab) {
                ret['res'] = retOpenTab;
                ret['msg'] = `SEARCH TAB: OK`;
                ret['ret'] = true;
            } else { ret['msg'] = retOpenTab; }
        }
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

async function openTab(inf = {}) { // NAO USAR
    try {
        let { active, pinned, url, } = inf;

        active = !!active; pinned = !!pinned; url = url || 'https://www.google.com';
        return await new Promise((resolve) => {
            chrome.tabs.create({ url, active, pinned, }, function (novaAba) {
                chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                    if (tabId === novaAba.id && changeInfo.status === 'complete') {
                        chrome.tabs.get(novaAba.id, function (tab) {
                            chrome.tabs.onUpdated.removeListener(listener); resolve({ 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned, });
                        });
                    }
                });
            });
        });
    } catch (catchErr) {
        regexE({ inf, 'e': catchErr, });
    }
};

// CHROME | NODEJS
(eng ? window : global)['tabSearch'] = tabSearch;


