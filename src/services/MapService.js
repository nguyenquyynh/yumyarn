import axios from 'axios';

export const searchLocation = async (keysearch, location) => {
    const options = {
        method: 'GET',
        url: 'https://api.hasdata.com/scrape/google-maps/search',
        params: {
            q: keysearch,
            ll: location,
            hl: 'vi',
            domain: 'google.com.vn'
        },
        headers: {
            'x-api-key': process.env.SEARCHPLACE_KEY,
            'Content-Type': 'application/json'
        }
    };
    try {
        const { data } = await axios.request(options);
        return data.localResults
    } catch (error) {
        console.error("mmmmmmmmmmmm", error);
    }
}

export const reverLocation = async (location) => {
    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${location?.latitude},${location?.longitude}&lang=vi-VN&apiKey=${process.env.HEREAPI_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const autoComplete = async (keyword, location) => {
    const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${location?.latitude},${location?.longitude}&limit=5&q=${keyword}&apiKey=NxS2pgGXlxkBUH9vKpJrcqW4eGnItbkIls0z6JZP8Kg`
    const response = await fetch(url)
    const { items } = await response.json()
    return items.map(item => item.address.label)
}