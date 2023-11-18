// let retCommandLine = await commandLine({ 'command': 'notepad' });
// console.log(retCommandLine)

async function commandLine(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (!`rodar no →  NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'executarComando', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let command = inf.awaitFinish ? `${inf.command}` : `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command}`
        await new Promise((resolve) => {
            const child = _exec(command, async (error, stdout, stderr) => {
                if (error) {
                    ret['msg'] = 'COMMAND LINE: ERRO';
                    if (stderr) {
                        ret['res'] = stderr;
                    }
                } else {
                    ret['msg'] = 'COMMAND LINE: OK';
                    if (stdout) {
                        ret['res'] = stdout;
                    }
                    ret['ret'] = true;
                }
                resolve();
                return;
            });
            child.stdout.on('data', (data) => { });
            child.stderr.on('data', (data) => { });
        });
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['commandLine'] = commandLine;
    } else { // NODEJS
        global['commandLine'] = commandLine;
    }
}