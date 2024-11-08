import { Box, Button, Typography } from '@mui/material'
import { brown, grey } from '@mui/material/colors';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const LangPage = () => {

  const navigate = useNavigate();

  return (
    <Box sx={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width: '100vw',
        height: '100vh'
    }}>
        <Typography sx={{
            fontSize:'5rem'
        }}>
            Welcome to BlogApp
        </Typography>
        <Button onClick={()=>{navigate('/signin')}} variant="outlined" 
                sx={{ color: grey[200],
                         backgroundColor: brown[800],
                         border: '1px solid white',
                         fontSize:'36px',
                         '&:hover': {
                            backgroundColor: brown[400]
                         }
                         }}>Sign In</Button>

    </Box>
  )
}

export default LangPage