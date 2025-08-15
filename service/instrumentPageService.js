const server_url = "http://localhost:8080"
import axios from "axios";

export async function getInstruments() {
    const url = server_url + "/company"
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



export async function getInstrumentQuote(nseCode) {
    const url = server_url + `/company/quote?companyCode=${nseCode}`
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
export async function createNewInstrument(request){
    const url = server_url + "/instrument"
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

export async function addToSuggestionInstrument(request){
    const url = server_url + "/suggested-instrument"
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


export async function deleteSuggestedInstrument(id){
    const url = server_url + `/suggested-instrument/${id}`
    return await axios.delete(url)
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

export async function getUnUsedSuggestedInstrument() {
    const url = server_url + "/suggested-instrument/un-used"
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
export async function getSuggestedInstrument() {
    const url = server_url + "/suggested-instrument"
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


export async function reOrderInstruments(request){
    const url = server_url + `/suggested-instrument/re-order`
    return await axios.put(url, request)
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
