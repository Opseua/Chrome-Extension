// let infTranslate, retTranslate
// infTranslate = { 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
// retTranslate = await translate(infTranslate);
// console.log(retTranslate)

async function translate(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        let infApi = {
            method: 'GET',
            url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`,
            headers: {}
        };
        let retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
        let res = retApi.body;
        let retRegex = regex({ 'pattern': 'class="result-container">(.*?)</div>', 'text': res });
        if (!retRegex.ret) {
            return ret
        };
        let dom, $
        if (eng) { // CHROME
            dom = new DOMParser().parseFromString(retRegex.res['3'], "text/html").documentElement.textContent
        } else { // NODEJS
            $ = _cheerio.load(retRegex.res['3']);
            dom = _cheerio.load($('body').html())('body').text()
        }
        ret['res'] = dom;
        ret['msg'] = `TRANSLATE: OK`
        ret['ret'] = true;
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['translate'] = translate;
    } else { // NODEJS
        global['translate'] = translate;
    }
}