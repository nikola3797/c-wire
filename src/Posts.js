import styles from './App.module.css';

const Posts = (props) => {
    return (
        <div>
            {props.localUser.userId &&
                <div className={styles.Top}><span className={styles.SingleArticle}>User Id:</span> {props.localUser.userId}</div>}
            {props.posts.length > 0 && props.posts.map(item => (
                <div className={styles.Article} key={item.id}>
                    <span style={{display: 'block'}}><span className={styles.SingleArticle}>Article Id:</span> {item.id} </span>
                    <span style={{display: 'block'}}><span className={styles.SingleArticle}>Title:</span> {item.title} </span>
                    <span style={{display: 'block'}}><span className={styles.SingleArticle}>Body:</span> {item.body} </span>
                </div>
            ))}
        </div>
    );
};

export default Posts;