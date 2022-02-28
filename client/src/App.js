import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import OpenAuction from "./pages/OpenAuction";
import Auction from "./pages/Auction";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import SellList from "./pages/SellList.js";
import BidList from "./pages/BidList";
import TradeList from "./pages/TradeList";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    window.location.replace("http://localhost:3000/login");
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {authState.status && (
                <>
                  <Link to={`/home/${authState.id}`}> Home Page</Link>
                  <Link to={`/openauction/${authState.id}`}> Open Auction </Link>
                  <Link to={`/profile/${authState.id}`}> Profile </Link>
                  <Link to={`/bidlist/${authState.id}`}> MyBids </Link>
                  <Link to={`/selllist/${authState.id}`}> MySells </Link>
                  <Link to={`/tradelist/${authState.id}`}> MyTrades </Link>
                </>
              )}
              {!authState.status && (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registration"> Registration</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h2>{authState.username} </h2>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Switch>
            <Route path="/home/:id" exact component={Home} />
            <Route path="/openauction/:id" exact component={OpenAuction} />
            <Route path="/auctions/:uid/:aid" exact component={Auction} />
            <Route path="/registration" exact component={Registration} />
            <Route path="/login" exact component={Login} />
            <Route path="/profile/:id" exact component={Profile} />
            <Route path="/bidlist/:id" exact component={BidList} />
            <Route path="/selllist/:id" exact component={SellList} />
            <Route path="/tradelist/:id" exact component={TradeList} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;