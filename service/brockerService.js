const server_url = "http://localhost:8080"
import axios from "axios";

export async function createSessionURL() {
    const url = server_url + "/broker/session/generate-url"
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

export async function validateSessionURL() {
    const url = server_url + "/broker/session/validate"
    return await axios.get(url)
        .then(response => {
            if(response.status === 200){
                return {data:response.data, error:undefined}
            } else {
                return {data: undefined, error: response.data}
            }
        })
        .catch(function (error) {
            return {data: undefined, error: error}
        })

}


export async function createSession(request){
    const url = server_url + "/broker/session/initiate"
    return await axios.post(url, request)
        .then(response => {
            if(response.status === 201){
                return {data:{}, error:undefined}
            } else  if(response.status === 400){
                return {data: undefined, error: response.data.message}
            }
        })
        .catch(function (error) {
            return {data: undefined, error: error?.response?.data?.message}
        })
}
