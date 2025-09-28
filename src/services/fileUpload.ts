import api from "./axiosInstance"

export const fileUpload = async (file: any) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData)
        const res = await api.post("files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res;
    } catch (error) {
        console.log(error)
        return error
    }
}