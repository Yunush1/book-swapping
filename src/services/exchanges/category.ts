import api from "../axiosInstance";


export const getCategories = async ()=>{
    try {
        const res = await api.get('/categories');
        return res;
    } catch (error) {
        console.error('error',error);
        return error;
    }
}