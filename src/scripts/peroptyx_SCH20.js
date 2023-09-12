// peroptyx_SCH20()

async function peroptyx_SCH20(inf) {
    let ret = { 'ret': false };
    try {
        let infNotification, retNotification, infClipboard, retClipboard, retSniffer, retFile
        if (!inf.server) {
            const gOEve = async (i) => {
                if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
            }; gOAdd(gOEve);
        }
        if (inf.logFile) { retFile = await file({ 'action': 'read', 'path': inf.logFile }); retSniffer = JSON.parse(retFile.res) }
        else { retSniffer = JSON.parse(inf.sniffer) }
        if (!retSniffer.tasks[0].taskData.hasOwnProperty('testQuestionInformation')) {
            infNotification =
            {
                'duration': 1, 'iconUrl': './src/media/notification_3.png',
                'title': `NÃO TEM A RESPOSTA`,
                'message': `Avaliar manualmente`,
            }
            retNotification = await notification(infNotification)
        }
        else {
            const resultList = retSniffer.tasks[0].taskData.resultSet.resultList;
            const testQuestionInformation = retSniffer.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer
            let not = true
            const res = await Promise.all(resultList.map(async (v, index) => {
                const idTask = [v.surveyKeys['193']];
                let resultado = null
                try { resultado = index + 1 } catch (e) { }
                let nome = null
                try { nome = v.value.name } catch (e) { }
                let endereco = null
                try { endereco = v.value.address[0] } catch (e) { }
                let fechado = null
                try { fechado = testQuestionInformation['Closed-DNE'][idTask].closed_dne.value ? 'SIM' : 'NAO' } catch (e) { }
                let relevance = null
                try { relevance = testQuestionInformation.Relevance[idTask].Relevance[0].label } catch (e) { }
                let nameAccurracy = null
                try { nameAccurracy = testQuestionInformation.Data[idTask].Name[0].value } catch (e) { }
                let addressAccurracy = null
                try { addressAccurracy = testQuestionInformation.Data[idTask].Address[0].value } catch (e) { }
                let pinAccurracy = null
                try { pinAccurracy = testQuestionInformation.Data[idTask].Pin[0].value } catch (e) { }
                let comentario = null
                try { comentario = resultList[index].comments } catch (e) { }
                let comentario1, comentario2
                if (comentario) {
                    if (not) {
                        not = false
                        infNotification =
                        {
                            'duration': 1, 'iconUrl': './src/media/icon_4.png',
                            'title': `AGUARDE...`,
                            'message': `Avaliar manualTraduzindo e alterando o comentário`,
                        }
                        retNotification = await notification(infNotification)
                    }

                    const infTranslate1 = { 'source': 'auto', 'target': 'pt', 'text': comentario };
                    const retTranslate1 = await translate(infTranslate1)
                    comentario1 = retTranslate1.res

                    // infTranslate2 = { 'source': 'auto', 'target': 'en', 'text': comentario };
                    // retTranslate2 = await translate(infTranslate2)
                    // comentario2 = retTranslate2.res

                    const infChatGpt = { 'provider': 'ora.ai', 'input': `REWRITE THIS SENTENCE WITH OTHER WORDS, KEEPING THE SAME MEANING:\n\n ${comentario}` }
                    const retChatGpt = await chatGpt(infChatGpt)
                    if (!retChatGpt.ret) {
                        return ret
                    }
                    comentario2 = retChatGpt.res.replace(/\n/g, ' ').replace(/\\"/g, "'");
                }

                return {
                    '1_RESULTADO': resultado,
                    '2_NOME': nome,
                    '3_ENDERECO': endereco,
                    '4_FECHADO': fechado,
                    '5_Relevance': relevance,
                    '6_Name_Accurracy': nameAccurracy,
                    '7_Address_Accurracy': addressAccurracy,
                    '8_Pin_Accurracy': pinAccurracy,
                    //'9_COMENTARIO': comentario,
                    'z': ['x'],
                    '10_COMENTARIO_pt': comentario1,
                    'x': ['x'],
                    '11_COMENTARIO_alterado': comentario2,
                };
            }));

            infNotification =
            {
                'duration': 2, 'iconUrl': './src/media/notification_1.png',
                'title': `CONCLUÍDO: na área de transferência`,
                'message': `${JSON.stringify(res, null, 2)}`,
            }
            retNotification = await notification(infNotification)

            infClipboard = { 'value': JSON.stringify(res, null, 2) }
            retClipboard = await clipboard(infClipboard)
        }
        ret['ret'] = true;
        ret['msg'] = `PEROPTYX: OK`;
    } catch (e) { ret['msg'] = regexE({ 'e': e }).res }; if (!ret.ret && ret.msg) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['peroptyx_SCH20'] = peroptyx_SCH20;
} else { // NODEJS
    global['peroptyx_SCH20'] = peroptyx_SCH20;
}