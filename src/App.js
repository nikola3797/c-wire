import {useState, useEffect} from 'react';
import axios from 'axios';
import styles from './App.module.css';
import Posts from './Posts';

const App = () => {

  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(1);
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const localUser = localStorage.getItem('user_email') ? JSON.parse(localStorage.getItem('user_email')) : {};

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

  const onChangeEmailHandler = (e) => {
    setEmail(e.target.value)
  };

  const onChangePostTitleHandler = (e) => {
    setPostTitle(e.target.value)
  };

  const onChangePostBodyHandler = (e) => {
    setPostBody(e.target.value)
  };

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
  }

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
        <div>
          <span className={styles.Title}>Enter email to validate</span>
          <div style={{display: 'flex', marginTop: '15px'}}>
            <input
              className={styles.InputField}
              value={email} type='text'
              onChange={e => onChangeEmailHandler(e)}
            ></input>
            <button
              className={styles.ButtonStyle}
              onClick={() => emailValidation()}>
            Validate</button>
          </div>
        </div>
        {localUser.userId && <div>
          <span className={styles.Title}>Create new Post</span>
            <div style={{marginTop: '15px', marginBottom: '15px'}}>
              <input
                className={styles.InputField}
                style={{marginBottom: '10px', padding: '5px 8px'}}
                placeholder='Post title'
                value={postTitle}
                type='text'
                onChange={e => onChangePostTitleHandler(e)}
              ></input>
              <textarea
                className={styles.InputField}
                placeholder='Post body'
                style={{width: '90%'}}
                value={postBody}
                type='text'
                onChange={e => onChangePostBodyHandler(e)}
              ></textarea>
            </div>
            <button
                className={styles.ButtonStyle}
                onClick={() => createNewPost()}
            >Submit new Post
            </button>
        </div>}
      </div>
     <Posts posts={posts}  localUser={localUser}/>
    </div>
  );
}

export default App;
