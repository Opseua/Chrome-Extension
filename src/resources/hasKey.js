// let objeto = { 'chave1': { 'chave2': { 'chave3': 'VALOR' } } }; // 'logFun': true,
// let infHasKey, retHaskey
// infHasKey = { 'key': 'chave3', 'obj': objeto };
// retHaskey = hasKey(infHasKey);
// console.log(retHaskey)

function hasKey(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false };
    try {
        function hk(key, obj) {
            if (obj.hasOwnProperty(key)) {
                return true
            };
            for (let prop in obj) {
                if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                    if (hk(key, obj[prop])) {
                        return true
                    }
                }
            };
            return false
        };
        ret['res'] = hk(inf.key, typeof inf.obj === 'object' ? inf.obj : JSON.parse(inf.obj));
        ret['msg'] = `HAS KEY: OK`;
        ret['ret'] = true

        // ### LOG FUN ###
        if (inf.logFun) {
            (async () => {
                let infFile = { 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
                infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
            })()
        }
    } catch (e) {
        (async () => {
            let m = await regexE({ 'e': e });
            ret['msg'] = m.res
        })()
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['hasKey'] = hasKey;
} else { // NODEJS
    global['hasKey'] = hasKey;
}

