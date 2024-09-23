export const searchLocation = async (keysearch, locationsearch) => {
    const url = `${process.env.URL_SEARCH}?query=${keysearch}&location=${locationsearch}&key=${process.env.SEARCHAPI_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const reverLocation = async (loaction) => {
    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${loaction?.latitude},${loaction?.longitude}&lang=vi-VN&apiKey=${process.env.MAPAPI_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const autoComplete = async (keyword) => {
    const url = `${process.env.GEOAPI_URL}/v1/geocode/autocomplete?apiKey=${process.env.GEOAPI_KEY}&text=${keyword}`
    const response = await fetch(url)
    const data = await response.json()
    return data.features
}