import React,{useState,useEffect} from 'react'
import {Form,Input,message} from 'antd'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import Spiner from '../components/Layout/Spiner'
const Register = () => {
const navigate = useNavigate()
const [loading,setLoading] = useState(false)

//form submit
const submitHandler= async (values) =>{
   try {
     await axios.post('/users/register',values)
     message.success('Registeration Successfull')
     setLoading(false)
     navigate('/login')
   } catch (error) {
    setLoading(false)
    message.error('Email address has been registered, please check again !')
   }
}

//prevent for login user
useEffect(()=>{
  if(localStorage.getItem('user')){
    navigate('/')
  }

},[navigate])

  return (
<>
<style>
    {`
      body {
        background-color: #f0f0f0; /* Màu nền của nền bên ngoài */
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }
      .register-page {
        background-color: #e0d9ae; /* Màu nền của khối */
        border-radius: 15px; /* Bo góc */
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng */
        padding: 30px;
        width: 400px;
        max-width: 100%;
      }
    `}
  </style>

  <div className="register-page">
    {loading && <Spiner />}
    <Form layout="vertical" onFinish={submitHandler}>
      <h1 className="text-center mb-4">Register Form</h1>

      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your Name!' }]}>
        <Input  />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
        <Input type="email"  />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your Pasword!' }]}>
        <Input type="password"  />
      </Form.Item>

      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-primary">Register</button>
      </div>

      <p className="text-center">
        <Link to="/login">Already registered? Click here to Login</Link>
      </p>
    </Form>
  </div>
</>

  )
}

export default Register
