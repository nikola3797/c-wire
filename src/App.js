import {useState, useEffect} from 'react';
import axios from 'axios';
import styles from './App.module.css';
import Posts from './Posts';

const App = () => {

  // local state for email validation
  const [email, setEmail] = useState('');

  // local state for setting user id
  const [userId, setUserId] = useState(1);

  // local state for populating posts from the given API
  const [posts, setPosts] = useState([]);

  // local state for creating new post title
  const [postTitle, setPostTitle] = useState('');

  // local state for creating new post body
  const [postBody, setPostBody] = useState('');

  // variable that checks if we have already logged user
  const localUser = localStorage.getItem('user_email') ? JSON.parse(localStorage.getItem('user_email')) : {};

  /* 
    email validation function that sends error when user input doesn't match the email format, if it does it
    stores user object that has user id and email to local storage, so when the page is refreshed or if
    browser is closed and opend again, user object stays in local storage and in input field we get same user
    that was logged before.
  */
  const emailValidation = () => {
    const mailFormat = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (mailFormat.test(email)) {
      setUserId(userId + 1);
      localStorage.setItem('user_email', JSON.stringify({userEmail: email, userId: userId}));
      return true;
    } else {
      alert('Email not Valid!');
      return false;
    }
  };

  /* 
    create new post function that creates new post as object with id, user id, title and body. Function checks first if we have
    provided post body and title, if not shows alert that we must provide both, if we have provided both we are sending POST request
    to the given API and updating posts array with the newly added post. After that we are clearing the input fields.
  */

  const createNewPost = async() => {
    if (postBody !== '' && postTitle !== '') {
      let postId = posts[posts.length - 1].id;
      const post = {
        id: postId + 1,
        userId: localUser.userId,
        title: postTitle,
        body: postBody,
      }
      await axios.post(`https://jsonplaceholder.typicode.com/posts?userId=${localUser.userId}`, post);
      setPosts((prevPosts) => {
        return prevPosts.concat(post);
      });
      setPostBody('');
      setPostTitle('');
    } else {
      alert('Provide Post body and title!')
    }
  };

  /* 
    useEffect react hook which sets email input field to users email from local storage, then checks if there is a user already in local storage
    if yes, then it calls given api with user id param to list just posts for that particular user, if not calls api to show all posts available.
    If response status code is 200 which means ok, than we store response in posts state.
  */

  useEffect(async() => {
    setEmail(localUser.userEmail);
    const response = await axios(
      localUser.userId ? `https://jsonplaceholder.typicode.com/posts?userId=${localUser.userId}` : 'https://jsonplaceholder.typicode.com/posts',
    );
    if (response.status === 200)
    setPosts(response.data);
  }, [localUser.userId]);

  return (
    <div className={styles.App}>
      <div style={{marginBottom: '50px', display: 'flex', justifyContent: 'space-between'}}>
        {/*
          div for email validation
        */}
        <div>
          <span className={styles.Title}>Enter email to validate</span>
          <div style={{display: 'flex', marginTop: '15px'}}>
            <input
              className={styles.InputField}
              value={email} type='text'
              onChange={e => setEmail(e.target.value)}
            ></input>
            <button
              className={styles.ButtonStyle}
              onClick={() => emailValidation()}>
            Validate</button>
          </div>
        </div>
        {/*
          checks if there is existing user, because only if there is user logged crating of new post can be made
          otherwise its not possible this functionality won't be visible
        */}
        {localUser.userId && <div>
          <span className={styles.Title}>Create new Post</span>
            <div style={{marginTop: '15px', marginBottom: '15px'}}>
              <input
                className={styles.InputField}
                style={{marginBottom: '10px', padding: '5px 8px'}}
                placeholder='Post title'
                value={postTitle}
                type='text'
                onChange={e => setPostTitle(e.target.value)}
              ></input>
              <textarea
                className={styles.InputField}
                placeholder='Post body'
                style={{width: '90%'}}
                value={postBody}
                type='text'
                onChange={e => setPostBody(e.target.value)}
              ></textarea>
            </div>
            <button
                className={styles.ButtonStyle}
                onClick={() => createNewPost()}
            >Submit new Post
            </button>
        </div>}
      </div>
      {
        // common component Posts for listing all posts, takes two porps, local user and posts
      }
     <Posts posts={posts}  localUser={localUser}/>
    </div>
  );
}

export default App;
