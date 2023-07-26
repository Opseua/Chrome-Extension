// const { clipboard } = await import('./clipboard.js');
// let infClipboard = { 'value': 'Esse é o valor'};
// clipboard(infClipboard)

async function clipboard(inf) {
  let ret = { 'ret': false };

  let text = inf.value
  try {
    // OBJETO INDENTADO EM TEXTO BRUTO
    if (typeof text === 'object' && text !== null) {
      text = JSON.stringify(text, null, 2);
    }

    const element = document.createElement('textarea');
    element.value = text;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);

    ret['ret'] = true;
    ret['msg'] = 'CLIPBOARD: OK';
  } catch (e) {
    ret['msg'] = `CLIPBOARD: ERRO | ${e}`;
  }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

export { clipboard }

if (typeof window !== 'undefined') { // CHOME
  window['clipboard'] = clipboard;
} else if (typeof global !== 'undefined') { // NODE
  global['clipboard'] = clipboard;
}

