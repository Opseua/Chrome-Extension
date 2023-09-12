// const infSplitText = { 'maxLength': 30, 'text': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' }
// const retSplitText = await splitText(infSplitText)
// console.log(retSplitText)

async function splitText(inf) {
    let ret = { 'ret': false }
    try {
        const text = inf.text.replace(/\n/g, '\\n');
        const maxLength = inf.maxLength;
        const chunks = [];
        let currentChunk = '';

        for (let word of text.split(/\s+/)) {
            if (currentChunk.length + word.length > maxLength) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            currentChunk += (currentChunk ? ' ' : '') + word;
            if (/\n/.test(word)) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
        }
        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        ret['ret'] = true;
        ret['msg'] = 'SPLIT TEXT: OK';
        ret['res'] = chunks;

    } catch (e) { ret['msg'] = regexE({ 'e': e }).res }; if (!ret.ret && ret.msg) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['splitText'] = splitText;
} else { // NODEJS
    global['splitText'] = splitText;
}