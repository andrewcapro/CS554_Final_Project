import { Button } from '@mui/material';
import React, { useState, useContext } from 'react'
import axios from "axios";
import {AuthContext} from '../firebase/Auth';


function CreatePost() {

  const [type, setType] = useState('');
  const [textPostformData, setTextPostFormData] = useState({});
  const [imagePostformData, setImagePostFormData] = useState({});
  const {currentUser} = useContext(AuthContext);


  const handleTextPostChange = (e) => {
    setTextPostFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  // const makePolaroid = async () => {
  //   const outputImage = document.getElementById("displayimage");

  //   const sourceImage = URL.createObjectURL(imagePostformData.image);
  //   const { outputFiles, exitCode, stderr} = await execute({
  //     inputFiles: [await buildInputFile(sourceImage, 'image1.png')],
  //     commands: `
  //       convert image1.png -bordercolor #ffee44 -background #eeff55 +polaroid image2.png
  //       convert image2.png -fill #997711 -tint 55 image3.jpg
  //   `
  //   })
  //   if (exitCode) {
  //     alert(`There was an error with the command: ${stderr.join('\n')}`)
  //   }
  //   else {
  //     await loadImageElement(outputFiles[1], document.querySelector('#displayimage'))
  //   }

  // }

  const handleImagePostChange = (e) => {
    if(e.target.name === "image"){
      setImagePostFormData((prev) => ({...prev, [e.target.name]: e.target.files[0]}));
    }
    else{
      setImagePostFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    }
    console.log(imagePostformData);
  };

  const makeTextPost = async () =>  {
    document.getElementById("Title1").value = "";
    document.getElementById("Body1").value = "";
    const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
    await axios.post("http://localhost:4000/posts/createTextPost/", {title: textPostformData.title, body: textPostformData.body, userWhoPosted: {id: currentUser.uid, username: data.username}})
    setTextPostFormData({});
  }

  const makeImagePost = async () => {
    document.getElementById("Title2").value = "";
    document.getElementById("Image").value = "";
    const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
    await axios.post("http://localhost:4000/posts/createImagePost/", {title: imagePostformData.title, image: URL.createObjectURL(imagePostformData.image), userWhoPosted: {id: currentUser.uid, username: data.username}})
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
            <Button style={{ marginLeft: '10px' }} id="submitButton" variant="contained" onClick={makeTextPost}>
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
          {imagePostformData.image && 
          <div>
          <img id="displayimage" src={URL.createObjectURL(imagePostformData.image)} width="250"/>
          <br/>
          {/* <Button style={{ marginLeft: '10px' }} id="polaroid" variant="contained" onClick={makePolaroid}>Polaroid</Button> */}
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
