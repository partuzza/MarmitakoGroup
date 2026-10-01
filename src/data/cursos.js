// ES: Catálogo de cursos. Título y descripción en los dos idiomas; el nivel es b/i/a (ver i18n → niveles).
//     La portada de cada curso está en public/cursos/<id>.svg (se puede cambiar por una foto con el mismo nombre)
// EN: Course catalogue. Title and description in both languages; level is b/i/a (see i18n → niveles).
//     Each course cover lives in public/cursos/<id>.svg (it can be swapped for a photo with the same name)
export const NIVELES = ['b', 'i', 'a']

// ES: Cuántos cursos se ven sin suscripción; el resto queda detrás del aviso
// EN: How many courses are visible without a subscription; the rest sit behind the notice
export const CURSOS_GRATIS = 9

export const imagenCurso = (c) => `${import.meta.env.BASE_URL}cursos/${c.id}.svg`

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
    id: 'movil', nivel: 'b', horas: '2 h', precio: 0,
    titulo: { es: 'Tu móvil, a prueba de sustos', en: 'A scare-proof phone' },
    desc: { es: 'Permisos de apps, bloqueo de pantalla, copias de seguridad y qué hacer si lo pierdes.', en: 'App permissions, screen lock, backups and what to do if you lose it.' },
  },
  {
    id: 'compras', nivel: 'b', horas: '2 h', precio: 9,
    titulo: { es: 'Compras online sin estafas', en: 'Online shopping without scams' },
    desc: { es: 'Tiendas falsas, pagos seguros y cómo reclamar si algo sale mal.', en: 'Fake shops, safe payments and how to claim if something goes wrong.' },
  },
  {
    id: 'wifi', nivel: 'b', horas: '2 h', precio: 0,
    titulo: { es: 'Wi-Fi públicas y VPN', en: 'Public Wi-Fi and VPNs' },
    desc: { es: 'Qué riesgos tiene la Wi-Fi del bar y cuándo te ayuda de verdad una VPN.', en: 'The risks of café Wi-Fi and when a VPN actually helps.' },
  },
  {
    id: 'identidad', nivel: 'b', horas: '3 h', precio: 19,
    titulo: { es: 'Huella digital e identidad', en: 'Digital footprint and identity' },
    desc: { es: 'Busca qué hay de ti en internet y aprende a borrarlo o controlarlo.', en: 'Find out what is online about you and learn to remove or control it.' },
  },
  {
    id: 'ingenieria-social', nivel: 'b', horas: '3 h', precio: 19,
    titulo: { es: 'Ingeniería social', en: 'Social engineering' },
    desc: { es: 'Llamadas falsas, suplantaciones y los trucos psicológicos que usan los estafadores.', en: 'Fake calls, impersonation and the psychological tricks scammers use.' },
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
    id: 'linux', nivel: 'i', horas: '8 h', precio: 39,
    titulo: { es: 'Linux para ciberseguridad', en: 'Linux for cybersecurity' },
    desc: { es: 'Terminal, permisos, procesos y los comandos que usarás todos los días.', en: 'Terminal, permissions, processes and the commands you will use every day.' },
  },
  {
    id: 'malware', nivel: 'i', horas: '5 h', precio: 39,
    titulo: { es: 'Malware y ransomware', en: 'Malware and ransomware' },
    desc: { es: 'Tipos de malware, cómo se cuelan y cómo protegerte antes de que pase.', en: 'Types of malware, how they get in and how to protect yourself beforehand.' },
  },
  {
    id: 'cloud', nivel: 'i', horas: '6 h', precio: 49,
    titulo: { es: 'Seguridad en la nube', en: 'Cloud security' },
    desc: { es: 'Cuentas, permisos y errores típicos que dejan datos al aire en la nube.', en: 'Accounts, permissions and typical mistakes that leave cloud data exposed.' },
  },
  {
    id: 'osint', nivel: 'i', horas: '5 h', precio: 49,
    titulo: { es: 'OSINT: investigar con fuentes abiertas', en: 'OSINT: open-source investigation' },
    desc: { es: 'Encuentra información pública de forma ética y legal con herramientas gratuitas.', en: 'Find public information ethically and legally with free tools.' },
  },
  {
    id: 'firewall', nivel: 'i', horas: '6 h', precio: 49,
    titulo: { es: 'Firewalls y segmentación', en: 'Firewalls and segmentation' },
    desc: { es: 'Configura reglas, separa redes y entiende qué tráfico dejas pasar.', en: 'Set up rules, split networks and understand which traffic you let through.' },
  },
  {
    id: 'python', nivel: 'i', horas: '10 h', precio: 59,
    titulo: { es: 'Python para seguridad', en: 'Python for security' },
    desc: { es: 'Automatiza tareas, analiza logs y crea tus primeras herramientas.', en: 'Automate tasks, analyse logs and build your first tools.' },
  },
  {
    id: 'owasp', nivel: 'a', horas: '10 h', precio: 79,
    titulo: { es: 'Seguridad web: OWASP Top 10', en: 'Web security: OWASP Top 10' },
    desc: { es: 'Inyección SQL, XSS y control de acceso, en un laboratorio seguro.', en: 'SQL injection, XSS and access control, in a safe lab.' },
  },
  {
    id: 'pentesting', nivel: 'a', horas: '12 h', precio: 89,
    titulo: { es: 'Introducción al pentesting', en: 'Introduction to pentesting' },
    desc: { es: 'Reconocimiento, explotación e informe en máquinas preparadas para practicar.', en: 'Recon, exploitation and reporting on machines built for practice.' },
  },
  {
    id: 'forense', nivel: 'a', horas: '10 h', precio: 89,
    titulo: { es: 'Análisis forense digital', en: 'Digital forensics' },
    desc: { es: 'Recupera pruebas de discos y memoria sin contaminarlas.', en: 'Recover evidence from disks and memory without tainting it.' },
  },
  {
    id: 'incidentes', nivel: 'a', horas: '8 h', precio: 79,
    titulo: { es: 'Respuesta ante incidentes', en: 'Incident response' },
    desc: { es: 'Qué hacer en las primeras horas de un ataque, paso a paso.', en: 'What to do in the first hours of an attack, step by step.' },
  },
  {
    id: 'reversing', nivel: 'a', horas: '12 h', precio: 99,
    titulo: { es: 'Ingeniería inversa', en: 'Reverse engineering' },
    desc: { es: 'Desmonta programas para ver qué hacen por dentro con Ghidra.', en: 'Take programs apart to see what they do inside with Ghidra.' },
  },
  {
    id: 'ctf', nivel: 'a', horas: '8 h', precio: 59,
    titulo: { es: 'Preparación para CTF', en: 'CTF preparation' },
    desc: { es: 'Retos de web, cripto y forense para competir en equipo.', en: 'Web, crypto and forensics challenges to compete as a team.' },
  },
  {
    id: 'soc', nivel: 'a', horas: '10 h', precio: 89,
    titulo: { es: 'Analista SOC', en: 'SOC analyst' },
    desc: { es: 'Monitoriza alertas, usa un SIEM y separa el ruido de los ataques reales.', en: 'Monitor alerts, use a SIEM and separate noise from real attacks.' },
  },
  {
    id: 'ia', nivel: 'a', horas: '6 h', precio: 69,
    titulo: { es: 'Seguridad en IA', en: 'AI security' },
    desc: { es: 'Prompt injection, fugas de datos y cómo proteger apps que usan modelos de lenguaje.', en: 'Prompt injection, data leaks and how to protect apps that use language models.' },
  },
]
