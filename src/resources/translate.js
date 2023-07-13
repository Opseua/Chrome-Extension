const { api } = await import('./api.js');

async function translate(inf) {
    const ret = { 'ret': false };

    try {
        const text = 'Olá';
        const infApi = {
            url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`,
            method: 'GET',
            headers: {}
        };

        const retApi = await api(infApi);
        const html = retApi.res;
        const regex = /<div class="result-container">(.*?)<\/div>/;
        const match = html.match(regex);
        if (match && match[1]) {
            ret['ret'] = true;
            ret['msg'] = `TRANSLATE: OK`;
            ret['res'] = match[1];
        } else {
            ret['msg'] = `TRANSLATE: ERRO | TAG NAO ENCONTRADA`;
        }
    } catch (e) {
        ret['msg'] = `TRANSLATE: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { translate }
