let e = import.meta.url, ee = e;
async function command1(inf) {
  let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
  try {
    let retPromptChrome = await promptChrome({ 'e': e, 'title': `NOME DO COMANDO` });
    if (!retPromptChrome.ret) { return retPromptChrome }

    if (retPromptChrome.res.includes('https://maps.app.goo.gl/')) {
      // → GERAR O COMENTÁRIO DO 'completeJudge'

      // DEFINIR DESTINO (USUÁRIO 3 DO CHROME)
      let devSendOther, devices = globalWindow.devices[1]; let retChromeActions = await chromeActions({ 'e': e, 'action': 'user' });
      for (let c in devices[1]) { if (c.includes(retChromeActions.res)) { let valor = devices[1][c]; devSendOther = 3; devSendOther = globalWindow.devGet[1].replace(devices[2][valor], devices[2][devSendOther]) } }

      // ENVIAR MENSAGEM COM O COMANDO
      let message = {
        "fun": [{
          "securityPass": globalWindow.securityPass, "retInf": true, "name": "completeJudge",
          "par": { "urlGoogleMaps": retPromptChrome.res, }
        }]
      };
      let retListenerAcionar = await listenerAcionar(`messageSendOrigin_${globalWindow.devGet[1]}`, { 'destination': devSendOther, 'message': message, 'secondsAwait': 0, });
      logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': JSON.stringify(retListenerAcionar) });

      let infNotification, retNotification // 'logFun': true,
      infNotification = {
        'e': e, 'duration': 4, 'icon': `./src/scripts/media/icon_${retListenerAcionar.ret ? 3 : 2}.png`, 'retInf': false,
        'title': `Complete Judge`, 'text': retListenerAcionar.msg,
      };
      retNotification = await notification(infNotification);
    }

    ret['msg'] = `COMMAND 1: OK`;
    ret['ret'] = true;

  } catch (catchErr) {
    let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
    ret['msg'] = retRegexE.res
  };
  return {
    ...({ ret: ret.ret }),
    ...(ret.msg && { msg: ret.msg }),
    ...(ret.res && { res: ret.res }),
  };
}

if (eng) { // CHROME
  window['command1'] = command1;
} else { // NODEJS
  global['command1'] = command1;
}
