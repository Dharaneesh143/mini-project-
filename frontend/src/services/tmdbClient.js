import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'ecfa837bb91bbbca17970e60da354c6b'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

function buildImage(path, size = 'w500') {
  if (!path) return undefined
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 12000,
  params: {
    api_key: TMDB_API_KEY,
  },
})

export async function tmdbPopular(page = 1, language) {
  const { data } = await tmdb.get('/movie/popular', {
    params: { page, language },
  })
  return data
}

export async function tmdbTrending(page = 1, language) {
  const { data } = await tmdb.get('/trending/movie/week', {
    params: { page, language },
  })
  return data
}

export async function tmdbUpcoming(page = 1, language) {
  const { data } = await tmdb.get('/movie/upcoming', {
    params: { page, language },
  })
  return data
}

export async function tmdbSearch(query, page = 1, includeAdult = false, language) {
  const { data } = await tmdb.get('/search/movie', {
    params: { query, page, include_adult: includeAdult, language },
  })
  return data
}

export async function tmdbDetails(id, language) {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { language, append_to_response: 'credits,keywords' },
  })
  return data
}

export async function tmdbSimilar(id, page = 1, language) {
  const { data } = await tmdb.get(`/movie/${id}/similar`, {
    params: { page, language },
  })
  return data
}

export function mapTmdbToMovie(item) {
  return {
    id: item.id,
    tmdbId: item.id,
    title: item.title || item.name,
    poster: buildImage(item.poster_path, 'w500'),
    posterPath: buildImage(item.poster_path, 'w500'),
    backdrop: buildImage(item.backdrop_path, 'w780'),
    backdropPath: buildImage(item.backdrop_path, 'w1280'),
    rating: item.vote_average,
    voteAverage: item.vote_average,
    release_date: item.release_date,
    releaseDate: item.release_date,
    year: item.release_date ? new Date(item.release_date).getFullYear() : undefined,
    genres: Array.isArray(item.genre_ids) ? item.genre_ids : item.genres?.map(g => g.name) || [],
    genre: Array.isArray(item.genres) ? item.genres.map(g => g.name).join(', ') : '',
    runtime: item.runtime,
    duration: item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : '',
    description: item.overview,
    overview: item.overview,
    popularity: item.popularity,
    originalLanguage: item.original_language,
    spokenLanguages: item.spoken_languages,
  }
}

export function mapTmdbToDetails(item) {
  const base = mapTmdbToMovie(item)
  return {
    ...base,
    director: item.credits?.crew?.find(c => c.job === 'Director')?.name,
    cast: item.credits?.cast?.slice(0, 12)?.map(c => ({ name: c.name, character: c.character })) || [],
    keywords: item.keywords?.keywords?.map(k => k.name) || item.keywords?.map?.(k => k.name) || [],
    budget: item.budget,
    revenue: item.revenue,
    voteCount: item.vote_count,
    status: item.status,
    tagline: item.tagline,
    productionCountries: item.production_countries,
  }
}

export function hasTmdbKey() {
  return Boolean(TMDB_API_KEY)
}


