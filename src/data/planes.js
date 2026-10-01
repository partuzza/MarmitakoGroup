// ES: Planes para colegios (precios de ejemplo, ajustar antes de vender). Textos en los dos idiomas
// EN: School plans (sample prices, adjust before selling). Texts in both languages
export const planes = [
  {
    id: 'aula', precio: 290, alumnos: { es: '1 clase · hasta 30 alumnos', en: '1 class · up to 30 students' }, destacado: false,
    nombre: { es: 'Aula', en: 'Classroom' },
    items: {
      es: ['Todos los cursos básicos', 'Phishing Test y quiz ilimitados', 'Panel para 1 docente', 'Prueba gratis 30 días'],
      en: ['All beginner courses', 'Unlimited Phishing Test and quiz', 'Dashboard for 1 teacher', '30-day free trial'],
    },
  },
  {
    id: 'centro', precio: 1490, alumnos: { es: 'Hasta 300 alumnos', en: 'Up to 300 students' }, destacado: true,
    nombre: { es: 'Centro', en: 'School' },
    items: {
      es: ['Todo lo de Aula', 'Cursos intermedios y avanzados', 'Docentes ilimitados', 'Informes de progreso y certificados', 'Pago por factura'],
      en: ['Everything in Classroom', 'Intermediate and advanced courses', 'Unlimited teachers', 'Progress reports and certificates', 'Pay by invoice'],
    },
  },
  {
    id: 'red', precio: 0, alumnos: { es: 'Varios centros', en: 'Multiple schools' }, destacado: false,
    nombre: { es: 'Red de centros', en: 'School network' },
    items: {
      es: ['Todo lo de Centro', 'Panel conjunto para la dirección', 'Formación para el profesorado', 'Contenido adaptado a tu región'],
      en: ['Everything in School', 'Joint dashboard for management', 'Teacher training', 'Content adapted to your region'],
    },
  },
]

