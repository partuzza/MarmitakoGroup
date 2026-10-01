// ES: Planes de suscripción (precios de ejemplo, ajustar antes de vender). Textos en los dos idiomas.
//     precio: 0 → gratis, null → a medida; periodo: 'mes' o 'ano'
// EN: Subscription plans (sample prices, adjust before selling). Texts in both languages.
//     precio: 0 → free, null → custom quote; periodo: 'mes' (month) or 'ano' (year)
export const planesParticulares = [
  {
    id: 'gratis', precio: 0, periodo: null, subtitulo: { es: 'Para empezar', en: 'To get started' }, destacado: false,
    nombre: { es: 'Básico', en: 'Basic' },
    items: {
      es: ['9 cursos básicos', '1 análisis de enlace y quiz ilimitado', 'Mis cursos para seguir tu avance'],
      en: ['9 beginner courses', '1 link check and unlimited quiz', 'My courses to track your progress'],
    },
  },
  {
    id: 'mensual', precio: 9.99, periodo: 'mes', subtitulo: { es: 'Sin permanencia', en: 'No commitment' }, destacado: false,
    nombre: { es: 'Mensual', en: 'Monthly' },
    items: {
      es: ['Los 24 cursos, de básico a avanzado', 'Análisis de enlaces ilimitados', 'Certificado al terminar cada curso', 'Cancela cuando quieras'],
      en: ['All 24 courses, beginner to advanced', 'Unlimited link checks', 'Certificate for every course you finish', 'Cancel any time'],
    },
  },
  {
    id: 'anual', precio: 79, periodo: 'ano', subtitulo: { es: 'Ahorras un 34 %', en: 'Save 34%' }, destacado: true,
    nombre: { es: 'Anual', en: 'Yearly' },
    items: {
      es: ['Todo lo del plan Mensual', 'Acceso anticipado a cursos nuevos', 'Charlas en directo con gente del sector'],
      en: ['Everything in Monthly', 'Early access to new courses', 'Live talks with people from the industry'],
    },
  },
]

export const planesEscuelas = [
  {
    id: 'aula', precio: 290, periodo: 'ano', subtitulo: { es: '1 clase · hasta 30 alumnos', en: '1 class · up to 30 students' }, destacado: false,
    nombre: { es: 'Aula', en: 'Classroom' },
    items: {
      es: ['Todos los cursos básicos', 'Phishing Test y quiz ilimitados', 'Panel para 1 docente', 'Prueba gratis 30 días'],
      en: ['All beginner courses', 'Unlimited Phishing Test and quiz', 'Dashboard for 1 teacher', '30-day free trial'],
    },
  },
  {
    id: 'centro', precio: 1490, periodo: 'ano', subtitulo: { es: 'Hasta 300 alumnos', en: 'Up to 300 students' }, destacado: true,
    nombre: { es: 'Centro', en: 'School' },
    items: {
      es: ['Todo lo de Aula', 'Cursos intermedios y avanzados', 'Docentes ilimitados', 'Informes de progreso y certificados', 'Pago por factura'],
      en: ['Everything in Classroom', 'Intermediate and advanced courses', 'Unlimited teachers', 'Progress reports and certificates', 'Pay by invoice'],
    },
  },
  {
    id: 'red', precio: null, periodo: null, subtitulo: { es: 'Varios centros', en: 'Multiple schools' }, destacado: false,
    nombre: { es: 'Red de centros', en: 'School network' },
    items: {
      es: ['Todo lo de Centro', 'Panel conjunto para la dirección', 'Formación para el profesorado', 'Contenido adaptado a tu región'],
      en: ['Everything in School', 'Joint dashboard for management', 'Teacher training', 'Content adapted to your region'],
    },
  },
]

