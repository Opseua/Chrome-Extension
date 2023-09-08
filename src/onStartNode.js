await import('./resources/@functions.js');
console.log('onStartNodeJS');

async function client(inf) {
    let ret = { 'ret': false };

    try {
        let WebS; ret['ret'] = true;
        if (typeof window !== 'undefined') { WebS = window.WebSocket } // CHROME
        else { const { default: WebSocket } = await import('ws'); WebS = WebSocket } // NODEJS

        async function log(inf) {
            let infFile, retFile; const dH = dateHour().res
            const folder = `MES_${dH.mon}_${dH.monNam}`; const text = `DIA_${dH.day} ${dH.hou}:${dH.min}:${dH.sec}:${dH.mil} - ${inf}\n`
            infFile = { 'action': 'write', 'functionLocal': true, 'path': `./log/WebSocket/${folder}/log.txt`, 'rewrite': true, 'text': text }
            retFile = await file(infFile);
        }; log('ONSTART NODEJS: START')

        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const device1 = retConfigStorage.device2.name; const securityPass = retConfigStorage.securityPass

        let ws1;
        async function web1() {
            let ws1 = new WebS(`ws://${wsHost}:${portWebSocket}/${device1}`);
            ws1.onerror = (e) => { log(`ONSTART NODEJS: ONERROR`) };
            ws1.onopen = () => { console.log(`ON START: CONEXAO OK`); log(`ONSTART NODEJS: CONEXAO OK`) }
            ws1.onclose = async (event) => {
                console.log(`ON START: RECONEXAO EM 10 SEGUNDOS`); log(`ONSTART NODEJS: RECONEXAO EM 10 SEGUNDOS`)
                await new Promise(r => setTimeout(r, 10000)); web1()
            }
            ws1.onmessage = async (event) => {
                let data, fun
                try { data = JSON.parse(event.data); if (data.fun) { fun = true } }
                catch (e) { }
                if (fun) {
                    let infWebSocketRet
                    if (data.retWs && data.retWs.res) {
                        infWebSocketRet = { 'data': event.data.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`)) }
                    } else { infWebSocketRet = { 'data': event.data } }; const retWebSocketRet = webSocketRet(infWebSocketRet)
                } else { console.log(`MENSAGEM DO WEBSCKET\n\n${event.data}\n\n`) }
            }
        }
        web1()
    } catch (e) { ret['msg'] = regexE({ 'e': e }).res }

    if (!ret.ret) {
        console.log(ret.msg)
        log(`ONSTART NODEJS: ${ret.msg}`)
        if (typeof window !== 'undefined') { // CHROME
            const infConfigStorage = { 'action': 'del', 'key': 'webSocket' }; const retConfigStorage = await configStorage(infConfigStorage)
        }
    }
}
client()
