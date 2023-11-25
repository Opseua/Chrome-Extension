// let infSplitText, retSplitText
// infSplitText = { 'maxLength': 30, 'text': `Lorem Ipsum is simply dummy text of the printing and typesetting industry` }
// retSplitText = await splitText(infSplitText);
// console.log(retSplitText)

async function splitText(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
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
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...(ret.ret && { ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['splitText'] = splitText;
    } else { // NODEJS
        global['splitText'] = splitText;
    }
}