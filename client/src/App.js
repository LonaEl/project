import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PostDetails from './components/PostDetails/PostDetails';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import CreatorOrTag from './components/CreatorOrTag/CreatorOrTag';
import Claim from './components/Claim/Claim';
import Terms from './components/Terms/Terms';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import PasswordReset from './components/PasswordRest/PasswordReset';
//import { useParams } from 'react-router-dom';





const App = () => {
  //const param = useParams();
  const user = JSON.parse(localStorage.getItem('profile'));
    


  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Switch>
          <Route path="/" exact component={() => <Redirect to="/posts" />} />
          <Route path="/posts" exact component={Home} />
          <Route path="/posts/search" exact component={Home} />
          <Route path="/posts/:id" exact component={PostDetails} />
          <Route path={['/creators/:name', '/tags/:name']} component={CreatorOrTag} />
          <Route path="/auth" exact component={() => (!user ? <Auth /> : <Redirect to="/posts" />)} />
          <Route path="/claim" exact component={Claim} />
          <Route path="/termsandconditions" exact component={Terms} />
          <Route path="/forgot-password" exact component={ForgotPassword} />
          <Route path="/reset-password/:id/:token" exact component={ PasswordReset } />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;