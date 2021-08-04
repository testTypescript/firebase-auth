import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./Signup";
import { AuthProvider } from "../contexts/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import EditProfile from "./EditProfile";

function App(props) {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <PrivateRoute path="/edit-profile" component={EditProfile} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
