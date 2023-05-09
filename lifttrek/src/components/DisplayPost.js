import React, {useState, useEffect, useContext} from 'react'
import { Grid, Button, Card, CardMedia, CardContent, CardActionArea, Typography } from '@mui/material'
import axios from 'axios';
import {useParams} from "react-router-dom"
import CreateComment from './CreateComment';
import TextField from '@mui/material';
import {AuthContext} from '../firebase/Auth';
import Link from '@mui/material/Link'

function DisplayPost() {
  const [post, setPost] = useState({})
  let {id} = useParams()
  const [postComments, setPostComments] = useState([]);
  const [image, setImage] = useState(undefined);
  const {currentUser} = useContext(AuthContext);
  const [likeStatus, setLikeStatus] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [profileLink, setProfileLink] = useState('')


  useEffect(() => { async function fetchData(){
      const {data} = await axios.get("http://localhost:4000/posts/" + id)
      setPost(data);
      setPostComments(data.comments);
      if (data.likes.includes(currentUser.uid)) {
        setLikeStatus(true);
      }
      setProfileLink('/account/' + data.userWhoPosted.id);
      setLikesCount(data.likes.length);
      if (data.image){
        await getImage(data.id);
      }
      console.log(data);
    }
    fetchData();
  }, [id])

  const getImage = async (id) => {
    try {
    //let {data} = axios.get(`https://cs554-lifttrek.s3.amazonaws.com/${id}.${imageExt}`)
    let {data} = await axios.get(`http://localhost:4000/posts/image/${id}`)
    //console.log(data.image);
    setImage(data.image);
    forceRerender();
    } catch (e) {
      console.log(e);
    }
  }

  function forceRerender(){
    setPost((prev) =>{
      return {...prev};
    })
  }

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
                  image={`data:image/${post.image};base64,${image}`}
                  title='post image'
                />}
                <Typography style={{ wordBreak: "break-word" }} variant='body2' color='textSecondary' component='p'>
                  {post.body && post.body}
                </Typography>

                {post.workout &&
                <div>
                  <Typography component='ul'>
                  {post.workout.exercises.map((exercise) => {
                    return (
                        <li key={exercise.name}>
                          <h3>{exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}</h3>
                          <p>Type: {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}</p>
                          <p>Muscle: {exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1)}</p>
                          <p>Equipment: {exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}</p>
                          <p>Difficulty: {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}</p>
                          <p>{exercise.sets} sets of {exercise.reps} reps</p>
                          { exercise.instructions &&
                            <p>Instructions: {exercise.instructions}</p>
                          }
                        </li>
                      )
                  })}
                  </Typography>
                </div>
                }
                <br></br>
              <Typography variant='body2' color='textSecondary' component='p'>
                Posted by: <Link href={profileLink}>{post.userWhoPosted && post.userWhoPosted.username}</Link>
              </Typography>
              <h3>Likes ({likesCount})</h3>
              {
                likeStatus == false && <Button style={{ backgroundColor: '#008a00' }} variant="contained" onClick={() => changeLike(post.id)}>
                  Like
                </Button>
              }
              {
                likeStatus == true && <Button style={{ backgroundColor: '#EE0000' }} variant="contained" onClick={() => changeLike(post.id)}>
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
                        <Typography style={{ wordBreak: "break-word" }} variant='body2' color='textSecondary' component='p'>
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
