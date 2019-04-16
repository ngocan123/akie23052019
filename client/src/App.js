import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css';
// import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
// // Be sure to include styles at some point, probably during your bootstraping
// import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import { Switch, Route, BrowserRouter, Link } from 'react-router-dom'
import Home from './views/Home.js';
import Register from './views/Register';
import Login from './views/Login';
import Product from './views/product/Product';
import CreatePost from './views/product/CreatePost';
import EditPost from './views/product/EditPost';
let token = localStorage.getItem('token');
class App extends Component {
  ShowLogin(){
    let loginorlogout = <Link className="nav-link" to='/login'>Đăng nhập</Link>;
    if(token){
      loginorlogout = <a className="nav-link" href="/login" onClick={this.logout}>Đăng xuất</a>;
    }
    return loginorlogout;
  }
  logout(){
    localStorage.removeItem('token');
    this.history.push('/login');
  }
  showRegisterOrPost(){
    let registerOrPost = <Link className="nav-link" to='/register'>Đăng ký</Link>;
    if(token){
      registerOrPost = <Link className="nav-link" to='/product'>Sản phẩm</Link>;
    }
    return registerOrPost;
  }
  render() {
    return (
        <div>
            <div className="header">
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto container">
                    <li className="nav-item active">
                      <Link className="nav-link" to='/'>Trang chủ</Link> 
                    </li>
                    <li className="nav-item">
                        { this.showRegisterOrPost() }
                    </li>								
                    <li className="nav-item">
                        { this.ShowLogin() }						
                    </li>						
                  </ul>    
                </div>
              </nav>
            </div>
            {/* this is react comment, child layout is right here, it only change, master and footer */}
            <div className="container">
                {/** lets start route in right here */}
                <Switch>
                    <Route exact path="/" component = {Home} /> {/**this route reference to domain */}
                    <Route path="/register" component = {Register} /> {/**this route reference to domain/register */}
                    <Route path="/login" component = {Login} /> {/**this route reference to domain/login */}
                    <Route path="/product" component = {Product} /> {/**this route reference to domain/login */}
                    <Route path="/create-product" component = {CreatePost} />
                    <Route path="/edit-product/:id" component = {EditPost} />
                </Switch>
            </div>
            <div className="footer">
                Footer
            </div>
        </div>
    );
  }
}

export default App;
