// await wsConnect([devChrome, devNodeJS,]);
// wsList(devChrome, async (nomeList, par1) => {
//     console.log('MENSAGEM RECEBIDA EM:', nomeList, '→', par1);
// })
// await new Promise(resolve => { setTimeout(resolve, 2000) })
// wsSend(devChrome, 'Essa mensagem está sendo enviada')

// wsList('listener1', async (nomeList, par1, par2) => {
//     console.log('ACIONADO:', nomeList, '→', par1, par2);
// });
// wsList('listener2', async (nomeList, par1, par2) => {
//     console.log('ACIONADO:', nomeList, '→', par1, par2);
// });

// acionarListener('listener1', 'INF1', 'INF2');
// acionarListener('listener2', 'INF1', 'INF2'); 

if (eng) { if (!window.all) { await import('./@functions.js') } } // CHROME
else { if (!global.all) { await import('./@functions.js') } } // NODEJS

async function wsConnect(inf) { return await ws(inf); }
async function wsSend(parametro, message) { return await ws(parametro, message); }
let listeners = {};
function wsList(nomeList, callback) {
    if (!listeners[nomeList]) { listeners[nomeList] = []; } listeners[nomeList].push(callback);
}
function acionarListener(nomeList, par1, par2) {
    if (listeners[nomeList]) { listeners[nomeList].forEach(async (callback) => { await callback(nomeList, par1, par2); }); }
}
async function logWs(inf) { // NODEJS
    if (!eng) { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf }) }
}
let activeSockets = new Map();
async function ws(url, message) {
    if (activeSockets.size == 0) { await logWs('ONSTART NODEJS: START') }
    async function connectToServer(server) {
        return new Promise(resolve => {
            let webSocket = new _WebS(server);
            webSocket.onopen = async (event) => {
                let msgLog = `WS OK:\n${server}`;
                console.log(msgLog.replace('\n', '').replace('ws://', ' '));
                await logWs(msgLog);
                activeSockets.set(server, webSocket); resolve('');
            }
            webSocket.onmessage = (event) => {
                acionarListener(server, event.data);
                // console.log('EVENTO, MENSAGEM RECEBIDA:', server);
            }
            webSocket.onclose = async (event) => {
                activeSockets.delete(server);
                let msgLog = `WS RECONEXAO EM 5 SEGUNDOS:\n${server}`;
                console.log(msgLog.replace('\n', '').replace('ws://', ' '));
                await logWs(msgLog);
                setTimeout(() => { connectToServer(server); }, 5000);
            }
            webSocket.onerror = async (event) => { };
        });
    }
    if (Array.isArray(url)) { // conectar servidores
        let promises = url.map(server => new Promise(resolve => {
            if (!activeSockets.has(server)) {
                connectToServer(server).then(() => { resolve(''); });
            } else {
                resolve('');
            }
        }));
        await Promise.all(promises);
        let time = dateHour().res;
        console.log('wsConnect', `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`);
    } else if (typeof url === 'string') { // ENVIAR MENSAGEM
        return new Promise(async (resolve) => {
            let webSocket = activeSockets.has(url) ? activeSockets.get(url) : new _WebS(url)
            let connected = activeSockets.has(url) ? true : false
            let tentativas = 0, maxTentativas = 10;
            while (tentativas < maxTentativas) {
                if (webSocket.readyState === _WebS.OPEN) {
                    let messageNew = typeof message === 'object' ? JSON.stringify(message) : message
                    let retRegex = regex({ 'pattern': '"retInf":"(.*?)"', 'text': messageNew })
                    let awaitRet = retRegex.res ? retRegex.res['1'] : false
                    webSocket.send(messageNew); // MOSTRAR URL DO WEBSOCKET ATUAL webSocket._url
                    // console.log(`CONECTADO [${connected}]: MENSAGEM ENVIADA`)
                    if (!awaitRet) {
                        if (!connected) {
                            webSocket.close()
                        }
                        // RESPOSTA NECESSÁRIA [NÃO]
                        resolve({ 'ret': true, 'msg': 'WS OK: MENSAGEM ENVIADA' })
                    } else {
                        // console.log(`CONECTADO [${connected}]: AGUARDANDO NOVA MENSAGEM`);
                        let timer;
                        webSocket.onmessage = function (event) {
                            if (event.data.includes(awaitRet)) {
                                // console.log(`CONECTADO [${connected}]: MENSAGEM RECEBIDA`)
                                clearTimeout(timer);
                                if (!connected) {
                                    webSocket.close()
                                    // console.log(`CONECTADO [${connected}]: CONEXÃO ENCERRADA`)
                                }
                                // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [SIM]
                                resolve({ 'ret': true, 'msg': 'WS OK: MENSAGEM RECEBIDA', 'res': event.data })
                            }
                        };
                        timer = setTimeout(() => {
                            // console.log(`CONECTADO [${connected}]: TEMPO EXPIROU`)
                            if (!connected) {
                                webSocket.close()
                                // console.log(`CONECTADO [${connected}]: CONEXÃO ENCERRADA`)
                            }
                            // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [NÃO]
                            resolve({ 'ret': true, 'msg': 'WS OK: TEMPO EXPIROU' })
                        }, 20000);
                    }
                    return;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    tentativas++;
                }
            }
            resolve(false)
        })
    }
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['wsConnect'] = wsConnect;
        window['wsList'] = wsList;
        window['wsSend'] = wsSend;
        window['acionarListener'] = acionarListener;
    } else { // NODEJS
        global['wsConnect'] = wsConnect;
        global['wsList'] = wsList;
        global['wsSend'] = wsSend;
        global['acionarListener'] = acionarListener;
    }
}



















// async function wsConnect(inf) {
//     await import('./@functions.js');
//     let ret = { 'ret': false };
//     try {
//         async function logWs(inf) { // NODEJS
//             if (!eng) {
//                 await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf })
//             }
//         }
//         await logWs('ONSTART NODEJS: START'); let urls = inf; let listeners = {};
//         let createWebSocket = (url) => {
//             let ws = new _WebS(url); ws.onerror = (e) => { };
//             ws.onopen = async () => {
//                 let msgLog = `WS OK:\n${url}`; console.log(msgLog); await logWs(msgLog);
//             }
//             ws.onmessage = (event) => {
//                 let listener = listeners[url]; if (listener && typeof listener === 'function') { listener(event.data) }
//             }
//             ws.onclose = async () => {
//                 let msgLog = `WS RECONEXAO EM 5 SEGUNDOS:\n${url}`;
//                 console.log(msgLog); await logWs(msgLog);
//                 await new Promise(resolve => setTimeout(resolve, (5000)));
//                 createWebSocket(url)
//             }
//             return ws;
//         };
//         let webSockets = urls.map(createWebSocket);
//         let wsSend = (url, message) => {
//             message = typeof message === 'object' ? JSON.stringify(message) : message
//             let ws = webSockets.find(ws => ws.url === url);
//             if (ws) {
//                 ws.send(message)
//             } else {
//                 let ws = new _WebS(url);
//                 ws.onopen = async () => { ws.send(message); ws.close() }
//             }
//         };
//         let wsList = (url, listener) => { listeners[url] = listener };
//         if (eng) { // CHROME
//             window['wsSend'] = wsSend; window['wsList'] = wsList;
//         } else { // NODEJS
//             global['wsSend'] = wsSend; global['wsList'] = wsList;
//         }

//         ret['ret'] = true;
//         ret['res'] = `WSCONNECT: OK`;
//     } catch (e) { let m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
// }

// if (eng) { // CHROME
//     window['wsConnect'] = wsConnect;
// } else { // NODEJS
//     global['wsConnect'] = wsConnect;
// }
