import React, {useState, useEffect} from 'react'
import { Grid, Button, Card, CardMedia, CardContent, Typography } from '@mui/material'
import axios from 'axios';
import {useParams} from "react-router-dom"

function DisplayPost() {
  const [post, setPost] = useState({})
  let {id} = useParams()


  useEffect(() => { async function fetchData(){
      const {data} = await axios.get("http://localhost:4000/posts/" + id)
      setPost(data);
      console.log(data)
    }
    fetchData();
  }, [id])

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
            </CardContent>
        </Card>
    </div>
  )
}

export default DisplayPost
