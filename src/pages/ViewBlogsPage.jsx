import { deleteDoc, addDoc, doc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react'
import { blogCollectionReference, BLOG_DB_NAME,
         userRecordCollectionReference
        } from '../fireBase/Database.js';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import BlogCard from '../components/BlogCard';
import Alert from '../components/Alert';
import { grey } from '@mui/material/colors';
import userContext from '../context/userContext.js';
import userRecordContext from '../context/userRecordContext.js';
import { useLocation } from 'react-router-dom';

const ViewBlogsPage = () => {

    const [blogsList, setBlogsList] = useState([]);
    const {userRecordDoc, setUserRecordDoc} = useContext(userRecordContext);
    const [loading, setLoading] = useState(true);

    const [alertConfig, setAlertConfig] = useState({});

    const {_currentUser, setCurrentUser} = useContext(userContext);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isFavourite = queryParams.get('favourite') === 'true'; // If normal, would return null

    const getBlogsList = async () => {
        const blogs = await getDocs(blogCollectionReference);
        const extractedBlogs = blogs.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })

        setBlogsList(extractedBlogs);
        //console.log(extractedBlogs, BLOG_DB_NAME)
    }

    const getUserRecordDoc = async ()=>{

        //console.log(_currentUser.uid);

        const queryUserDoc = query(userRecordCollectionReference, where("userId", "==", _currentUser.uid), limit(1));

        const querySnapShot = await getDocs(queryUserDoc);

        if (!querySnapShot.empty)
        {
            const doc = querySnapShot.docs[0];
            setUserRecordDoc(doc);
            //console.log(doc.data());
        }
        else
        {
            setUserRecordDoc(null);
        }
    }

    const deleteBlog = async (id) => {
        // First get the doc you want to delete
        const blogDoc = doc(blogCollectionReference, id); // We will get the  blog we are trying to delete.

        //console.log(blogDoc, 'blogDoc'); 
        try {
            await deleteDoc(blogDoc);
            setAlertConfig({...alertConfig, message:'Succesfully deleted the blog', color: 'success', isOpen: true })

            setTimeout(()=>{
                setAlertConfig({...alertConfig, isOpen: false })
            }, 1000);

        } catch (error) {
            setAlertConfig({...alertConfig, message:'Error Deleting the blog', color: 'error', isOpen: true })
        }
    }

    const likeBlog = async (id) =>{

        // If Doc Exist
        if (userRecordDoc && userRecordDoc.data())
        {
            const newList = [...userRecordDoc.data().likedBlogIDs, id];
            //console.log(newList);
            const setList = new Set(newList);

            await setDoc(userRecordDoc.ref, {
                likedBlogIDs : [...setList]
            }, {merge: true});
        }
        else
        {
            await addDoc(userRecordCollectionReference, {
                userId : _currentUser.uid,
                likedBlogIDs : [id]
            });
        }

        getUserRecordDoc();
        setAlertConfig({...alertConfig, message:'Succesfully Liked a blog', color: 'success', isOpen: true })

        setTimeout(()=>{
            setAlertConfig({...alertConfig, isOpen: false })
        }, 1000);
    }

    const cancelLikeBlog = async (id) =>{

        if (userRecordDoc && userRecordDoc.data())
        {
            const likeBlowIDs = userRecordDoc.data().likedBlogIDs;
            //console.log("Cancel", likeBlowIDs);
            const newList = likeBlowIDs.filter(likedId => likedId !== id);
            await setDoc(userRecordDoc.ref, {
                likedBlogIDs : newList
            }, {merge: true});                  // Auto create if not ever exist
            getUserRecordDoc();
        }

        setAlertConfig({...alertConfig, message:'Cancelled Like a blog', color: 'success', isOpen: true })

        setTimeout(()=>{
            setAlertConfig({...alertConfig, isOpen: false })
        }, 1000);
    }

    const isBlogLiked = (id)=>{
        return userRecordDoc != null && userRecordDoc.data().likedBlogIDs.includes(id);
    }

    const showDelButton = (blogUserId)=>{
        return _currentUser != null && _currentUser.uid === blogUserId;
    }
    
    useEffect(() => {
        getBlogsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertConfig])

    useEffect(() => {

        const getUserRec = async ()=>{
            await getUserRecordDoc();
            setLoading(false);
        }
        getUserRec();
    }, [])

    return (
        <Box sx={{
            display:'flex',
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            height: '100vh',
            width: '100vw',
            marginTop: '12rem'
        }}>
            <Typography variant="h5"
                sx={{
                    fontSize: '60px',
                    color: grey[900]
                }}> {isFavourite ? "Favourite Blogs" : "View Blogs"}
                </Typography>
            {/* <Divider /> */}
            
            {   loading ? 
                <Box marginTop={5}>
                    <CircularProgress />
                </Box>
                :
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" width='90%' gap={3}>
                    {
                        blogsList.map((blog, index) => {

                            const isALikedBlog = isBlogLiked(blog.id);
                            const displayBlog = (isFavourite && isALikedBlog) || !isFavourite;

                            const dispDelButton = !isFavourite && showDelButton(blog.userId);

                            return displayBlog && <BlogCard key={index} blog={blog} deleteBlog={deleteBlog}
                                            likeBlog={likeBlog} cancelLikeBlog={cancelLikeBlog}
                                            isBlogLiked={isALikedBlog}
                                            showDeleteIcon={dispDelButton}/>
                        })
                    }
                </Box>
            }
            <Alert alertConfig={alertConfig} />
        </Box>
    )
}

export default ViewBlogsPage