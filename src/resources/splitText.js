// let infSplitText, retSplitText
// infSplitText = { 'maxLength': 30, 'text': `Lorem Ipsum is simply dummy text of the printing and typesetting industry` }
// retSplitText = await splitText(infSplitText);
// console.log(retSplitText)

let e = import.meta.url;
async function splitText(inf) {
    let ret = { 'ret': false };
    e = inf && inf.e ? inf.e : e
    try {
        let text = inf.text.replace(/\n/g, '\\n');
        let maxLength = inf.maxLength;
        let chunks = [];
        let currentChunk = '';
        for (let word of text.split(/\s+/)) {
            if (currentChunk.length + word.length > maxLength) {
                chunks.push(currentChunk.trim());
                currentChunk = ''
            }
            currentChunk += (currentChunk ? ' ' : '') + word;
            if (/\n/.test(word)) {
                chunks.push(currentChunk.trim());
                currentChunk = ''
            }
        };
        if (currentChunk) {
            chunks.push(currentChunk.trim())
        };
        ret['res'] = chunks;
        ret['msg'] = 'SPLIT TEXT: OK';
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['splitText'] = splitText;
} else { // NODEJS
    global['splitText'] = splitText;
}
