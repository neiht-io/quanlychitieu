import React,{useState,useEffect} from 'react'
import {Form,Input,message} from 'antd'
import {Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import Spiner from '../components/Layout/Spiner'

const Login = () => {
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    //form submit
const submitHandler= async (values) =>{
    // console.log(values)
    try {
        setLoading(true)
        const {data} = await axios.post('/users/login',values)
        setLoading(false)
        message.success('login success')
        localStorage.setItem('user',
        JSON.stringify({...data.user,password:''}))
        navigate('/')
    } catch (error) {
        setLoading(false)
        message.error('Something went wrong, check it agan')
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
        background-color: #aed9e0; /* Màu nền của khối */
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
      <h1 className="text-center mb-4">Login Form</h1>

      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]} >
        <Input type="email"   />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your Password' }]} >
        <Input type="password"   />
      </Form.Item>

      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-primary">Login</button>
      </div>

      <p className="text-center">
        <Link to="/register">Not a user? Click here to Register</Link>
      </p>
    </Form>
  </div>
</>


  )
}

export default Login

