// let infFile, retFile
// infFile = { 'action': 'inf' }
// infFile = { 'action': 'write', 'functionLocal': true, 'path': './PASTA/ola.txt', 'rewrite': true, 'text': '1234\n' }
// infFile = { 'action': 'read', 'functionLocal': true, 'path': './PASTA/ola.txt' }
// infFile = { 'action': 'list', 'functionLocal': true, 'path': './PASTA/', 'max': 10 }
// infFile = { 'action': 'change', 'functionLocal': true, 'path': './PASTA/', 'pathNew': './PASTA2/' }
// infFile = { 'action': 'del', 'functionLocal': true, 'path': './PASTA2/' }
// infFile = { 'action': 'md5', 'functionLocal': true, 'path': './ARQUIVO.txt' }
// retFile = await file(infFile);
// console.log(retFile)

async function file(inf) {
    if (eng) { // CHROME
        if (!window.all) {
            await import('./@functions.js')
        }
    } else { // NODEJS
        if (!global.all) {
            await import('./@functions.js')
        }
    }
    let ret = { 'ret': false };
    try { // PASSAR NO jsonInterpret
        if (/\$\[[^\]]+\]/.test(JSON.stringify(inf))) { let rji = await jsonInterpret({ 'json': inf }); if (rji.ret) { rji = JSON.parse(rji.res); inf = rji } }
        if (!inf.action || !['write', 'read', 'del', 'inf', 'relative', 'list', 'change', 'md5'].includes(inf.action)) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'action' \n\n`;
        } else if (typeof inf.functionLocal !== 'boolean' && inf.action !== 'inf' && !inf.path.includes(':')) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'functionLocal' \n\n`
        } else if (inf.action !== 'inf' && (!inf.path || inf.path == '')) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'path' \n\n`
        } else {
            let infFile, retFile, path, retFetch = '', text, jsonFile, functionLocal, fileOk, e, relative, pathFull, relativeParts, retRelative, pathOld, pathNew
            if (inf.action == 'write') { // ########################## WRITE
                if (typeof inf.rewrite !== 'boolean') {
                    ret['msg'] = `\n\n #### ERRO #### FILE WRITE \n INFORMAR O 'rewrite' TRUE ou FALSE \n\n`;
                } else if (!inf.text || inf.text == '') {
                    ret['msg'] = `\n\n #### ERRO #### FILE WRITE \n INFORMAR O 'text' \n\n`;
                } else {
                    text = typeof inf.text === 'object' ? JSON.stringify(inf.text) : inf.text
                    if (inf.path.includes(':')) {
                        path = inf.path;
                        if (eng) {
                            path = path.split(':/')[1]
                        }
                    } else {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal && !eng ? true : false };
                        retFile = await file(infFile);
                        path = retFile.res[0]
                    };
                    if (eng) { // CHROME
                        if (path.includes('%/')) {
                            path = path.split('%/')[1]
                        } else if (path.includes(':')) {
                            path = path.split(':/')[1]
                        } else { path = path };
                        if (inf.rewrite) {
                            try {
                                infFile = { 'action': 'read', 'path': path, 'functionLocal': inf.functionLocal && !eng ? true : false };
                                retFile = await file(infFile);
                                if (retFile.ret) {
                                    retFetch = retFile.res
                                };
                                text = `${retFetch}${text}`
                            } catch (e) { }
                        };
                        let blob = new Blob([text], { type: 'text/plain' });
                        let downloadOptions = { // 'overwrite' LIMPA | 'uniquify' (ADICIONA (1), (2), (3)... NO FINAL)
                            url: URL.createObjectURL(blob), filename: path, saveAs: false, conflictAction: 'overwrite'
                        };
                        chrome.downloads.download(downloadOptions)
                    } else { // NODEJS
                        await _fs.promises.mkdir(_path.dirname(path), { recursive: true });
                        await _fs.promises.writeFile(path, text, { flag: !inf.rewrite ? 'w' : 'a' })
                    };
                    ret['msg'] = `FILE WRITE: OK`
                    ret['ret'] = true;
                }
            } else if (inf.action == 'read') { // ########################## READ
                if (inf.path.includes(':')) {
                    path = inf.path
                } else {
                    infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal };
                    retFile = await file(infFile);
                    path = retFile.res[0]
                };
                if (eng) { // CHROME
                    if (!inf.functionLocal) {
                        path = `file:///${path}`
                    };
                    retFetch = await fetch(path.replace('%', ''));
                    retFetch = await retFetch.text()
                } else { // NODEJS
                    retFetch = await _fs.promises.readFile(path, 'utf8')
                };
                ret['res'] = retFetch;
                ret['msg'] = `FILE READ: OK`;
                ret['ret'] = true;
            } else if (inf.action == 'del' && !eng) { // ########################## DEL
                if (inf.path.includes(':')) {
                    path = inf.path
                } else {
                    infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal };
                    retFile = await file(infFile);
                    path = retFile.res[0]
                };
                async function delP(inf) {
                    try {
                        let s = await _fs.promises.stat(inf);
                        if (s.isDirectory()) {
                            let as = await _fs.promises.readdir(inf);
                            for (let a of as) {
                                let c = _path.join(inf, a);
                                await delP(c)
                            };
                            await _fs.promises.rmdir(inf)
                        } else {
                            await _fs.promises.unlink(inf)
                        };
                        ret['msg'] = `FILE DEL: OK`;
                        ret['ret'] = true;
                    } catch (e) {
                        let m = await regexE({ 'e': e });
                        ret['msg'] = `\n\n #### ERRO #### FILE DEL \n ${m.res} \n\n`
                    }
                };
                await delP(path)
            } else if (inf.action == 'inf') { // ########################## INF
                // [0] config.json | [1] letra | [2] caminho do projeto atual | [3] path download/terminal | [4] arquivo atual
                e = JSON.stringify(new Error().stack).replace('at ', '').replace('run (', '');
                if (conf.length == 1) { // NOME DO PROJETO E TERMINAL
                    if (eng) { // CHROME
                        functionLocal = chrome.runtime.getURL('').slice(0, -1)
                        jsonFile = await fetch(`${functionLocal}/${conf[0]}`);
                        jsonFile = JSON.parse(await jsonFile.text()).conf
                        text = e;
                        let pattern = new RegExp(`at ${functionLocal}/(.*?)\\.js`)
                        let res = text.match(pattern);
                        fileOk = res[1];
                        conf = [conf[0], jsonFile[0], functionLocal, jsonFile[1], fileOk]
                    } else { // NODEJS
                        functionLocal = e.match(/ file:\/\/\/(.*?)\.js:/)[1];
                        fileOk = functionLocal.charAt(0).toUpperCase() + functionLocal.slice(1);
                        async function getRoot(inf) {
                            try {
                                await _fs.promises.access(`${inf}/package.json`);
                                return inf
                            } catch {
                                let p = inf.split('/').slice(0, -1).join('/');
                                return p == inf ? null : getRoot(p)
                            }
                        }; functionLocal = await getRoot(fileOk);
                        fileOk = fileOk.replace(`${functionLocal}/`, ''); jsonFile = await _fs.promises.readFile(`${functionLocal}/${conf}`, 'utf8');
                        jsonFile = JSON.parse(jsonFile).conf
                        conf = [conf[0], jsonFile[0], functionLocal.split(':/')[1], process.cwd().replace(/\\/g, '/').split(':/')[1], `${fileOk}.js`]
                    }
                } else { // NOME DO ARQUIVO
                    text = e;
                    let pattern = new RegExp(`at.*?${eng ? conf[2] : conf[3]}(.*?)\\.js`)
                    let res = text.match(pattern);
                    fileOk = `${res[1].slice(1)}.js`;
                    conf[4] = fileOk
                };
                ret['res'] = conf
                ret['msg'] = `FILE INF: OK`;
                ret['ret'] = true;
            } else if (inf.action == 'relative') { // ########################## RELATIVE
                relative = inf.path;
                function runPath(pp, par) {
                    if (pp.startsWith('./')) {
                        pp = pp.slice(2)
                    } else if (relative.startsWith('/')) {
                        pp = pp.slice(1)
                    }
                    pathFull = conf[par].split('/');
                    relativeParts = pp.split('/');
                    while (pathFull.length > 0 && relativeParts[0] == '..') {
                        pathFull.pop(); relativeParts.shift();
                    }
                    retRelative = pathFull.concat(relativeParts).join('/');
                    if (retRelative.endsWith('/.')) {
                        retRelative = retRelative.slice(0, -2);
                    } else if (retRelative.endsWith('.') || retRelative.endsWith('/')) {
                        retRelative = retRelative.slice(0, -1);
                    };
                    return retRelative
                };
                ret['res'] = [`${eng && inf.functionLocal ? '' : `${conf[1]}:/`}${runPath(inf.path, inf.functionLocal ? 2 : 3)}`]
                ret['msg'] = `FILE RELATIVE: OK`
                ret['ret'] = true;
            } else if (inf.action == 'list' && !eng) { // ########################## LIST
                if (!inf.max || inf.max == '') {
                    ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'max' \n\n`;
                } else {
                    if (inf.path.includes(':')) {
                        path = inf.path
                    } else {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal };
                        retFile = await file(infFile);
                        path = retFile.res[0]
                    };
                    let retFilesList = { 'path': path, 'max': inf.max };
                    function formatBytes(b, d = 2) {
                        if (b == 0) return '0 Bytes'; let i = Math.floor(Math.log(b) / Math.log(1024));
                        return parseFloat((b / Math.pow(1024, i)).toFixed(d < 0 ? 0 : d)) + ' ' + ['bytes', 'KB', 'MB', 'GB'][i];
                    };
                    let iFilesList = 0;
                    async function filesList(inf, files = []) {
                        try {
                            for (let fileOk of _fs.readdirSync(inf.path)) {
                                if (iFilesList >= inf.max) {
                                    break
                                };
                                let name = `${inf.path}/${fileOk}`;
                                try {
                                    if (_fs.statSync(name).isDirectory()) {
                                        filesList({ 'max': inf.max, 'path': name }, files)
                                    } else {
                                        iFilesList++;
                                        let stats = _fs.statSync(name)
                                        let infFile = { 'action': 'md5', 'functionLocal': inf.functionLocal, 'path': name }
                                        let retFile = await file(infFile);
                                        files.push({
                                            'ret': true, 'file': fileOk, 'path': name, 'size': formatBytes(stats.size), 'edit': stats.mtime,
                                            'md5': retFile.ret ? retFile.res : false
                                        })
                                    }
                                } catch (e) {
                                    iFilesList++;
                                    files.push({ 'ret': false, 'file': fileOk, 'path': name, 'e': JSON.stringify(e) })
                                }
                            };
                            return files;
                        } catch (e) {
                            iFilesList++;
                            files.push({ 'ret': false, 'e': JSON.stringify(e) })
                        }
                    };
                    retFilesList = await filesList(retFilesList);
                    ret['res'] = retFilesList;
                    ret['msg'] = `FILE LIST: OK`;
                    ret['ret'] = true;
                }
            } else if (inf.action == 'change') {
                if (!inf.pathNew || inf.pathNew == '') {
                    ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'pathNew' \n\n`;
                } else {
                    if (inf.path.includes(':')) {
                        pathOld = inf.path
                    } else {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal };
                        retFile = await file(infFile); pathOld = retFile.res[0]
                    }; if (inf.pathNew.includes(':')) {
                        pathNew = inf.pathNew
                    } else {
                        infFile = { 'action': 'relative', 'path': inf.pathNew, 'functionLocal': inf.functionLocal };
                        retFile = await file(infFile); pathNew = retFile.res[0]
                    };
                    await _fs.promises.mkdir(_path.dirname(pathNew), { recursive: true });
                    await _fs.promises.rename(pathOld, pathNew);
                    ret['msg'] = `FILE CHANGE: OK`
                    ret['ret'] = true;
                }
            } else if (inf.action == 'md5') { // ########################## READ
                let md5
                if (inf.path.includes(':')) {
                    path = inf.path
                } else {
                    infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal };
                    retFile = await file(infFile);
                    path = retFile.res[0]
                };
                try {
                    md5 = _crypto('md5');
                    let fileContent = await _fs.promises.readFile(path);
                    md5.update(fileContent);
                    md5 = md5.digest('hex')
                    ret['res'] = md5;
                    ret['msg'] = `FILE MD5: OK`;
                    ret['ret'] = true;
                } catch (e) {
                    md5 = false
                    ret['msg'] = e;
                }
            }
        }
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
        window['file'] = file;
    } else { // NODEJS
        global['file'] = file;
    }
}