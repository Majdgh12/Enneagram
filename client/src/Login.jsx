import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Card, CardContent, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
            localStorage.setItem('userSession', JSON.stringify(response.data));
            Cookies.set('userId', response.data.userId, { expires: 7 }); 
            toast.success('Logged in successfully');
            window.location.href = '/test';
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error('Invalid email or password');
            } else {
                console.error('Login Error:', error);
                toast.error('Error logging in');
            }
        }
    };

    return (
        <div style={{ 
            background: 'linear-gradient(to bottom, #6A0DAD, #000000)',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <ToastContainer />
            <Card style={{ 
                width: 300, 
                padding: 16, 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                background: '#0004', 
                color: '#fff',  
            }}>
                <CardContent>
                    <Typography variant="h5" component="h2" padding="10px" gutterBottom>
                        Login
                    </Typography>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleSubmit}>
                        <TextField
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            variant="outlined"
                            InputProps={{
                                style: { color: '#fff' },
                                classes: {
                                    notchedOutline: { borderColor: '#fff' },
                                },
                            }}
                            InputLabelProps={{
                                style: { color: '#fff' },
                            }}
                        />
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            variant="outlined"
                            InputProps={{
                                style: { color: '#fff' },
                                classes: {
                                    notchedOutline: { borderColor: '#fff' },
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            style={{ color: '#fff' }}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                style: { color: '#fff' },
                            }}
                        />
                        <Button type="submit" variant="contained" color="secondary">
                            Login
                        </Button>
                    </form>
                    <Typography variant="body2" color="white" align="center" style={{ marginTop: '15px' }}>
                        Don't have an account? <Link to="/" style={{ color: 'secondary' }}>Sign Up</Link>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
