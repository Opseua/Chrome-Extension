// let infSecToHour, retSecToHour
// infSecToHour = 65
// retSecToHour = secToHour(infSecToHour)
// console.log(retSecToHour)

let e = import.meta.url, ee = e;
function secToHour(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let hou = Math.floor(inf / 3600).toString().padStart(2, "0");
        let min = Math.floor((inf % 3600) / 60).toString().padStart(2, "0");
        let sec = (inf % 60).toString().padStart(2, "0");
        ret['res'] = String(`${hou}:${min}:${sec}`)
        ret['msg'] = `SEC TO HOUR: OK` // manter o 'String' para forcar o '0' (zero) na frente → '001'
        ret['ret'] = true;
    } catch (catchErr) {
        (async () => {
            let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
            ret['msg'] = retRegexE.res
        })()
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['secToHour'] = secToHour;
} else { // NODEJS
    global['secToHour'] = secToHour;
}
