import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box, Checkbox} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { Link, useHistory } from 'react-router-dom';


import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: '', selectedFile: '' });
  const [isTrue, setIstrue] = useState(false);

  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '',  selectedFile: '' });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, history));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
    }
  };

  const handleChange = (e) => {
    setIstrue(e.target.value)
  }

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    );
  }

/*   const switchMode = () => {
     setChecked((prevChecked => !prevChecked));
  };
 */

  //const handleAddChip = (tag) => {
   // setPostData({ ...postData, tags: [...postData.tags, tag] });
  //};

 // const handleDeleteChip = (chipToDelete) => {
   // setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  //};

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating '}</Typography>
       
       
        <TextField 
        name="title" 
        variant="outlined" 
        label="Title" 
        fullWidth 
        value={postData.title} 
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
         />
        
        <TextField 
        name="message" 
        variant="outlined" 
        label="Message" 
        fullWidth
         multiline 
         minRows={4} 
         value={postData.message} 
         onChange={(e) => setPostData({ ...postData, message: e.target.value })} 
         />
        <div style={{ padding: '5px 0', width: '94%' }}>
        
         <TextField
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
           value={postData.tags}
           // onAdd={(chip) => handleAddChip(chip)}
           // onDelete={(chip) => handleDeleteChip(chip)}
            onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} 
              />
        </div>

        <div className={classes.fileInput}>
          <FileBase type="file" 
          multiple={false} 
          onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
          </div>
<Checkbox
            checked={isTrue}
            onChange={handleChange} />
 <Typography variant='h8'>I agree to the <Box component={Link} to="/termsandconditions">terms and conditions</Box> </Typography>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Upload</Button>
      </form>
  </Paper>


  );
};

export default Form;
//  <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>