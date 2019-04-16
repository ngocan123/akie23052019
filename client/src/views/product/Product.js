import React, { Component } from 'react';
import axioApi from './../../axioConfig';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
// const mapStateToProps = state => {
//     return{
//         posts : state.postreducer.posts  // redux_step4 getting data from store and connect with view
//     }
// }
let $this;
class Product extends Component {
    constructor(props){
        super(props);
        this.state = {'products':[], author: ''};
        $this = this;
    }
    componentDidMount(){
        setTimeout(function(){
            axioApi.get('auth/checkToken').then((res) => {
                $this.setState({
                    'author': res.data.id
                });
                $this.getDatas();
                console.log(res.data.id);
            }).catch((err) => {
                $this.props.history.push('/login');
            });
        },1500);
    }
    getDatas(){
        axioApi.get('/product/getAll?author='+$this.state.author).then((res) => {
            $this.setState({ 'products' : res.data });
            console.log($this.state.author);
        });
    }
    deletePost(id){
        axioApi.post('/product/remove', {_id:id}).then( (res) => {
            $this.getDatas()
        });
    }
    tabRows(){
        return $this.state.products.map(function(post, i){
            return <tr key={i}>
                        <td>{post.name}</td>
                        <td>{post.description}</td>
                        <td>{post.author?post.author.email:'Chưa xác định'}</td>
                        <td>
                            <Link className="nav-link" to={"/edit-product/"+post._id}>
                                <button className="btn btn-sm btn-success">Sửa</button>
                            </Link>
                            <button className="btn btn-sm btn-danger inline" onClick={() => $this.deletePost(post._id)}>Xóa</button>
                        </td>
                    </tr>
        });
    }
    render() {
        return (
            <div>
                <h1>Product layout</h1>
                <Link className="nav-link" to='/create-product'><button className="btn btn-sm btn-success">Thên sản phẩm</button></Link>
                <table className="table table-hover table-border">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Mô tả</th>
                            <th>Người đăng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.tabRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default Product;