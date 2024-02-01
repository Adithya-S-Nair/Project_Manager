import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
    let storedTheme = localStorage.getItem('theme');

    if (!storedTheme || storedTheme === 'undefined') {
        storedTheme = 'theme1';
        localStorage.setItem('theme', storedTheme);
    }

    const [theme, setTheme] = useState(storedTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
