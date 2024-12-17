export const searchTest = async (keysearch, location) => {
    try {

        const resault = await fetch(`https://serpapi.com/search.json?engine=google_maps&q=${keysearch}&ll=${location}&api_key=${process.env.SEARCHPLACE_KEY}`, {
            method: "GET"
        }).then((data) => {
            console.log(data);

            return data.json()
        }).then((response) => {
            console.log(response);
            return response

        })
            .catch((err) => console.log(err))

        console.log(resault?.local_results);
        return resault?.local_results
    } catch (error) {
        console.log(error);
        return null
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