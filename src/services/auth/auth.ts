import api from "../axiosInstance";

export const loginUser = async ({email, password}) => {
    try {
        const response = await api.post("/auth/login-via-password", { email, password });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const register = async ({name, email, mobileNumber, password,}) => {
    try {
        const response = await api.post("/auth/signup", { name, email, password, mobileNumber });
        return response.data;
    } catch (error) {
        return error;
    }
};