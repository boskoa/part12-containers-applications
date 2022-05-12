/* eslint-disable no-undef */
import axios from 'axios'
require('dotenv').config()

const baseUrl = `${process.env.REACT_APP_BACKEND_URL || ''}/api/blogs`

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async updatedObject => {
  const response = await axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject)
  return response.data
}

const remove = async deletedObject => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${deletedObject.id}`, config)
}

export default { getAll, create, update, remove, setToken }