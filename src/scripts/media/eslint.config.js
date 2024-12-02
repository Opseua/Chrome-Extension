// ************** VARIÁVEIS NÃO DECLARADAS [globais] **************
let arrGlobal = [
  // FUNÇÃO DE FÁBRICA
  'console', 'setTimeout', 'setInterval', 'clearTimeout', 'AbortController', 'TextEncoder', 'fetch', 'prompt', 'document', 'XPathResult', 'Blob', 'URL', 'DOMParser', 'atob', 'btoa', ,
  'alert',


  'esLintIgnore',
  'window', 'global', 'devSend', 'wsClients', 'wsClientLoc', 'eng', 'engName', 'cng', 'letter', 'conf', 'infGlobal', 'gORem', 'gOAdd', 'csf',
  'gW', 'legacy', 'platforms', 'ori', 'des',

  // VARIÁVEIS DO SISTEMA
  'fileChrome_Extension', 'fileProjetos', 'fileWindows',

  // CHROME
  // ## BIBLIOTECAS / NATIVO
  'chrome',

  // NODEJS
  // ## BIBLIOTECAS / NATIVO
  '_WebSocketServer', '_WebSocket', '_fs', '_path', '_url', '_cheerio', '_clipboard', '_http', '_exec', '_google', '_crypto', '_puppeteer', '_net', '_util', '_getFolderSize',
  'process', 'Buffer', '_parse', '_stackTrace', '_googleapisAuth', '_googleapisSheets',
  // ## VARIÁVEIS
  'cs',
  // ## GLOBAL OBJECT [NOVO]
  'gO', 'gOList',
  // ## FUNÇÕES
  'rateLimiter', 'awaitTimeout',

  // GOOGLE 
  // ## BIBLIOTECAS / NATIVO
  'UrlFetchApp', 'Browser',

  // [Chrome_Extension]
  // → funções globais
  'api', 'chat', 'chromeActions', 'client', 'clipboard', 'commandLine', 'configStorage', 'dateHour', 'devFun', 'file', 'getPath', 'googleSheets', 'googleTranslate', 'htmlToJson',
  'log', 'logConsole', 'logsDelOld', 'messageSend', 'messageReceived', 'notification', 'objFilter', 'regex', 'regexE', 'tabSearch', 'GPT4js', 'listenerAcionar', 'listenerMonitorar',
  'chromeActionsNew', 'funImport', 'funGeneric', 'funLibrary', 'taskInf',
  // scripts
  'background', 'command1', 'command2', 'tryRatingComplete',

  // [WebSocket]
  // → funções globais
  'html', 'messageAction', 'roomParams',

  // [Sniffer_Python]
  // → funções globais
  'ewoq', 'tryRating', 'tryRatingGetResponse', 'performTask',

  // [URA_Reversa]
  // → funções globais
  'leadChangeStatus', 'leadGet', 'leads', 'leadsJsf', 'login',

  // [WebScraper]
  // → funções globais
  'apiCnpj', 'apiNire', 'awaitLoad', 'browsers', 'buttonElement', 'checkPage', 'cookiesGetSet', 'getTextElement', 'imput', 'navigate', 'sendData', 'clientSearch', 'clientGetData', 'clientImput'

];

// ************** VARIÁVEIS NÃO USADAS **************
let arrUnused = [
  // [infNomeFuncao] [infNomeFuncao]
  // 'inf[A-Z0-9].+?', 'ret[A-Z0-9].+?',
  // (for)
  'index', 'value', 'index1', 'value1', 'index2', 'value2', 'index3', 'value3', 'index4', 'value4', 'event',
  // (time)
  'time', 'time1', 'time2', 'hour', 'timeout', 'notificationLegacy',
  'ee',

  // outros
  'dev1', 'dev2', 'dev3', 'dev4', 'lin', 'browser', 'tipo', 'element', 'cookies', '_stackTrace', 'nomeList', 'param1', 'param2', 'ret', 'res', 'host', 'room', 'teste', 'big', 'write',
  'msg', 'sendNtfy', 'e'
];


let arrGlobalObj = {}; for (let variavel of arrGlobal) { arrGlobalObj[variavel] = 'writable'; }

export const jsConfig = [
  {

    languageOptions: {
      globals: arrGlobalObj, // VARIÁVEIS GLOBAIS
    },

    rules: {

      'no-extra-semi': 'off', // PONTO E VÍRGULA
      'no-undef': 'error', // VARIÁVEL NÃO DEFINIDA
      'no-inner-declarations': 'off', // ERRO DE FUNÇÃO NO MEIO DO CÓDIGO
      'no-useless-escape': 'off', // ESCAPE DO REGEX
      'no-empty': 'off', // CHAVE VAZIA → { }
      'no-regex-spaces': 'off', // ESPAÇO NO REGEX
      'no-control-regex': 'off', // DIVISÃO DE COLUNAS NO REGEX
      'no-unreachable': 'off', // CÓDIGO APÓS O RETURN
      'no-constant-condition': 'off', // 'true' DO WHILE
      'no-unused-vars': ['error', { 'varsIgnorePattern': "^(" + arrUnused.join('|') + ")$" }]

    },

  }
];
