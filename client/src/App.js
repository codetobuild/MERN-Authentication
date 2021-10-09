import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/Routing/PrivateRoute";

// component pages
import PrivatePage from "./components/PrivatePage";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <PrivateRoute exact path="/" component={PrivatePage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/forgotpassword" component={ForgotPassword} />
          <Route
            exact
            path="/resetpassword/:resetToken"
            component={ResetPassword}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
