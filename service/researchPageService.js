const server_url = "http://localhost:8080"
import axios from "axios";

export async function getTrends(pageSize, pageNo, bullish) {
    const url = server_url + `/ticker/trend?pageSize=${pageSize}&pageNo=${pageNo}&bullish=${bullish}`
    return await axios.get(url)
        .then(response => {
            if (response.status === 200) {
                return {data: response.data, error: undefined}
            } else {
                return {data: undefined, error: response.data}
            }
        })
        .catch(function (error) {
            return {data: undefined, error: error}
        })
}

