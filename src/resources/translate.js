// const infTranslate = { 'source': 'auto', 'target': 'pt', 'text': 'Hi, what your name?' };
// const retTranslate = await translate(infTranslate)
// console.log(retTranslate)

async function translate(inf) {
    let ret = { 'ret': false };
    try {
        const infApi = {
            url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`,
            method: 'GET',
            headers: {}
        };
        const retApi = await api(infApi);
        if (!retApi.ret) { return ret }

        const res = retApi.res.body;
        const infRegex = { 'pattern': 'class="result-container">(.*?)</div>', 'text': res }
        const retRegex = regex(infRegex)
        if (!retRegex.res.bolean) { return ret }

        ret['ret'] = true;
        ret['msg'] = `TRANSLATE: OK`;
        ret['res'] = retRegex.res.text['3'];
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
    if(!ret.ret) { console.log(ret.msg) }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['translate'] = translate;
} else { // NODEJS
    global['translate'] = translate;
}