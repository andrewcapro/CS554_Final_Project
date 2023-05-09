import { Button } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react'
import axios from "axios";
import {AuthContext} from '../firebase/Auth';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


function CreatePost() {

  const [type, setType] = useState('');
  const [textPostformData, setTextPostFormData] = useState({});
  const [imagePostformData, setImagePostFormData] = useState({});
  const [selectedWorkout, setSelectedWorkout] = useState('-');
  const [workoutTitle, setWorkoutTitle] = useState('');
  const {currentUser} = useContext(AuthContext);
  const [workoutData, setWorkoutData] = useState('');
  const [success, setSuccess] = useState(false);
  const [workoutError, setWorkoutError] = useState('');

  useEffect(() => {
    async function fetchWorkouts() {
        try{
            const data = {workoutCreatorId: currentUser.uid}
            const response = await axios.post("http://localhost:4000/exercises/getall", data)
            setWorkoutData(response.data);
            setSelectedWorkout((prev) => ({...prev, value: '-'}));
        } catch(e){
          console.log("Workout Fetch Error", e)
        }
    }
    fetchWorkouts()
  }, [currentUser.uid])

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

  const handleWorkoutChange = (e) => {
    console.log(e.target.value)
    setSelectedWorkout((prev) => ({...prev, value: String(e.target.value)}));
  }

  const handleWorkoutPostTitleChange = (e) => {
    console.log(e.target.value)
    setWorkoutTitle(e.target.value);
  };

  const makeTextPost = async () =>  {
    document.getElementById("Title1").value = "";
    document.getElementById("Body1").value = "";
    const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
    await axios.post("http://localhost:4000/posts/createTextPost/", {title: textPostformData.title, body: textPostformData.body, userWhoPosted: {id: currentUser.uid, username: data.username}})
    setTextPostFormData({});
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
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
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  }

  const makeWorkoutPost = async () =>  {
    if (!workoutTitle) {
      setWorkoutError("You must have a title to post.")
      setTimeout(() => {
        setWorkoutError('');
      }, 2000)
    }
    else if (selectedWorkout.value == '-') {
      setWorkoutError("You must have a workout selected to post.")
      setTimeout(() => {
        setWorkoutError('');
      }, 2000);
    }
    else {
      document.getElementById("workout-select").value = "-";
      document.getElementById("Title3").value=''
      const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
      await axios.post("http://localhost:4000/posts/createWorkoutPost/", {title: workoutTitle, workout_id: selectedWorkout.value, userWhoPosted: {id: currentUser.uid, username: data.username}})
      setWorkoutTitle('');
      setSelectedWorkout((prev) => ({...prev, value: '-'}));
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false);
      }, 2000)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <h2>Create Post</h2>
        <Button onClick={() => {setType('text')}} variant='contained' id='blueButton'>Text Post</Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => {setType('image')}} variant='contained' id='blueButton2'>Image Post</Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => {setType('workout')}} variant='contained' id='blueButton3'>Workout Post</Button>
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
              variant="standard"
            />
            <br/>
            <TextField 
              onChange={(e) => handleTextPostChange(e)}
              name="body"
              id="Body1" 
              label="Body" 
              required
              variant="standard"
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
              variant="standard"
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
          {type === 'workout' &&
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Workout Post</h3>
            <TextField
              onChange={(e) => handleWorkoutPostTitleChange(e)}
              name="title"
              id="Title3"
              label="Title"
              required
              variant="standard"
            />
            <br/>
            <InputLabel id="workout-select-label">Workout</InputLabel>
            <Select
              labelId="workout-select-label"
              id="workout-select"
              label="Select Workout"
              onChange={handleWorkoutChange}
              value={selectedWorkout.value}
              style={{ minWidth: 200, marginTop: 5, marginBottom: 5, textAlign: 'center' }}
              variant="standard"
            >
              <MenuItem value='-'>----------</MenuItem>
              {workoutData &&
                Object.keys(workoutData).map((key) => {
                  let curObj = JSON.parse(workoutData[key])
                  return (
                    <MenuItem value={key} key={key}>{curObj.title}</MenuItem>
                  )
                })
              }
            </Select>
            <Button style={{ marginLeft: '10px' }} id="submitButton" variant="contained" onClick={makeWorkoutPost}>
              Create Post
            </Button>
            <br/>
            {workoutError &&
            <div>
              {workoutError}
            </div>
            }
            {success &&
            <div>
              Successfully uploaded post!
            </div>
            }
          </div>}
    </div>
  )
}

export default CreatePost
