async function model(inf) {
    let ret = { 'ret': false };
    try {
        // CODIGO AQUI
        ret['ret'] = true;
        ret['msg'] = `MODEL: OK`;
        ret['res'] = `resposta aqui`;

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
        ret['msg'] = `\n #### ERRO #### CONFIG SET \n INFORMAR A 'key' \n\n`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['model'] = model;
} else { // NODEJS
    global['model'] = model;
}