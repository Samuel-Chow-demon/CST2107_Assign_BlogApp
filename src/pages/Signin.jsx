import React, { useState, useContext } from 'react'
import TextField from '@mui/material/TextField';
import { Box, Button, Typography } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { getErrorCode } from '../utils';
import { green } from '@mui/material/colors';
import userContext from '../context/userContext';

const SignInPage = () => {

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [alertConfig, setAlertConfig] = useState({});
  const navigate = useNavigate();
  
  const {_currentUser, setCurrentUser} = useContext(userContext);


  const handleSignin = async () => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        setAlertConfig({...alertConfig, message:'Succesfully Signed in', color: 'success', isOpen: true })
        setCurrentUser(user);
        setTimeout(() => {
            navigate('/home');
        }, 2000);

    } catch (error) {
        const message = getErrorCode(error.code);
        setAlertConfig({...alertConfig, message, color: 'error', isOpen: true })
    }
  }

  return (
    <Box
      sx={{
        width: '90vw',
        height: '100vh',
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Box display="flex" flexDirection="column" gap="12px" 
           border="1px solid black" padding="40px" borderRadius="12px"
           textAlign="center"
           sx={{
            width:'300px',
            heigth: 'auto'
           }}>
          <Typography variant="h3" textAlign="center">Sign in</Typography>
          <TextField
            required
            id="email"
            label="Email"
            //defaultValue=""
            placeholder='Enter your email'
            type='email'
            value={credentials.email}
            onChange={(e) => setCredentials({
              ...credentials,
              email: e.target.value
            })}
          />
          <TextField
            required
            id="password"
            label="Password"
            //defaultValue=""
            placeholder='Enter your Password'
            type='password'
            value={credentials.password}
            onChange={(e) => setCredentials({
              ...credentials,
              password: e.target.value
            })}
          />
          <Button onClick={handleSignin} variant="contained"
            sx={{
              backgroundColor:green[500]
            }}>Signin</Button>
          <Alert alertConfig={alertConfig} />
          <Link to="/signup" >Dont have an account? Signup</Link>
      </Box>
    </Box>
  )
}

export default SignInPage