import express from 'express'
import cors from 'cors'
import { paises, clubes } from './datos.js'

const app = express()
app.use(cors())
const PORT = 3000

// Para comparar textos sin importar mayúsculas ni espacios sobrantes.
// (Las tildes sí cuentan: "Peñarol" se escribe con ñ.)
const normalizar = (texto) => String(texto).trim().toLowerCase()

// GET /api/clubes            → los 16 clubes
// GET /api/clubes?pais=Chile → clubes de ese país (búsqueda anidada)
app.get('/api/clubes', (req, res) => {
  const { pais } = req.query

  // Sin ?pais= devolvemos todos los clubes
  if (pais === undefined) {
    return res.json(clubes)
  }

  // Salto 1: resolver la referencia → buscar el país por su nombre
  const paisEncontrado = paises.find(
    (p) => normalizar(p.nombre) === normalizar(pais)
  )

  // find devuelve undefined si no existe → 404
  if (!paisEncontrado) {
    return res.status(404).json({ error: `No existe el país ${pais}` })
  }

  // Salto 2: ahora sí, filtrar los clubes por el id de ese país
  // filter puede devolver [] (país sin clubes) y eso sigue siendo un 200
  const delPais = clubes.filter((c) => c.paisId === paisEncontrado.id)
  res.json(delPais)
})

// GET /api/clubes/:id → un club por su id
app.get('/api/clubes/:id', (req, res) => {
  // req.params.id llega como TEXTO: se convierte antes de comparar con ===
  const id = Number(req.params.id)
  const club = clubes.find((c) => c.id === id)

  if (!club) {
    return res.status(404).json({ error: `No existe el club ${req.params.id}` })
  }

  res.json(club)
})

// 🌟 Extra: GET /api/titulos → todos los años de todos los clubes, ordenados
// (va antes de /api/titulos/:club por claridad; no se pisan igual)
app.get('/api/titulos', (req, res) => {
  const anios = clubes.flatMap((c) => c.titulos).sort((a, b) => a - b)
  res.json(anios)
})

// GET /api/titulos/:club → años de títulos de un club buscado por nombre
app.get('/api/titulos/:club', (req, res) => {
  const club = clubes.find(
    (c) => normalizar(c.nombre) === normalizar(req.params.club)
  )

  // El club NO EXISTE → 404
  if (!club) {
    return res.status(404).json({ error: `No existe el club ${req.params.club}` })
  }

  // El club existe, aunque no tenga títulos → 200 con [] (no es un error)
  res.json(club.titulos)
})

// 🌟 Extra: GET /api/estadisticas → totales y títulos por país (reduce)
app.get('/api/estadisticas', (req, res) => {
  const totalTitulos = clubes.reduce((suma, c) => suma + c.titulos.length, 0)

  const titulosPorPais = clubes.reduce((acc, c) => {
    const pais = paises.find((p) => p.id === c.paisId)
    acc[pais.nombre] = (acc[pais.nombre] || 0) + c.titulos.length
    return acc
  }, {})

  res.json({
    totalClubes: clubes.length,
    totalTitulos,
    titulosPorPais,
  })
})

// Cualquier otra ruta → 404 en JSON (nunca una página HTML de error)
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` })
})

app.listen(PORT, () => {
  console.log(`🏆 API libertadores lista en http://localhost:${PORT}`)
})
