import * as React from 'react';

import { IRouter, Link } from 'react-router';
import { url, submitForm } from '../../util';

import Input from '../form/Input';

import { Digits, NotEmpty } from '../form/Constraints';

import { IInputChangeHandler, IFieldError, IError, IVet, IRouterContext } from '../../types';

interface IVetEditorProps {
  initialVet?: IVet;
}

interface IVetEditorState {
  Vet?: IVet;
  error?: IError;
};

// Reference - OwnerEditor Page
export default class VetEditor extends React.Component<IVetEditorProps, IVetEditorState> {

  context: IRouterContext;

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      Vet: Object.assign({}, props.initialVet)
    };
  }

  onSubmit(event) {
    event.preventDefault();

    const { Vet } = this.state;

    const url = Vet.isNew ? '/api/Vet' : '/api/Vet/' + Vet.id;
    submitForm(Vet.isNew ? 'POST' : 'PUT', url, Vet, (status, response) => {
      if (status === 200 || status === 201) {
        const newVet = response as IVet;
        this.context.router.push({
          pathname: '/Vets/' + newVet.id
        });
      } else {
        console.log('ERROR?!...', response);
        this.setState({ error: response });
      }
    });
  }

  onInputChange(name: string, value: string, fieldError: IFieldError) {
    const { Vet, error } = this.state;
    const modifiedVet = Object.assign({}, Vet, { [name]: value });
    const newFieldErrors = error ? Object.assign({}, error.fieldErrors, {[name]: fieldError }) : {[name]: fieldError };
    this.setState({
      Vet: modifiedVet,
      error: { fieldErrors: newFieldErrors }
    });
  }

  render() {
    const { Vet, error } = this.state;
    return (
      <span>
        <h2>New Vet</h2>
        <form className='form-horizontal' method='POST' action={url('/api/Vet')}>
          <div className='form-group has-feedback'>
            <Input object={Vet} error={error} constraint={NotEmpty} label='First Name' name='firstName' onChange={this.onInputChange} />
            <Input object={Vet} error={error} constraint={NotEmpty} label='Last Name' name='lastName' onChange={this.onInputChange} />
          </div>
          <div className='form-group'>
            <div className='col-sm-offset-2 col-sm-10'>
              <button className='btn btn-default' type='submit' onClick={this.onSubmit}>{Vet.isNew ? 'Add Vet' : 'Update Vet'}</button>
            </div>
          </div>
        </form>
      </span>
    );
  }
}