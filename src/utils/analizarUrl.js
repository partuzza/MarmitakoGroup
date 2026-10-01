// ES: Análisis heurístico de URLs: todo ocurre en el navegador, no se envía nada a ningún servidor.
//     No es infalible: sirve para enseñar las señales de alarma más comunes.
//     Cada señal devuelve una «clave» que se traduce en la vista (ver src/i18n).
// EN: Heuristic URL analysis: everything runs in the browser, nothing is sent to any server.
//     It's not foolproof: it's meant to teach the most common red flags.
//     Each signal returns a «clave» (key) that is translated in the view (see src/i18n).

// ES: marca → dominios oficiales
// EN: brand → official domains
const MARCAS = {
  paypal: ['paypal.com', 'paypal.es', 'paypal.me'],
  amazon: ['amazon.es', 'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr'],
  netflix: ['netflix.com'],
  apple: ['apple.com', 'icloud.com'],
  icloud: ['icloud.com', 'apple.com'],
  microsoft: ['microsoft.com', 'live.com', 'outlook.com', 'office.com', 'microsoftonline.com'],
  outlook: ['outlook.com', 'live.com', 'office.com'],
  google: ['google.com', 'google.es', 'gmail.com', 'youtube.com'],
  gmail: ['gmail.com', 'google.com'],
  instagram: ['instagram.com'],
  facebook: ['facebook.com', 'fb.com'],
  whatsapp: ['whatsapp.com', 'whatsapp.net'],
  tiktok: ['tiktok.com'],
  spotify: ['spotify.com'],
  steam: ['steampowered.com', 'steamcommunity.com'],
  binance: ['binance.com'],
  santander: ['bancosantander.es', 'santander.com'],
  bbva: ['bbva.es', 'bbva.com'],
  caixabank: ['caixabank.es', 'caixabank.com'],
  kutxabank: ['kutxabank.es'],
  sabadell: ['bancsabadell.com'],
  ingdirect: ['ing.es'],
  bizum: ['bizum.es'],
  correos: ['correos.es', 'correos.com'],
  seur: ['seur.com'],
  dhl: ['dhl.com', 'dhl.es'],
  agenciatributaria: ['agenciatributaria.gob.es', 'agenciatributaria.es'],
  seguridadsocial: ['seg-social.es', 'seguridadsocial.gob.es'],
  dgt: ['dgt.es'],
}
const OFICIALES = new Set(Object.values(MARCAS).flat())

const ACORTADORES = new Set(['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly', 'ow.ly', 'rebrand.ly', 'shorturl.at', 'tiny.cc', 'rb.gy', 't.ly', 'bl.ink', 'buff.ly', 'lnkd.in', 's.id', 'v.gd'])

const TLD_RIESGO = new Set(['zip', 'mov', 'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'click', 'country', 'work', 'support', 'rest', 'cam', 'icu', 'buzz', 'live', 'shop', 'online', 'site', 'club', 'info', 'monster', 'sbs', 'cfd', 'lol'])

// ES: Servicios gratuitos de alojamiento muy usados para montar webs falsas rápidas
// EN: Free hosting services often used to quickly set up fake websites
const HOSTING_GRATIS = ['000webhostapp.com', 'weebly.com', 'wixsite.com', 'firebaseapp.com', 'web.app', 'netlify.app', 'vercel.app', 'github.io', 'glitch.me', 'repl.co', 'pages.dev', 'blogspot.com', 'sites.google.com', 'ngrok.io', 'ngrok-free.app', 'trycloudflare.com']

// ES: Palabras gancho típicas de los mensajes de phishing (en castellano e inglés)
// EN: Typical bait words in phishing messages (in Spanish and English)
const PALABRAS = ['login', 'signin', 'logon', 'verify', 'verifica', 'secure', 'seguro', 'account', 'cuenta', 'update', 'actualiza', 'bloque', 'suspend', 'confirm', 'password', 'contrasena', 'banking', 'wallet', 'premio', 'gratis', 'reembolso', 'factura', 'paquete', 'envio', 'multa', 'devolucion', 'urgente', 'recover', 'unlock', 'validar']

// ES: Sustituciones típicas para engañar a la vista: paypa1, g00gle, arnazon...
// EN: Typical substitutions to trick the eye: paypa1, g00gle, arnazon...
const DESCONFUNDIR = [[/0/g, 'o'], [/1/g, 'l'], [/3/g, 'e'], [/4/g, 'a'], [/5/g, 's'], [/7/g, 't'], [/rn/g, 'm'], [/vv/g, 'w'], [/cl/g, 'd'], [/i/g, 'l']]

// ES: Segundos niveles que forman parte de la extensión (gob.es, co.uk...)
// EN: Second levels that are part of the extension (gob.es, co.uk...)
const SLD_DOBLES = ['co', 'com', 'gob', 'org', 'net', 'ac', 'edu', 'gov']

export function dominioRegistrado(host) {
  if (esIp(host)) return host
  const partes = host.split('.')
  const n = partes.length
  if (n <= 2) return host
  // ES: Casos tipo agenciatributaria.gob.es o bbc.co.uk
  // EN: Cases like agenciatributaria.gob.es or bbc.co.uk
  if (SLD_DOBLES.includes(partes[n - 2]) && partes[n - 1].length === 2) return partes.slice(-3).join('.')
  return partes.slice(-2).join('.')
}

// ES: IPv4, IPv6 o IP escrita en hexadecimal/decimal para disimular
// EN: IPv4, IPv6 or an IP written in hex/decimal to disguise it
function esIp(host) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || /^0x[0-9a-f]+$/i.test(host) || /^\d{8,10}$/.test(host) || host.startsWith('[')
}

// ES: Limpia el texto, reactiva enlaces desactivados (hxxp, [.]) y añade protocolo si falta
// EN: Cleans the text, re-enables defanged links (hxxp, [.]) and adds a protocol if missing
function normalizar(texto) {
  let t = texto.trim().replace(/^hxxps?/i, (m) => m.replace(/xx/i, 'tt')).replace(/\[\.\]/g, '.')
  if (!t) return null
  if (!/^[a-z][a-z0-9+.-]*:/i.test(t)) t = 'http://' + t
  return t
}

// ES: Distancia de Levenshtein: cuántas letras hay que cambiar para pasar de a a b
// EN: Levenshtein distance: how many letters must change to turn a into b
function distancia(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return d[a.length][b.length]
}

// ES: Detecta si el dominio se hace pasar por una marca conocida
// EN: Detects whether the domain is pretending to be a well-known brand
function buscarSuplantacion(host, dominio) {
  if (OFICIALES.has(dominio)) return null
  const limpio = DESCONFUNDIR.reduce((t, [re, r]) => t.replace(re, r), host)
  const trozos = host.split(/[.-]/).filter((t) => t.length >= 4)

  for (const [marca, oficiales] of Object.entries(MARCAS)) {
    if (host.includes(marca)) {
      return { peso: 5, clave: 'suplanta', params: { marca, oficial: oficiales[0] } }
    }
    const marcaLimpia = DESCONFUNDIR.reduce((t, [re, r]) => t.replace(re, r), marca)
    if (limpio.includes(marcaLimpia)) {
      return { peso: 5, clave: 'trucadas', params: { marca } }
    }
    if (marca.length >= 5 && trozos.some((t) => Math.abs(t.length - marca.length) <= 1 && distancia(t, marca) === 1)) {
      return { peso: 5, clave: 'unaLetra', params: { marca } }
    }
  }
  return null
}

// ES: Divide la URL en trozos para pintarla por colores y que se vea cuál es el dominio real
// EN: Splits the URL into parts so it can be coloured and the real domain stands out
function trocear(url, dominio) {
  const host = url.hostname
  const partes = [{ tipo: 'protocolo', texto: url.protocol + '//' }]
  if (url.username) partes.push({ tipo: 'engano', texto: url.username + (url.password ? ':' + url.password : '') + '@' })
  const sub = dominio && host.endsWith(dominio) ? host.slice(0, host.length - dominio.length) : ''
  if (sub) partes.push({ tipo: 'subdominio', texto: sub })
  partes.push({ tipo: 'dominio', texto: sub ? dominio : host })
  if (url.port) partes.push({ tipo: 'resto', texto: ':' + url.port })
  const resto = url.pathname + url.search + url.hash
  if (resto && resto !== '/') partes.push({ tipo: 'resto', texto: resto })
  return partes
}

// ES: Función principal. Devuelve { valido, dominio, puntos, nivel, alertas, buenas, partes }
// EN: Main function. Returns { valido, dominio, puntos, nivel, alertas, buenas, partes }
export function analizarUrl(entrada) {
  const texto = normalizar(entrada)
  if (!texto) return null

  if (/^(javascript|data|vbscript|file):/i.test(texto)) {
    return resultado(entrada, null, [{ peso: 10, clave: 'codigo' }], [], [])
  }

  let url
  try {
    url = new URL(texto)
  } catch {
    return { valido: false }
  }
  if (!url.hostname.includes('.') && !url.hostname.startsWith('[') && !/^\d+$/.test(url.hostname)) return { valido: false }

  const alertas = []
  const buenas = []
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  const dominio = dominioRegistrado(host)
  const nombre = dominio.split('.')[0]
  const tld = host.split('.').pop()
  const completo = decodeURIComponent(url.href).toLowerCase()

  if (url.protocol === 'https:') buenas.push({ clave: 'https' })
  else if (url.protocol === 'http:') alertas.push({ peso: 1, clave: 'sinHttps' })
  else alertas.push({ peso: 2, clave: 'protocolo', params: { protocolo: url.protocol } })

  if (esIp(host)) {
    alertas.push({ peso: 4, clave: 'ip' })
  }

  if (url.username || url.password) {
    alertas.push({ peso: 4, clave: 'arroba', params: { host } })
  }

  if (host.split('.').some((p) => p.startsWith('xn--'))) {
    alertas.push({ peso: 4, clave: 'punycode' })
  }

  const suplantacion = buscarSuplantacion(host, dominio)
  if (suplantacion) alertas.push(suplantacion)
  else if (OFICIALES.has(dominio)) buenas.push({ clave: 'oficial' })

  if (/(^|[.-])(https?|www)[.-]/.test(host.replace(/^www\./, '')) || /https?/.test(nombre)) {
    alertas.push({ peso: 2, clave: 'httpEnDominio' })
  }

  if (ACORTADORES.has(host)) {
    alertas.push({ peso: 2, clave: 'acortador' })
  }

  const hosting = HOSTING_GRATIS.find((h) => host === h || host.endsWith('.' + h))
  if (hosting) {
    alertas.push({ peso: 2, clave: 'hosting', params: { hosting } })
  }

  if (TLD_RIESGO.has(tld)) {
    alertas.push({ peso: 2, clave: 'tld', params: { tld } })
  }

  const subdominios = esIp(host) ? 0 : host.split('.').length - dominio.split('.').length - (host.startsWith('www.') ? 1 : 0)
  if (subdominios >= 3) {
    alertas.push({ peso: 2, clave: 'subdominios', params: { n: subdominios } })
  }

  const guiones = (nombre.match(/-/g) || []).length
  if (guiones >= 2) {
    alertas.push({ peso: 1, clave: 'guiones' })
  }

  if (!esIp(host) && (nombre.match(/\d/g) || []).length >= 4) {
    alertas.push({ peso: 1, clave: 'numeros' })
  }

  const redireccion = [...url.searchParams.values()].find((v) => /^(https?:)?\/\//i.test(v) || /^https?%3a/i.test(v))
  if (redireccion) {
    alertas.push({ peso: 2, clave: 'redireccion' })
  }

  const encontradas = PALABRAS.filter((p) => completo.includes(p))
  if (encontradas.length && !OFICIALES.has(dominio)) {
    alertas.push({ peso: encontradas.length > 1 ? 2 : 1, clave: 'palabras', params: { lista: encontradas.join(', ') } })
  }

  if (url.port && !['80', '443'].includes(url.port)) {
    alertas.push({ peso: 1, clave: 'puerto', params: { puerto: url.port } })
  }

  if (url.href.length > 100) {
    alertas.push({ peso: 1, clave: 'largo' })
  }

  if (/\.(pdf|docx?|xlsx?|jpe?g|png)\.[a-z0-9]{2,4}$/i.test(url.pathname)) {
    alertas.push({ peso: 5, clave: 'dobleExtension' })
  } else if (/\.(exe|scr|apk|bat|cmd|msi|js|vbs|jar|zip|rar|7z|iso)$/i.test(url.pathname)) {
    alertas.push({ peso: 3, clave: 'ejecutable' })
  }

  if (!alertas.length) buenas.push({ clave: 'limpio' })

  return resultado(entrada, dominio, alertas, buenas, trocear(url, dominio), url.href)
}

// ES: Suma los pesos y decide el nivel: 0-1 ok, 2-4 sospechoso, 5+ peligro
// EN: Adds up the weights and picks the level: 0-1 ok, 2-4 suspicious, 5+ danger
function resultado(entrada, dominio, alertas, buenas, partes, href = null) {
  const puntos = alertas.reduce((s, a) => s + a.peso, 0)
  const nivel = puntos >= 5 ? 'peligro' : puntos >= 2 ? 'sospechoso' : 'ok'
  alertas.sort((a, b) => b.peso - a.peso)
  return { valido: true, entrada, href, dominio, puntos, nivel, alertas, buenas, partes }
}
