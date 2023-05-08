import { Button } from '@mui/material';
import React, { useState, useContext } from 'react'
import axios from "axios";
import {AuthContext} from '../firebase/Auth';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';

function CreatePost() {

  const [type, setType] = useState('');
  const [textPostformData, setTextPostFormData] = useState({});
  const [imagePostformData, setImagePostFormData] = useState({});
  const {currentUser} = useContext(AuthContext);
  const [success, setSuccess] = useState(false);


  const handleTextPostChange = (e) => {
    setTextPostFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleImagePostChange = (e) => {
    if(e.target.name === "image"){
      setImagePostFormData((prev) => ({...prev, [e.target.name]: e.target.files[0]}));
    }
    else{
      setImagePostFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    }
    console.log("image");
    console.log(imagePostformData);
  };

  const makeTextPost = async () =>  {
    document.getElementById("Title1").value = "";
    document.getElementById("Body1").value = "";
    const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
    await axios.post("http://localhost:4000/posts/createTextPost/", {title: textPostformData.title, body: textPostformData.body, userWhoPosted: {id: currentUser.uid, username: data.username}})
    setTextPostFormData({});
    setSuccess(true)
  }

  const makeImagePost = async () => {
    document.getElementById("Title2").value = "";
    document.getElementById("Image").value = "";
    const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
    var formData = new FormData();
    const imagefile = imagePostformData.image
    console.log(imagefile);
    formData.append('image', imagefile)
    formData.append("title", imagePostformData.title);
    formData.append("currentUser", currentUser.uid);
    formData.append("username", data.username);
    //formData.append('postData', {title: imagePostformData.title, userWhoPosted: {id: currentUser.uid, username: data.username}})
    await axios.post("http://localhost:4000/posts/createImagePost/", formData, {
      headers: {
        'Content-Type': 'multipart/form=data'
      }
    })
    setImagePostFormData({})
    setSuccess(true)
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <h2>Create Post</h2>
        <Button onClick={() => {setType('text')}} variant='contained' id='blueButton'>Text Post</Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => {setType('image')}} variant='contained' id='blueButton2'>Image Post</Button>
      </div>
        <br></br>
        {type === 'text' && 
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Text Post</h3>
            <TextField 
              onChange={(e) => handleTextPostChange(e)}
              name="title"
              id="Title1" 
              label="Title" 
              required
            />
            <br/>
            <TextField 
              onChange={(e) => handleTextPostChange(e)}
              name="body"
              id="Body1" 
              label="Body" 
              required
            />
            <br/>
            <Button style={{ marginLeft: '10px' }} id="submitButton" variant="contained" onClick={makeTextPost}>
              Create Post
            </Button>
            <br/>
            {success &&
            <div>
              Successfully uploaded post!
            </div>
            }
          </div>}
          {type === "image" && 
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Image Post</h3>
            <TextField 
              onChange={(e) => handleImagePostChange(e)}
              name="title"
              id="Title2" 
              label="Title" 
              required
            />
            <br/>
            <Input 
              onChange={(e) => handleImagePostChange(e)}
              id="Image"
              name="image"
              accept="image/*"
              type="file"></Input>
            <br></br>
          {imagePostformData.image && 
          <div>
          <img id="displayimage" src={URL.createObjectURL(imagePostformData.image)} width="250"/>
          <br/>
          {success &&
            <div>
              Successfully uploaded post!
            </div>
          }
          </div>
          }
            <br></br>
            <Button style={{ marginLeft: '10px' }} id="submitButton2" variant="contained" onClick={makeImagePost}>
              Create Post
            </Button>
          </div>}
    </div>
  )
}

export default CreatePost
