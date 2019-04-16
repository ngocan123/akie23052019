import React, { Component } from 'react';
import axioApi from './../../axioConfig';
import qs from 'qs';
import CreatableSelect from 'react-select/lib/Creatable';

let $this;
class CreatePost extends Component {
    constructor(props){
        super(props);
        this.state = {name : '', description : '', tags : [], alltags : [], author : ''}
		$this = this; 
    }
    changeTitle(e){
        $this.setState({ name : e.target.value });
    }
    changeDescription(e){
        $this.setState({ description : e.target.value });
    }
    tagsSelectChange = (selectedtag) => {
        $this.setState({ tags : selectedtag });
    }
    componentDidMount(){
        axioApi.get('/product/getAllTags').then((res) => {
            $this.setState({
                alltags : res.data
            });
        });
        setTimeout(function(){
            axioApi.get('/auth/checkToken').then((res) => {
                console.log(res.data);
                $this.setState({
                    author: res.data.id
                });
            }).catch((err) => {
                $this.props.history.push('/login');
            });
        }, 1500);
    }
    savePost(){
        const postdata = {
            name : $this.state.name,
            description : $this.state.description,
            tags : $this.state.tags,
            author : $this.state.author,
        }
        postdata.tags = postdata.tags.map(function(t){
            return t.label;
        })
        //console.log(postdata);
        axioApi.post('/product/saveProductAndTag', postdata).then((res) => {
            $this.props.history.push('/product');
        });
    }
    
  render() {
    return (
      	<div>
      		<hr/>
            <h1>Thêm sản phẩm</h1>
            
                <br/>
                <div className="form-group">
                    <label>Title</label>
                    <input onChange={this.changeTitle} name="name" type="text" className="form-control" id="name" aria-describedby="name" placeholder="Enter name" />						
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input onChange={this.changeDescription}  name="description" type="email" className="form-control" id="description" aria-describedby="description" placeholder="Enter Description" />						
                </div>
                <div className="form-group">
                    <label>Tags</label>
                    {/* <Select
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={$this.state.tags}
                        isMulti = {true}
                    /> */}
                    {/* <CreatableSelect
                    isMulti
                    onChange={this.handleChange}
                    options={$this.state.tags}
                    /> */}
                    <CreatableSelect
                        isClearable
                        onChange={this.tagsSelectChange}
                        //onInputChange={this.handleInputChange}
                        options={this.state.alltags}
                        isMulti = {true}
                    />
                </div>
                <button type="submit" onClick={this.savePost} className="btn btn-primary">Submit</button>
            <hr/>
      	</div>
    );
  }
}
export default CreatePost;