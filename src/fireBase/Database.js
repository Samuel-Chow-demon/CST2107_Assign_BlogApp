import { collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BLOG_DB_NAME = "blogs";
const blogCollectionReference = collection(db, BLOG_DB_NAME);

const USER_RECORD_DB_NAME = "userrecords";
const userRecordCollectionReference = collection(db, USER_RECORD_DB_NAME);


export{BLOG_DB_NAME,
        blogCollectionReference,
        USER_RECORD_DB_NAME,
        userRecordCollectionReference
}