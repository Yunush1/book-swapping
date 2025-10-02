import api from "../axiosInstance";

export const getExchanges = async () => {
    try {
        const response = await api.get("/exchanges");
        return response.data;
    } catch (error) {
        console.log('error', error)
    }
};

export const getExchange = async (id: number) => {
    const response = await api.get(`/exchanges/${id}`);
    return response.data;
};

export const createExchange = async (exchange: any) => {
    const response = await api.post("/exchanges", exchange);
    return response.data;
};

export const updateExchange = async (id: number, exchange: any) => {
    const response = await api.put(`/exchanges/${id}`, exchange);
    return response.data;
};

export const deleteExchange = async (id: number) => {
    const response = await api.delete(`/exchanges/${id}`);
    return response.data;
};

export const getMyExchanges = async () => {
    try {
        const response = await api.get("/exchanges/my/exchages");
        return response.data;
    } catch (error) {
        console.error("GET MY EXCHANGES", error);
        return error;
    }
};

export const createExchangeRequest = async ({ bookId, message, owner }) => {
    try {
        const response = await api.post(`/requests`, {
            message,
            exchange: bookId,
            owner: owner.id
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { error: error.message || error };
    }
};

export const getMyExchangeRequest = async () => {
    try {
        console.log('getMyExchangeRequest')
        const res = await api.get('/requests');
        return res;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const updateExchangeRequestStatus = async (requestId: string, action: Number) => {
    try {
        const res = await api.put(`/requests/${requestId}`, { status: action });
        return res;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export const getReceivedExchangeRequest = async () => {
    try {
        const res = await api.get('/requests/received');
        return res;
    } catch (error) {
        console.error(error);
        return error;
    }
}