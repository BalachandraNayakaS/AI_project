import { createContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      authService.setToken(token)
      authService.getProfile()
        .then((response) => {
          setUser(response.data)
        })
        .catch(() => {
          handleLogout()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [token])

  const handleLogin = async (credentials) => {
    const response = await authService.login(credentials)
    const authToken = response.data.access_token
    localStorage.setItem('auth_token', authToken)
    authService.setToken(authToken)
    setToken(authToken)
    setUser(response.data.user || null)
    return response
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    authService.clearToken()
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login: handleLogin,
      logout: handleLogout,
      setUser,
    }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
