import axios from "axios";
import api from ".";

const handleError = (error: unknown, context: string): never => {
    console.error(`Error in ${context}:`, error);

    if (error instanceof Error) {
        if (error.message.includes('Unexpected token')) {
            // This likely means we received an HTML response instead of JSON
            throw new Error(`Received non-JSON response in ${context}. The server might be down or returning an error page.`);
        }
        throw error;
    } else {
        throw new Error(`Unknown error in ${context}`);
    }
};

interface CreateUserRequest {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
}

export const createUser = async (data: CreateUserRequest): Promise<{ success: boolean; message: string; data: any }> => {
    try {
        const response = await axios.post<{ success: boolean; message: string; data: any }>(
            `http://192.168.0.124:8000/api/my/user/signup`,
            data
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'createUser');
    }
};

export const getAllUser = async (): Promise<{ success: boolean; message: string; data: any }> => {
    try {
        const response = await axios.get<{ success: boolean; message: string; data: any }>(
            `http://192.168.0.124:8000/api/my/user/`,
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'createUser');
    }
};

export const getCurrentUser = async (id: string): Promise<{ success: boolean; message: string; data: any }> => {
    try {
        const response = await axios.get<{ success: boolean; message: string; data: any }>(
            `http://192.168.0.124:8000/api/my/user/${id}`,
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'getCurrentUser');
    }
};


export const updateCurrentUser = async (id: string, data: any): Promise<{ success: boolean; message: string; data: any }> => {
    try {
        console.log("idssss", id)
        const response = await axios.put<{ success: boolean; message: string; data: any }>(
            `http://192.168.0.124:8000/api/my/user/update/${id}`,
            data
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'updateCurrentUser');
    }
};



export const signIn = async (data: any): Promise<{ success: boolean; token: string; message: string; data: any; user: any }> => {
    try {
        const response = await axios.post<{ success: boolean; token: string; message: string; data: any; user: any }>(
            `http://192.168.0.124:8000/api/my/user/signin`,
            data
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'signIn');
    }
};


export const signOut = async (): Promise<{ success: boolean; message: string; data: any }> => {
    try {
        const response = await axios.post<{ success: boolean; message: string; data: any }>(
            `http://192.168.0.124:8000/api/my/user/signout`,

        );
        return response.data;
    } catch (error) {
        return handleError(error, 'signOut');
    }
};

export const updateUserDetails = async (userData: any) => {
    const response = await api.put('/update-user', userData);
    return response.data;
};


