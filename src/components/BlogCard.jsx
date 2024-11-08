/* eslint-disable react/prop-types */
import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography, Box } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red, grey, blue } from '@mui/material/colors';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const BlogCard = (props) => {
    const { blog,
             deleteBlog = () => {}, showDeleteIcon = true,
             likeBlog = ()=>{}, cancelLikeBlog = ()=>{}, showLikeIcon = true,
             isBlogLiked = false, isBlowDetailsView = false } = props;
    // Favorites Table as well in the database

    const navigate = useNavigate();

    const [isFlagLiked, setFlagLiked] = useState(isBlogLiked);

    const toggleLikeBlog = ()=>{
        isFlagLiked ? cancelLikeBlog(blog.id) : likeBlog(blog.id);
        setFlagLiked(!isFlagLiked);
    }

    return (
        <Card style={{ position: 'relative' }}>
            <CardMedia
                component="img"
                sx={{ 
                        height: isBlowDetailsView ? '50vh' : '30vh',
                        width: isBlowDetailsView ? '50vw' : '30vw',
                        objectFit: 'cover'
                    }}
                image={blog.image}
                alt="No Picture Provided"
                title=""
            />
            {
                !isBlowDetailsView && 
                showDeleteIcon && <IconButton style={{ position: 'absolute', right: '10px', top: '10px', width: 40, height: 40, padding: 2,
                                                        backgroundColor:grey[200], opacity:0.8 }} 
                                    aria-label="delete" size="large"
                                    onClick={() => deleteBlog(blog.id)}>
                                    <DeleteForeverIcon fontSize="inherit" />
                                </IconButton>
            }
            {/* navigate -1 can move to previous page */}
            {
                isBlowDetailsView && 
                                <IconButton style={{ position: 'absolute', right: '10px', top: '10px', color:blue[500]}} 
                                            size="large" onClick={() => navigate(-1)}>
                                    <KeyboardReturnIcon fontSize="inherit" /> Back
                                </IconButton>
            }
            {
                showLikeIcon && <IconButton style={{ position: 'absolute',
                                                     left: '10px', top: '10px',
                                                     outline: 'none', 
                                                     color: isFlagLiked ? red[300] : grey[300],
                                                     fontSize: isBlowDetailsView ? '3rem' : '1.8rem'}}
                                                     onClick={toggleLikeBlog}>
                                    {
                                        isFlagLiked ? <FavoriteIcon fontSize="inherit" /> : <FavoriteBorderIcon fontSize="inherit" />
                                    }
                                </IconButton>
            }
            <CardContent sx={{
                    padding: isBlowDetailsView ? '50px' : '15px'
                }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexGrow:  1,
                    justifyContent:'space-between'
                }}>
                    <Typography gutterBottom variant={isBlowDetailsView? "h3" : "h5"} component="div">
                        {blog.title}
                    </Typography>
                    <Typography gutterBottom variant={isBlowDetailsView? "h5": "body1"} component="div"
                        sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        by {blog.userName}
                    </Typography>
                </Box>
                <Typography variant={isBlowDetailsView ? "h5" : "body2"} 
                            sx={{ 
                                color: 'text.secondary',
                                marginTop: isBlowDetailsView? '2rem' : '1rem'
                                }}>
                    {blog.description}
                </Typography>
                <Chip label={blog.categoryName ? blog.categoryName : "N/A"} variant="outlined"
                    sx={{
                        marginTop: isBlowDetailsView ? '5rem' : '1rem',
                        fontSize: isBlowDetailsView ? '1.5rem' : '0.9rem',
                        height: isBlowDetailsView ? 40 : 5,
                        padding: '10px'
                    }}/>

            </CardContent>

            {
                !isBlowDetailsView && 
                    <CardActions sx={{display:'flex', justifyContent:'center'}}>
                        <Button color='secondary' variant='contained' onClick={() => navigate(`/viewblogs/${blog.id}`)}>Learn More</Button>
                    </CardActions>
            }
        </Card>
    )
}

export default BlogCard