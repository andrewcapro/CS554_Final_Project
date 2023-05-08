import { Button, TextField } from '@mui/material';
import React, { useState, useContext } from 'react'
import axios from "axios";
import {AuthContext} from '../firebase/Auth';

function CreateComment(props) {

  const [commentFormData, setCommentFormData] = useState({});
  const {currentUser} = useContext(AuthContext);

  const handleCommentChange = (e) => {
    setCommentFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const makeComment = async () =>  {
    document.getElementById("body").value = "";
    const {data} = await axios.get("http://localhost:4000/users/" + currentUser.uid)
    await axios.post(`http://localhost:4000/posts/comment/${props.post.id}`, {body: commentFormData.body, userWhoPosted: {id: currentUser.uid, username: data.username}})
    setCommentFormData({});
    props.UpdateComments();
  }


  return (
    <div>
        <div>
            <TextField
            style={{marginLeft: "5px"}}
            type="textarea"
            onChange={(e) => handleCommentChange(e)}
            id="body"
            name="body"
            label="Comment">
            </TextField>
        <br></br>
        <br></br>
        <Button style={{ marginLeft: '10px' }} id="submitButton" variant="contained" onClick={makeComment}>
            Create Comment
        </Button>
        </div>
    </div>
  )
}

export default CreateComment;
