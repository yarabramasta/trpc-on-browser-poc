import Axios from 'axios'

import { getEnv } from '../env'

const pokedexApi = Axios.create({
  baseURL: getEnv(import.meta.env).pokedexApiBaseUrl
})

const handleAxiosError = (
  error: unknown
): { status: number; message: string } => {
  if (Axios.isAxiosError(error)) {
    const errData = error.response?.data || null

    return {
      status: error.response?.status || 500,
      message: errData?.message || 'Something went wrong'
    }
  }

  return {
    status: 500,
    message: 'Something went wrong'
  }
}

const api = {
  pokedex: pokedexApi
}

export { api, handleAxiosError }
