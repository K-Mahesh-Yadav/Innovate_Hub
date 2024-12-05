import { useDeferredValue, useState } from 'react'
import { useAuthContext } from './useAuthContext'
import {useNavigate} from 'react-router-dom'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()
  const login = async (email, password) => {

    setIsLoading(true)
    setError(null)

    const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/user/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {

      localStorage.setItem('user', JSON.stringify(json))
      console.log(json)

      dispatch({type: 'LOGIN', payload: json})

      setIsLoading(false)

      navigate ("/login")
    }
  }

  return { login, isLoading, error }
}