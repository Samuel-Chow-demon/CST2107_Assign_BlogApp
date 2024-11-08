import { Box, Button, Chip, TextField, Typography } from '@mui/material'
import React, { useState, useContext } from 'react'

import { addDoc, collection } from 'firebase/firestore';
import { blogCollectionReference } from '../fireBase/Database.js';
import Alert from './Alert';
//import { Link } from 'react-router-dom';
import { blue, grey } from '@mui/material/colors';
import userContext from '../context/userContext.js';
import { useNavigate } from 'react-router-dom';

const categoriesInit = {
    'Tech' : grey[500],
    'News' : grey[500],
    'Sports' : grey[500],
    'Science' : grey[500]
};

const CreateBlog = () => {

    const {_currentUser, setCurrentUser} = useContext(userContext);
    const [blogInfo, setBlogInfo] = useState({
        userId: _currentUser.uid,
        userName: _currentUser.email.split("@")[0],       // Use the prefix name from the email as the userName
        title: '',
        description: '',
        image: ''
    });
    const [alertConfig, setAlertConfig] = useState({});

    const [categories, setCategory] = useState(categoriesInit);

    const navigate = useNavigate();


    const handleCreateBlog = async () => {
       try {
        await addDoc(blogCollectionReference, blogInfo);
        setAlertConfig({...alertConfig, message:'Succesfully Created a blog', color: 'success', isOpen: true })

        setTimeout(()=>{
            navigate("/viewblogs");
        }, 1000)

       } catch (error) {
        setAlertConfig({...alertConfig, message:'There was an error creating blog', color: 'error', isOpen: true })
       }
    }

    const handleCategoryClick = (categoryName) => {
        setBlogInfo({...blogInfo, categoryName})

        // Reset all to the Grey color
        setCategory(categoriesInit);
        // Follow with the previous state, only the selected category change the color to blue
        setCategory(prevState=>({
            ...prevState,
            [categoryName] : blue[500]
        }))
    }


    return (
        <Box sx={{
                width: '90vw',
                height: '100vh',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center'
            }}>
            <Box border="1px solid black" padding="50px" borderRadius="12px" 
                 display="flex" flexDirection="column" gap="20px"
                 textAlign="center"
                 sx={{
                    width:'500px',
                    height: 'auto'
                 }}>
                <Typography variant="h3" textAlign="center">Create your own Blogs</Typography>
                <TextField style={{color: 'white'}} type="text" placeholder='Enter Blog Title here!' value={blogInfo.title} onChange={(e) => setBlogInfo({ ...blogInfo, title: e.target.value })} />

                <TextField type="text" placeholder='Enter Blog Description here!' value={blogInfo.description} onChange={(e) => setBlogInfo({ ...blogInfo, description: e.target.value })} />

                <Box
                    sx={{
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        gap:'4px'
                    }}>
                    {
                        Object.entries(categories).map(([categoryName, dispColor], index) => {
                            return <Chip key={index} label={categoryName} onClick={() => handleCategoryClick(categoryName)} 
                                    sx={{
                                        backgroundColor: dispColor
                                    }}/>
                        })
                    }

                </Box>
                <TextField type="text" placeholder='Please Paste url of the image' value={blogInfo.image} onChange={(e) => setBlogInfo({ ...blogInfo, image: e.target.value })} />

                <Button variant="contained" onClick={handleCreateBlog}>Create Blog</Button>
                <Alert alertConfig={alertConfig} />
                {/* <Link to="/viewblogs">View Blogs</Link> */}
            </Box>
        </Box>
    )
}

export default CreateBlog