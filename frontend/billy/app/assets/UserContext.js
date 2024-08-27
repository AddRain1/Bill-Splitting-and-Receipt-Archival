import React, { createContext, useState } from 'react';

// Create a Context for the user data
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

