import { createContext, useEffect, useMemo, useState } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme_mode')
    return stored ? stored === 'dark' : false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme_mode', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleTheme = () => setDarkMode((prev) => !prev)

  const value = useMemo(
    () => ({ darkMode, toggleTheme }),
    [darkMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
