import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    RadioGroup,
    Radio,
    FormControlLabel,
    Typography,
    Paper,
    Box
} from '@mui/material';

import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [grades, setGrades] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestionsAndCategories = async () => {
            const session = localStorage.getItem('userSession');
            if (!session) {
                alert('Please log in first');
                navigate('/login');
                return;
            }

            try {
                const [questionsResult, categoriesResult] = await Promise.all([
                    axios.get('http://localhost:3001/api/test/questions'),
                    axios.get('http://localhost:3001/api/test/categories')
                ]);
                setQuestions(questionsResult.data);
                setCategories(categoriesResult.data);
            } catch (error) {
                console.error('Error fetching questions and categories:', error);
            }
        };

        fetchQuestionsAndCategories();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        Cookies.remove('userId');
        navigate('/login');
    };

    const handleGradeChange = (questionId, value) => {
        setGrades(prevGrades => ({
            ...prevGrades,
            [questionId]: parseInt(value)
        }));
    };

    const calculateTotalGrade = () => {
        let totalGrade = 0;
        for (const questionId in grades) {
            totalGrade += grades[questionId];
        }
        return totalGrade;
    };

    const handleSubmit = async () => {
        if (Object.keys(grades).length !== questions.length) {
            toast.error('Please answer all questions before submitting.');
            return;
        }

        const totalGrade = calculateTotalGrade();
        const userIdCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('userId='));
        const userId = userIdCookie ? userIdCookie.split('=')[1] : null;

        try {
            await axios.post('http://localhost:3001/api/test/results', { userId, totalGrade }); // Send totalGrade as an integer
            toast.success(`Total Grade: ${totalGrade}`);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error saving results:', error);
            toast.error('Error saving results');
        }
    };

    return (
        <div style={{
            background: '#6A0DAD',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
        }}>
            <ToastContainer />
            <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                style={{ marginBottom: '20px' }}
            >
                Logout
            </Button>
            <Paper style={{ background: '#0009', padding: '20px', width: '100%', maxWidth: '800px' }}>
                <Typography variant="h5" component="h2" gutterBottom style={{ color: '#fff', marginBottom: '20px' }}>
                    Test
                </Typography>
                {categories.map(category => (
                    <Box key={category.id} marginBottom="20px">
                        <Typography variant="h6" style={{ color: '#fff', marginBottom: '10px' }}>{category.category_name}</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ color: 'white' }}>Question</TableCell>
                                        <TableCell style={{ color: 'white' }}>Disagree Strongly</TableCell>
                                        <TableCell style={{ color: 'white' }}>Disagree Slightly</TableCell>
                                        <TableCell style={{ color: 'white' }}>Agree Slightly</TableCell>
                                        <TableCell style={{ color: 'white' }}>Agree Strongly</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {questions.filter(q => q.category_id === category.id).map((q) => (
                                        <TableRow key={q.id}>
                                            <TableCell style={{ color: 'white' }}>{q.question_text}</TableCell>
                                            <RadioGroup
                                                row
                                                name={`answer_${q.id}`}
                                                onChange={(e) => handleGradeChange(q.id, e.target.value)}
                                                style={{ display: 'contents' }}
                                            >
                                                <TableCell style={{ color: 'white' }}>
                                                    <FormControlLabel
                                                        value="1"
                                                        control={<Radio style={{ color: 'white' }} />}
                                                        label=""
                                                    />
                                                </TableCell>
                                                <TableCell style={{ color: 'white' }}>
                                                    <FormControlLabel
                                                        value="2"
                                                        control={<Radio style={{ color: 'white' }} />}
                                                        label=""
                                                    />
                                                </TableCell>
                                                <TableCell style={{ color: 'white' }}>
                                                    <FormControlLabel
                                                        value="3"
                                                        control={<Radio style={{ color: 'white' }} />}
                                                        label=""
                                                    />
                                                </TableCell>
                                                <TableCell style={{ color: 'white' }}>
                                                    <FormControlLabel
                                                        value="4"
                                                        control={<Radio style={{ color: 'white' }} />}
                                                        label=""
                                                    />
                                                </TableCell>
                                            </RadioGroup>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: '20px' }}
                    disabled={isSubmitted}
                >
                    Submit
                </Button>
            </Paper>
        </div>
    );
};

export default Test;
