import { useState } from 'react'
import './App.css'
import Header from './Header'
import Post from './Post'
import {Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Login from './pages/Login'
import IndexPage from './pages/index'
import Register from './pages/Register'
import { UserContextProvider } from './UserContext'
import CreatePost from './pages/CreatePost'
import { PostPage } from './pages/Postpage'
import EditPost from './pages/EditPage'

function App() {

  return (
    <UserContextProvider>

    <Routes>
      
      <Route path='/' element={<Layout/>}>

      <Route index element={<IndexPage />} ></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/create' element={<CreatePost />}></Route>
      <Route path='/post/:id' element={<PostPage />}></Route>
      <Route path='/edit/:id' element={<EditPost />}></Route>



      </Route>
    </Routes>



    </UserContextProvider>
    
    
  )
}

export default App
