import { Button } from '@mui/material';
import React, { useState } from 'react'

function CreatePost() {

  const [type, setType] = useState('');
  const [textPostformData, setTextPostFormData] = useState({});
  const [imagePostformData, setImagePostFormData] = useState({});

  const handleTextPostChange = (e) => {
    setTextPostFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleImagePostChange = (e) => {
    setImagePostFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const createTextPost = () => {
    document.getElementById("Title1").value = "";
    document.getElementById("Body1").value = "";
    console.log("Not yet implemented, but here's the submitted data");
    console.log(textPostformData)
    setTextPostFormData({});
  }

  const createImagePost = () => {
    document.getElementById("Title2").value = "";
    document.getElementById("Image").value = "";
    console.log("Not yet implemented, but here's the submitted data");
    console.log(imagePostformData)
    setImagePostFormData({})
  }


  return (
    <div>
        <h2>Create Post</h2>
        <Button style={{ marginLeft: '10px' }} onClick={() => {setType('text')}} variant='contained' id='blueButton'>Text Post</Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => {setType('image')}} variant='contained' id='blueButton2'>Image Post</Button>
        <br></br>
        <br></br>
        <br></br>
        {type === 'text' && 
          <div>
            <label>Title: 
              <input
                onChange={(e) => handleTextPostChange(e)}
                id="Title1"
                name="title"
                placeholder='Enter Title...'>
              </input>
            </label>
            <br></br>
            <br></br>
            <label>Body: 
              <input
                onChange={(e) => handleTextPostChange(e)}
                id="Body1"
                name="body"
                placeholder='Enter Body...'>
              </input>
            </label>
            <br></br>
            <br></br>
            <br></br>
            <Button style={{ marginLeft: '10px' }} id="submitButton" variant="contained" onClick={createTextPost}>
              Create Post
            </Button>
          </div>}
          {type === "image" && <div>
            <label>Title: 
              <input
                onChange={(e) => handleImagePostChange(e)}
                id="Title2"
                name="title"
                placeholder='Enter Title...'>
              </input>
            </label>
            <br></br>
            <br></br>
            <label>Image: 
              <input
                onChange={(e) => handleImagePostChange(e)}
                id="Image"
                name="image"
                accept="image/*"
                type="file">
              </input>
            </label>
            <br></br>
            <br></br>
            <Button style={{ marginLeft: '10px' }} id="submitButton2" variant="contained" onClick={createImagePost}>
              Create Post
            </Button>
          </div>}
    </div>
  )
}

export default CreatePost
