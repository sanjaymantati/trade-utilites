const server_url = "http://localhost:8080"
import axios from "axios";

export async function getOrders() {
    const url = server_url + "/trade"
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

export async function getTradeRevisions(revisionId) {
    const url = server_url + `/trade/${revisionId}/revisions`
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


export async function createNewTrade(request){
    const url = server_url + "/trade"
    const headers = {
        "x-mfa-otp": request.mfa
    }
    const config = {
        headers : headers
    }
    return await axios.post(url, request, config)
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


export async function createNewTradeAlign(request){
    const url = server_url + "/trade/align"
    return await axios.post(url, request)
        .then(response => {
            if(response.status === 201){
                return {data:{}, error:undefined}
            } else  if(response.status === 400){
                return {data: undefined, error: response.data.message}
            }
        })
        .catch(function (error) {
            let errors = error?.response?.data?.message;
            if (error?.response?.data?.errors){
                errors=error?.response?.data?.errors
            }
            return {data: undefined, error: errors}
        })
}


export async function squareOffTrade(id, mfa){
    const headers = {
        "x-mfa-otp": mfa
    }
    const config = {
        headers : headers
    }
    const url = server_url + `/trade/${id}`
    return await axios.delete(url, config)
        .then(response => {
            if(response.status === 200){
                return {data:{}, error:undefined}
            } else  if(response.status === 400){
                return {data: undefined, error: response.data.message}
            }
        })
        .catch(function (error) {
            return {data: undefined, error: error?.response?.data?.message}
        })
}


export async function changeBucketState(id, state, otp){
    const url = server_url + `/bucket/${id}/${state}`
    const headers = {
        'x-mfa-otp': otp,
    }

    const config = {
        headers : headers
    }
    return await axios.put(url, null,config)
        .then(response => {
            if(response.status === 200){
                return {data:{}, error:undefined}
            } else  if(response.status === 400){
                return {data: undefined, error: response.data.message}
            }
        })
        .catch(function (error) {
            return {data: undefined, error: error?.response?.data?.message}
        })
}
