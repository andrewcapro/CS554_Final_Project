import React, {useState, useEffect} from 'react'
import { Grid, Button, Card, CardMedia, CardContent, CardActionArea, Typography } from '@mui/material'
import axios from 'axios';
import {useParams} from "react-router-dom"
import CreateComment from './CreateComment';
import TextField from '@mui/material';

function DisplayPost() {
  const [post, setPost] = useState({})
  let {id} = useParams()
  const [postComments, setPostComments] = useState([]);


  useEffect(() => { async function fetchData(){
      const {data} = await axios.get("http://localhost:4000/posts/" + id)
      setPost(data);
      setPostComments(data.comments)
      console.log(data)
    }
    fetchData();
  }, [id])

  async function UpdateComments() {
    const {data} = await axios.get("http://localhost:4000/posts/" + id)
    setPostComments(data.comments)
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
                      <CardActionArea>
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
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {comment.body}
                            </Typography>
                          </CardContent>
                      </CardActionArea>
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
