await import('../resources/setTag.js');
await import('../scripts/command2.js');

async function apiNewInformation(inf) {
  let ret = { 'ret': false };
  try {
    //console.log('NOVA INFORMACAO: 1');
    const retSetTag = await setTag(inf);
    //console.log('NOVA INFORMACAO: 2');

    if (retSetTag.des == 'chr') {
      //console.log('NOVA INFORMACAO: EXECUTANDO');
      command2(retSetTag);
    }
    ret['ret'] = true;
    ret['msg'] = `API NEW INFORMATION: OK`;

  } catch (e) {
    ret['msg'] = regexE({ 'e': e }).res
  }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

window['apiNewInformation'] = apiNewInformation;





