// ES: Catálogo de cursos. Título y descripción en los dos idiomas; el nivel es b/i/a (ver i18n → niveles)
// EN: Course catalogue. Title and description in both languages; level is b/i/a (see i18n → niveles)
export const NIVELES = ['b', 'i', 'a']

export const cursos = [
  {
    id: 'contrasenas', nivel: 'b', horas: '3 h', precio: 0,
    titulo: { es: 'Contraseñas y cuentas seguras', en: 'Passwords and secure accounts' },
    desc: { es: 'Gestores de contraseñas, verificación en dos pasos y cómo saber si te han filtrado.', en: 'Password managers, two-step verification and how to find out if you have been leaked.' },
  },
  {
    id: 'phishing', nivel: 'b', horas: '4 h', precio: 19,
    titulo: { es: 'Detecta el phishing', en: 'Spot phishing' },
    desc: { es: 'Aprende a reconocer correos, SMS y webs falsas con ejemplos reales.', en: 'Learn to recognise fake emails, texts and websites with real examples.' },
  },
  {
    id: 'privacidad', nivel: 'b', horas: '3 h', precio: 0,
    titulo: { es: 'Privacidad en redes sociales', en: 'Privacy on social media' },
    desc: { es: 'Ajustes que importan y qué datos regalas sin darte cuenta.', en: 'Settings that matter and what data you give away without noticing.' },
  },
  {
    id: 'redes', nivel: 'i', horas: '6 h', precio: 39,
    titulo: { es: 'Cómo funciona una red', en: 'How a network works' },
    desc: { es: 'IP, DNS, HTTP y Wi-Fi: la base para entender los ataques.', en: 'IP, DNS, HTTP and Wi-Fi: the basics for understanding attacks.' },
  },
  {
    id: 'cifrado', nivel: 'i', horas: '6 h', precio: 39,
    titulo: { es: 'Cifrado en la práctica', en: 'Encryption in practice' },
    desc: { es: 'Hashes, claves y certificados explicados con ejercicios.', en: 'Hashes, keys and certificates explained with exercises.' },
  },
  {
    id: 'owasp', nivel: 'a', horas: '10 h', precio: 79,
    titulo: { es: 'Seguridad web: OWASP Top 10', en: 'Web security: OWASP Top 10' },
    desc: { es: 'Inyección SQL, XSS y control de acceso, en un laboratorio seguro.', en: 'SQL injection, XSS and access control, in a safe lab.' },
  },
]
