import React, {useState, useEffect, useContext} from 'react'
import { Grid, Button, Card, CardMedia, CardContent, CardActionArea, Typography } from '@mui/material'
import axios from 'axios';
import {useParams} from "react-router-dom"
import CreateComment from './CreateComment';
import TextField from '@mui/material';
import {AuthContext} from '../firebase/Auth';

function DisplayPost() {
  const [post, setPost] = useState({})
  let {id} = useParams()
  const [postComments, setPostComments] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const [likeStatus, setLikeStatus] = useState(false)
  const [likesCount, setLikesCount] = useState(0)


  useEffect(() => { async function fetchData(){
      const {data} = await axios.get("http://localhost:4000/posts/" + id)
      setPost(data);
      setPostComments(data.comments);
      if (data.likes.includes(currentUser.uid)) {
        setLikeStatus(true);
      }
      setLikesCount(data.likes.length);
      console.log(data);
    }
    fetchData();
  }, [id])

  async function UpdateComments() {
    const {data} = await axios.get("http://localhost:4000/posts/" + id)
    setPostComments(data.comments)
  }

  async function UpdateLikes() {
    const {data} = await axios.get("http://localhost:4000/posts/" + id)
    setLikeStatus(!likeStatus)
    setLikesCount(data.likes.length)
  }

  const changeLike = async (post_id) => {
    const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
    await axios.post(`http://localhost:4000/posts/like/${post_id}`, {userWhoPosted: {id: currentUser.uid, username: data.username}})
    UpdateLikes();
  }

  const deleteComment = async (post_id, comment_id) =>  {
    const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
    await axios.post(`http://localhost:4000/posts/delete_comment/${post_id}`, {userWhoPosted: {id: currentUser.uid, username: data.username}, commentId: comment_id})
    UpdateComments();
  }

  return (
    <div>
      <Card
          variant='outlined'
          sx={{
            maxWidth: 500,
            height: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 5,
            border: '1px solid #1e8678',
            boxShadow:
              '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
          }}
        >
            <CardContent>
              <Typography
                sx={{
                  borderBottom: '1px solid #1e8678',
                  fontWeight: 'bold'
                }}
                gutterBottom
                variant='h6'
                component='h2'
              >
                {post.title}
              </Typography>
              {post.image && <CardMedia
                  sx={{
                    height: '100%',
                    width: '100%'
                  }}
                  component='img'
                  image={post.image}
                  title='post image'
                />}
              <Typography variant='body2' color='textSecondary' component='p'>
                Posted by: {post.userWhoPosted && post.userWhoPosted.username}
              </Typography>
              <h3>Likes ({likesCount})</h3>
              {
                likeStatus == false && <Button style={{ backgroundColor: '#32CD32' }} variant="contained" onClick={() => changeLike(post.id)}>
                  Like
                </Button>
              }
              {
                likeStatus == true && <Button style={{ backgroundColor: '#FF0000' }} variant="contained" onClick={() => changeLike(post.id)}>
                  Remove Like
                </Button>
              }
              <h3>Comments ({postComments.length})</h3>
              <CreateComment post={post} UpdateComments={UpdateComments}/>
              <br></br>
              <Typography variant='body3' color='textSecondary' component='div'>
                {postComments &&
                  postComments.map((comment) =>
                      <Grid key={comment.id}>
                      <Card
                      variant='outlined'
                      sx={{
                        maxWidth: 495,
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginBottom: 1,
                        borderRadius: 5,
                        border: '1px solid #1e8678',
                      }}
                    >
                      <CardContent>
                        <Typography
                          sx={{
                            borderBottom: '1px solid #1e8678',
                            fontWeight: 'bold'
                          }}
                          gutterBottom
                          variant='h6'
                          component='h2'
                        >
                          {comment.userWhoPosted.username}
                          {
                            comment.userWhoPosted.id == currentUser.uid &&
                            <Button style={{ float: "right", top: "-10px" }} id="submitButton" variant="contained" onClick={() => deleteComment(post.id, comment.id)}>
                                Delete Comment
                            </Button>
                          }
                        </Typography>
                        <Typography variant='body2' color='textSecondary' component='p'>
                            {comment.body}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  )
                }
              </Typography>
            </CardContent>
        </Card>
    </div>
  )
}

export default DisplayPost
