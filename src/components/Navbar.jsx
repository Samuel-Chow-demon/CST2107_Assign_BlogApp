import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import React, {useEffect, useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import userContext from '../context/userContext';

const navSelection = {
    'Create Blogs' : "/home",
    'View Blogs' : "/viewblogs",
    'Favourite Blogs' : "/viewblogs?favourite=true"
}

const Navbar = () => {

    const navigate = useNavigate();
    const {_currentUser, setCurrentUser} = useContext(userContext);
    const [needDisplayNavMenu, setNeedDispNavMenu] = useState(false);

    useEffect(()=>{
       setNeedDispNavMenu(_currentUser != null);
    }, [_currentUser]);

    const handleSignout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null); // reset local storage
            navigate('/');
        } catch (error) {
            // Handl erorr
            console.log(error)
        }
    }

    return (
        <AppBar style={{ display: 'flex'}}>
            <Toolbar>
                <Box sx={{
                    display: 'flex',
                    flexGrow: 1,
                    marginLeft: '100px',
                    gap: '40px'
                }}>
                    {
                        needDisplayNavMenu &&
                        Object.entries(navSelection).map(([navCat, path], index)=>{
                            return (

                                <Button key={index} onClick={()=>{navigate(path)}}
                                        sx={{
                                            display:'block',
                                            color: 'white',
                                            fontSize: '1.2rem'
                                        }}>
                                        {navCat}
                                </Button>
                            )
                        })
                    }
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems='center'>

                    {
                        _currentUser &&
                            <Typography sx={{
                                fontSize:'1.2rem',
                                marginRight: '1rem'
                            }}>
                                WELCOME, {_currentUser.email}
                            </Typography>
                    }
                    {
                        _currentUser ? 
                        <Button onClick={handleSignout} variant="outlined" style={{ color: 'white', border: '1px solid white' }}>Sign Out</Button>
                        :
                        <Button onClick={()=>{navigate('/signin')}} variant="outlined" style={{ color: 'white', border: '1px solid white' }}>Sign In</Button>
                    }
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar