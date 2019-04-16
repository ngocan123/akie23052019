//lets me coppy 
import React, { Component } from 'react';
import axioApi from '../axioConfig';
let $this;
let token = localStorage.getItem('token');
class Home extends Component {
    constructor(props){
		super(props);
		const redirectfrom = this.props.location.redirectfrom;
		if(redirectfrom=='login'){
			window.location.reload();
		}
		$this = this;
		this.state = {posts:[], keyword:'', tags:[], alltags:[], page:1, limit:5}
	}
    componentDidMount(){
        setTimeout(function(){
            axioApi.get('auth/checkToken').then((res) => {
                console.log(res.data);
            }).catch((err) => {
                $this.props.history.push('/login');
            });
        }, 1500);
    }

    
	// componentDidMount(){		
	// 	//this.getPosts()
	// 	//this.getTags()
	// 	document.addEventListener('scroll', this.trackScrolling);
	// 	//document.getElementById('Loading').style.display = "none";
	// }
	// componentWillUnmount(){
	// 	document.removeEventListener('scroll', this.trackScrolling);
    // }
    
    render() {
        return (
            <div>
                <h1>Trang chủ</h1>
            </div>
        );
    }
}
export default Home;