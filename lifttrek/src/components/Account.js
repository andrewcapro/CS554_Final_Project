import React, {useState, useEffect, useContext} from 'react'
import { Grid, Button, Card, CardMedia, CardContent, CardActionArea, Typography, useAutocomplete } from '@mui/material'
import {Link, useParams} from 'react-router-dom';
import axios from "axios";
import {AuthContext} from '../firebase/Auth';
import "../App.css"


function Account() {
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState({})
  const [lastPage, setLastPage] = useState(false);
  const [imageFormData, setImageFormData] = useState({})
  const [descFormData, setDescFormData] = useState({});
  const [editingImage, setEditingImage] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const {id} = useParams();
  const {currentUser} = useContext(AuthContext);
  const [imageExt, setImageExt] = useState(undefined);
  const [image, setImage] = useState(undefined);
  //console.log(id);

  //TODO: make this function get actually data, not test junk
  useEffect(() => { async function fetchData(){
      let data = await fetch(`http://localhost:4000/posts/${id}/${page}`)
      data = await data.json()
      setPosts(data);
      //console.log(data)
      data = await fetch(`http://localhost:4000/posts/${id}/${page+1}`)
      if(Array.isArray(data)){
        setLastPage(false);
      }
      else{
        setLastPage(true);
      }
      data = await fetch("http://localhost:4000/users/" + currentUser.uid);
      data = await data.json();
      //console.log(data);
      setUser(data);
      setImageExt(user.image);
      getImage(id);
    }
    fetchData();
  }, [page, editingImage])

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

  // const makeImagePost = async () => {
  //   document.getElementById("Title2").value = "";
  //   document.getElementById("Image").value = "";
  //   const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
  //   var formData = new FormData();
  //   const imagefile = imagePostformData.image
  //   console.log(imagefile);
  //   formData.append('image', imagefile)
  //   formData.append("title", imagePostformData.title);
  //   formData.append("currentUser", currentUser.uid);
  //   formData.append("username", data.username);
  //   //formData.append('postData', {title: imagePostformData.title, userWhoPosted: {id: currentUser.uid, username: data.username}})
  //   await axios.post("http://localhost:4000/posts/createImagePost/", formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form=data'
  //     }
  //   })
  //   setImagePostFormData({})
  // }

  const editImage = async () => {
    document.getElementById("Image").value = "";
    let formData = new FormData();
    const imagefile = imageFormData.image
    formData.append('image', imagefile)
    let {data} = await axios.post(`http://localhost:4000/users/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form=data'
      }
    })
    //await axios.post(`http://localhost:4000/users/${id}/image`, {image: URL.createObjectURL(imageFormData.image)})
    setImageFormData({})
    setEditingImage(false);
    console.log(data);
    setImageExt(data.image)
    await getImage(id);
  }

  const editDesc = async () => {
    document.getElementById("description").value = "";
    await axios.post(`http://localhost:4000/users/${id}/description`, {description: descFormData.description})
    setDescFormData({})
    setEditingDesc(false);
  }

  const getImage = async (id) => {
    try {
    //let {data} = axios.get(`https://cs554-lifttrek.s3.amazonaws.com/${id}.${imageExt}`)
    let {data} = await axios.get(`http://localhost:4000/users/${id}/image/${imageExt}`)
    console.log(data.image);
    setImage(data.image);
    } catch (e) {
      console.log(e);
    }
  }

  const handleImageChange = (e) => {
    if(e.target.name === "image"){
      setImageFormData((prev) => ({...prev, [e.target.name]: e.target.files[0]}));
    }
    else{
      setImageFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    }
    //console.log(imageFormData);
  };

  const handleTextChange = (e) => {
    setDescFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    console.log(descFormData);
  };

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
                {item.image && <CardMedia
                    sx={{
                      height: '100%',
                      width: '100%'
                    }}
                    component='img'
                    image={item.image}
                    title='item image'
                  />}
                <Typography variant='body2' color='textSecondary' component='p'>
                  {item.userWhoPosted && item.userWhoPosted.username}
                </Typography>
              </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

let cards = []
console.log(posts);
if(Array.isArray(posts)){
  cards = posts.map((post) => {
    return buildCard(post);
  }) 
}


  return (
    <div>
      {
        user.image !== "" && 
        <div className="accountInfo">
            <img src={`data:image/${imageExt};base64,${image}`} alt="profile picture" title="profile picture"></img>
        </div>
      }
      {
        id === currentUser.uid && //only show if this is the users page
        <div className="accountInfo">
        <Button onClick={()=>{
            if (!editingImage) {
                setEditingImage(true);
                setImageFormData({})
            } 
            else {
                setEditingImage(false);
            }
        }}>Edit Profile Picture</Button>
        </div>
      }
      { editingImage &&  //only show if editing image
      <div className="accountInfo">
        <br/>
      <label>Image: 
              <input
                onChange={(e) => handleImageChange(e)}
                id="Image"
                name="image"
                accept="image/*"
                type="file">
              </input>
            </label>
            <Button style={{ marginLeft: '10px' }} id="submitButton2" variant="contained" onClick={editImage}>
            Submit
          </Button>
          </div>
      }
      {imageFormData.image && editingImage && //preview of image
          <div className="accountInfo">
          <br/>
          <img id="displayimage" src={URL.createObjectURL(imageFormData.image)} alt="profile picture to be" title="profile picture to be" width="250"/>
          <br/>
          </div>
    }

      {
        user.username && user.email &&
        <div className="accountInfo">
            <h2>{user.username}</h2>
            <h3>{user.email}</h3>
        </div>
      }


      {
        user.description !== "" &&
        <div className="accountInfo">
            {user.description}
        </div>
      }
      {
        id === currentUser.uid && //only show if this is the users page
        <div className="accountInfo">
        <Button onClick={()=>{
            if (!editingDesc) {
                setEditingDesc(true);
                setDescFormData("")
            } 
            else {
                setEditingDesc(false);
            }
        }}>Edit description</Button>
        </div>
      }
      { editingDesc &&  //only show if editing image
      <div className="accountInfo">
        <br/>
      <label>Description: 
              <input
                onChange={(e) => handleTextChange(e)}
                id="description"
                name="description"
                placeholder='Enter Description...'>
              </input>
            </label>
            <Button style={{ marginLeft: '10px' }} id="submitButton2" variant="contained" onClick={editDesc}>
            Submit
          </Button>
          </div>
      }


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

export default Account
