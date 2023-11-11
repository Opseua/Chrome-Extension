async function command1(inf) {
  let ret = { 'ret': false }; try {
    const retPromptChrome = promptChrome(`NOME DO COMANDO`);
    ret['ret'] = true;
    ret['msg'] = `COMMAND 1: OK`;
  } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (dev) { // CHROME
  window['command1'] = command1;
} else { // NODEJS
  // global['command1'] = command1;
}