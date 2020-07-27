import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./styleSheets/generalStyles.css";
import { UserContext } from './Contexts/UserContext';

import Home from "./pages/home";
import About from "./pages/about";
import Faq from "./pages/faq";
import Tutorial from "./pages/tutorial";
import SignUp from "./pages/signUp";
import Gallery from "./Gallery";
import Challenges from "./pages/challenges";
import Footer from "./footer";
import Contact from "./pages/contact";
import Privacy from "./pages/privacy";
import License from "./pages/license";
import Development from "./pages/development";
import SignIn from "./pages/signIn";
import Settings from "./pages/settings";
import UserProfile from "./profile";
import Expert from "./expert/";

import Community from "./pages/community";
import ReportForm from "./report";
import User from "./user";
//import WorkSpace from "./Workspace";
import WorkspaceComponent from './workspace/';

/** New option for navigation bars*/
import BaseNavigation from "./NavBar/navBarLoggedOut";
import UserNavigation from "./NavBar/navBarLoggedIn";
import { Container } from "react-bootstrap";

function App() {

  const data = useContext(UserContext);
  console.log(data);

  return (
    <div id="page-container">
      <BrowserRouter>
        {data ? <UserNavigation /> : <BaseNavigation />}
        <Container fluid id="content-wrap">
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/about" component={About} />
            <Route path="/tutorial" component={Tutorial} />
            <Route path="/challenges" component={Challenges} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/signUp" component={SignUp} />
            <Route path="/contact" component={Contact} />
            <Route path="/license" component={License} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/faq" component={Faq} />
            <Route path="/development" component={Development} />
            <Route path="/signIn" component={SignIn} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/community" component={Community} />
            <Route path="/report" children={ReportForm} />
            <Route path="/user" children={User} />
            <Route path="/img/:url" children={<Gallery />} />
            <Route path="/createWorkspace" children={<WorkspaceComponent />} />
            <Route path="/expert" children={<Expert />} />
          </Switch>
        </Container>
        <Footer id="footer" />
      </BrowserRouter>
    </div>
  );
}


export default App;
