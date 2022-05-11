import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          id="username"
          type="text"
          name="Username"
          autoFocus
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="text"
          name="Password"
          autoComplete="off"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <input id="login" type="submit" value="login" />
    </form>
  )
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default Login