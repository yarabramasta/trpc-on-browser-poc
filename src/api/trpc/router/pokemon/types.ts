interface GetPokemonResponse {
  count: number
  next: string | null
  previous: string | null
  results: {
    name: string
    url: string
  }[]
}

interface GetPokemonByIdResponse {
  abilities: {
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
  }[]
  types: {
    type: { name: string; url: string }
  }[]
}

export type { GetPokemonByIdResponse, GetPokemonResponse }
