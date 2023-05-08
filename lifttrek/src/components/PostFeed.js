import React, {useState, useEffect} from 'react'
import { Grid, Button, Card, CardMedia, CardContent, CardActionArea, Typography } from '@mui/material'
import {Link} from 'react-router-dom';
import axios from "axios";


function PostFeed() {
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState([])
  const [lastPage, setLastPage] = useState(false);

  useEffect(() => { async function fetchData(){
      /*let testData = []
      let i = 0;
      for(i = 0; i<23; i++){
        if(i%3===0){
          testData.push({id: i, userThatPosted: {name: "user"+i, id: i+100}, title: "Test", image: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"});
        }
        else{
          testData.push({id: i, userThatPosted: {name: "user"+i, id: i+100}, title: "Test"});
        }
      }
      setPosts(testData.slice((page-1)*10, page*10))
      if(testData.slice(page*10, (page+1)*10).length===0){
        setLastPage(true)
      }
      else{
        setLastPage(false);
      }*/
      let data = await fetch("http://localhost:4000/posts/page/" + page)
      data = await data.json()
      setPosts(data);
      console.log(data)
      data = await fetch("http://localhost:4000/posts/page/" + (page + 1))
      if(Array.isArray(data)){
        setLastPage(false);
      }
      else{
        setLastPage(true);
      }
    }
    fetchData();
  }, [page])

  const incrementPage = () => {
    let newPage = page+1;
    setPage(newPage);
    console.log(newPage);
  }

  const decrementPage = () => {
    let newPage = page-1;
    setPage(newPage);
    console.log(newPage);
  }

  const getImage = async (id) => {
    try {
    //let {data} = axios.get(`https://cs554-lifttrek.s3.amazonaws.com/${id}.${imageExt}`)
    let {data} = await axios.get(`http://localhost:4000/posts/image/${id}`)
    return data.image;
    } catch (e) {
      console.log(e);
    }
  }

  const buildCard = (item) => {
    return (
      <Grid item xs={12} key={item.id}>
        <Card
          variant='outlined'
          sx={{
            maxWidth: 250,
            height: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 5,
            border: '1px solid #1e8678',
            boxShadow:
              '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
          }}
        >
          <CardActionArea component={Link} to={"/post/"+item.id}>
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
                  {item.title}
                </Typography>
                {item.image && <CardMedia id={`${item.id}image`}
                    sx={{
                      height: '100%',
                      width: '100%'
                    }}
                    component='img'
                    image={item.image}
                    
                    title='item image'
                  />}
                <Typography variant='body2' color='textSecondary' component='p'>
                  Posted by: {item.userWhoPosted && item.userWhoPosted.username}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Likes: {item.likes.length} | Comments: {item.comments.length}
                </Typography>
                {/* Add number of comments and number of likes here */}
              </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  let i = -1;
  let cards = []
  let imageIds = []
  console.log(posts);
  if(Array.isArray(posts)){
    cards = posts.map((post) => {
      if (post.image) imageIds.push(post.id);
      return buildCard(post);
    }) 
  }
  console.log(cards);
  
  if (Array.isArray(posts)){
    cards.map(async (card) => {
      i++;
      let currentIm = document.getElementById(`${imageIds[i]}image`)
      if (currentIm){
      let {data} = await axios.get("http://localhost:4000/posts/" + imageIds[i])
      let ext = data.image; //stores extension at first
      console.log(imageIds[i])
      let ima = await getImage(imageIds[i]);
      currentIm.src = `data:image/${ext};base64,${ima}`
      }
    })
  }


  return (
    <div>
      {page>1 && <Button onClick={decrementPage}>
          Previous Page
        </Button>}
      {!lastPage && <Button onClick={incrementPage}>
          Next Page
      </Button>}
      <br></br>
      <br></br>
      <br></br>
      <Grid
          container
          spacing={2}
          sx={{
              flexGrow: 1,
              flexDirection: 'row'
          }}
          >
          {cards}
      </Grid> 
    </div>   
  )
}

export default PostFeed
