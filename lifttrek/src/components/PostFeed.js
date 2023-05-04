import React, {useState, useEffect} from 'react'
import { Grid, Button, Card, CardContent, CardActionArea, Typography } from '@mui/material'
import {Link} from 'react-router-dom';


function PostFeed() {
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState([])

  //TODO: make this function get actually data, not test junk
  useEffect(() => { async function fetchData(){
      let testData = []
      let i = 0;
      for(i = 0; i<15; i++){
        testData.push({id: i, userThatPosted: {name: "user"+i, id: i+100}, title: "Test"});
      }
      setPosts(testData.slice((page-1)*10, page*10))
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
                  component='h3'
                >
                  {item.title}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {item.userThatPosted.name}
                </Typography>
              </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

let cards = posts.map((post) => {
    return buildCard(post);
}) 

  return (
    <div>
      {page>1 && <Button onClick={decrementPage}>
          Previous Page
        </Button>}
      <Button onClick={incrementPage}>
          Next Page
      </Button>
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
