
export const searchLocation = async (keysearch, location) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'x-api-key': '534e01af-2c9b-49b5-9579-580c459e5f9f',
                'Content-Type': 'application/json'
            }
        };

        const fetchData = async (keysearch, location) => {
            const url = new URL('https://api.hasdata.com/scrape/google-maps/search');
            url.searchParams.append('q', keysearch);
            url.searchParams.append('ll', location);
            url.searchParams.append('hl', 'vi');
            url.searchParams.append('domain', 'google.com.vn');

            return fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    return data.localResults;
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        };

        // Sử dụng hàm fetchData
        const data = await fetchData(keysearch, location)
            .then(data => data)
            .catch(error => console.error(error));

        return data
    } catch (error) {
        console.error("mmmmmmmmmmmm", error);
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