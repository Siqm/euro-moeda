
export async function api(endpoint, method) {

    const headers = { "Content-Type":"application/json" };

    let requestOptions = {
        method, headers
    }

    try {
        const response = await fetch(
            `https://economia.awesomeapi.com.br/${endpoint}`,
            requestOptions
        )
        // console.log('batendo na URL: ', `https://economia.awesomeapi.com.br/${endpoint}`);

        const responseData = await response.json();

        if (responseData.err) {
            throw Error(responseData.message)
        }

        return responseData
    } catch (err) {
        throw err
    }
}





