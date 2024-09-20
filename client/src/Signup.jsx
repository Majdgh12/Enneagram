import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { Card, CardContent, Button, TextField, Typography, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Use useNavigate hook here

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (password.length > 10) {
            toast.error('Password must not exceed 10 characters');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/auth/signup', { email, password });
            
            localStorage.setItem('userSession', JSON.stringify(response.data));

            // Save userId in a cookie
            const userId = response.data.userId;
            Cookies.set('userId', userId, { expires: 7 }); // Cookie will expire in 7 days

            toast.success('User created successfully');
            navigate('/test'); // Navigate to test page after successful signup
        } catch (error) {
            console.error('Signup Error:', error);
            if (error.response && error.response.status === 400) {
                toast.error('User already exists');
            } else {
                toast.error('Error creating user');
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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
                background: '#0004', // Adjust the card background color to match the gradient
                color: '#fff', // Text color
            }}>
                <CardContent>
                    <Typography variant="h5" padding= "10px" component="h2" gutterBottom>
                        Sign Up
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
                            type={showPassword ? "text" : "password"}
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
                                            onClick={handleClickShowPassword}
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
                        <TextField
                            type={showPassword ? "text" : "password"}
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                            onClick={handleClickShowPassword}
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
                        <FormControlLabel
                            control={<Checkbox checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} color="secondary" />}
                            label={<Typography style={{ color: '#fff' }}>I accept the terms and conditions</Typography>}
                        />
                        <Button type="submit" variant="contained" color="secondary" disabled={!acceptTerms}>
                            Sign Up
                        </Button>
                    </form>
                    <Typography variant="body2" color="white" align="center" marginTop='15px'>
                        Already have an account? <Link to="/login" style={{ color: 'secondary' }}>Login</Link>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;
