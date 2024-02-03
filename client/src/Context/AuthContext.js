import React, { useState, useEffect, createContext } from 'react'
import { makeRequest } from '../Axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await makeRequest.get('/auth/getuser');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);
    console.log(user);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}