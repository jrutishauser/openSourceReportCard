import React from 'react';
import $ from 'jQuery';

export default class App extends React.Component {
constructor(props){
    super(props);
    this.state = { usernames: [] };
    this.formSubmit = this.formSubmit.bind(this);
  }
  formSubmit(username){
    this.setState({
      usernames: this.state.usernames.concat(username)
    });
  }
  render(){
    let cards = this.state.usernames.map((val) => {
      return <UserCards username={ val } />;
    });
    return (
      <div>
        <LoginNames parentFormSubmit={ this.formSubmit }/>
        <hr />
        <div className={ 'user-cards-cont' }>
          { cards }
        </div>
      </div>
    );
  }
}

class LoginNames extends React.Component {
  constructor(props){
    super(props);
    this.parentFormSubmit = this.props.parentFormSubmit;
    this.state = {
      value: ''
    };
    this.inputRef = null;
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(e, inputRef){
    this.setState({
      value: e.target.value
    });
    this.inputRef = inputRef;
  }
  handleSubmit(e){
    e.preventDefault();
    this.parentFormSubmit(this.state.value);
    this.setState({
      value: ''
    });
    this.inputRef.focus();
  }
  render(){
    return (
      <form className='form-inline' onSubmit={ this.handleSubmit }>
        <Input classes={ 'form-control' } placeholder={ 'Github Username' } value={ this.state.value } handleInputChange={ this.handleInputChange } />
        <Button classes={ 'btn inline-btn' } />
      </form>
    );
  }
}

class UserCards extends React.Component {
  constructor(props){
    super(props);
    this.state = { };
  }
  componentDidMount(){
    let self = this;
    $.getJSON('https://api.github.com/users/' + this.props.username).then((result) => {
      self.setState(result), (err) => {
        console.log(err);
      }
    });
  }
  render(){
    return (
        <div className={ 'user-cards-child-cont' }>
          <img src={ this.state.avatar_url } className={ 'img' } width='100' height='100'></img>
          <h3>{ this.state.name }</h3>
        </div>
    );
  }
}

class Input extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    //this is annoying when editing the pen, uncomment and refresh to see perferred functionality
    //this._ref.focus();
  }
  componentDidUpdate(){
    //instead of using this lifecycle method, I'm passing the input ref to the parent for focus to be
    //set after state is updated; unfortunately, I'm pretty sure this is an anti-pattern
    //this._ref.focus();
  }
  handleChange(e){
    this.props.handleInputChange(e, this._ref);
  }
  render(){
    let { placeholder, classes, handleChange, value } = this.props;
    return <input placeholder={ placeholder } className={ classes } value={ value } onChange={ this.handleChange } ref={ (c) => this._ref = c } />;
  }
}

const Button = ({ classes }) => {
  return <button className={ classes }>Submit</button>;
}

