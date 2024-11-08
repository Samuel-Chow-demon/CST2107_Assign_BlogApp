import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { blogCollectionReference, userRecordCollectionReference } from '../fireBase/Database.js';
import { doc, getDoc, addDoc, setDoc } from 'firebase/firestore';
import BlogCard from '../components/BlogCard';
import { Box, CircularProgress } from '@mui/material';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom'

import userRecordContext from '../context/userRecordContext.js';

const ViewBlogDetailsPage = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [alertConfig, setAlertConfig] = useState({});

  const {userRecordDoc, setUserRecordDoc} = useContext(userRecordContext);

  useEffect(() => {

    const getBlogData = async () => {

      const snap = await getDoc(doc(blogCollectionReference, id))
      if (snap.exists()) {
        console.log(snap.data(), 'snap.data()')
        setBlogData(snap.data()); 
      }
      else
      {
        setAlertConfig({...alertConfig, message:'Blog Deleted Or Not Exist Any More', color: 'success', isOpen: true })

        setTimeout(()=>{
          navigate('/viewblogs')
        }, 1000);
      }
      setIsLoading(false);
    }

    getBlogData();

  }, [id])

  const likeBlog = async () =>{

    // If Doc Exist
    if (userRecordDoc && userRecordDoc.data())
    {
        const newList = [...userRecordDoc.data().likedBlogIDs, id];
        console.log(newList);
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

    setAlertConfig({...alertConfig, message:'Succesfully Liked a blog', color: 'success', isOpen: true })

    setTimeout(()=>{
        setAlertConfig({...alertConfig, isOpen: false })
    }, 1000);
  }

  const cancelLikeBlog = async () =>{

    if (userRecordDoc && userRecordDoc.data())
    {
        const likeBlowIDs = userRecordDoc.data().likedBlogIDs;
        //console.log("Cancel", likeBlowIDs);
        const newList = likeBlowIDs.filter(likedId => likedId !== id);
        await setDoc(userRecordDoc.ref, {
            likedBlogIDs : newList
        }, {merge: true});                  // Auto create if not ever exist

        setAlertConfig({...alertConfig, message:'Cancelled Like a blog', color: 'success', isOpen: true })

        setTimeout(()=>{
            setAlertConfig({...alertConfig, isOpen: false })
        }, 1000);
    }
  }

  const isBlogLiked = ()=>{
    return userRecordDoc != null && userRecordDoc.data().likedBlogIDs.includes(id);
  }

  return (
    <Box sx={{
      display:'flex',
      flexDirection:'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginY: '100px',
      height: '100vh',
      width: '100vw'
    }}>
      {  isLoading ? 
        <Box marginTop={5}>
            <CircularProgress />
        </Box>
        :
        <BlogCard blog={blogData} isBlowDetailsView={true}
                  likeBlog={likeBlog} isBlogLiked={isBlogLiked}
                  cancelLikeBlog={cancelLikeBlog}/>
      }
      <Alert alertConfig={alertConfig} />
    </Box>
  )
}

export default ViewBlogDetailsPage