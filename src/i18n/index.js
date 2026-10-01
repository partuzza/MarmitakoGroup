import { ref, watch } from 'vue'
import es from './es.js'
import en from './en.js'

const DICCIONARIOS = { es, en }

// ES: Idioma guardado en el navegador o, si no hay, el del sistema
// EN: Language saved in the browser or, if none, the system language
function idiomaInicial() {
  try {
    const guardado = localStorage.getItem('idioma')
    if (guardado in DICCIONARIOS) return guardado
  } catch {
    // ES: localStorage puede no estar disponible (modo privado)
    // EN: localStorage may be unavailable (private mode)
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export const idioma = ref(idiomaInicial())

watch(idioma, (nuevo) => {
  document.documentElement.lang = nuevo
  try {
    localStorage.setItem('idioma', nuevo)
  } catch {
    // ES: Si no se puede guardar, el cambio solo dura esta visita
    // EN: If it can't be saved, the change only lasts for this visit
  }
}, { immediate: true })

// ES: t('a.b', { x: 1 }) busca la clave en el diccionario activo y sustituye {x}
// EN: t('a.b', { x: 1 }) looks up the key in the active dictionary and replaces {x}
export function t(clave, params = {}) {
  const valor = clave.split('.').reduce((obj, k) => obj?.[k], DICCIONARIOS[idioma.value])
  if (typeof valor !== 'string') return valor ?? clave
  return valor.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '')
}
