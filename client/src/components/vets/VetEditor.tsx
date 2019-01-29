import * as React from 'react';

import { url, submitForm } from '../../util';

import Input from '../form/Input';

import { NotEmpty } from '../form/Constraints';

import { IFieldError, IError, IRouterContext, IVet, ISelectOption, IPetType, ISpecialty } from '../../types';

interface IVetEditorProps {
  initialVet?: IVet;
}

interface IVetEditorState {
  vet?: IVet;
  error?: IError;
  types?: ISelectOption[];
  selectedTypes?: string[];
};

export default class VetEditor extends React.Component<IVetEditorProps, IVetEditorState> {

  context: IRouterContext;

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const toSelectOptions = (specialties: ISpecialty[]): ISelectOption[] => specialties.map(specialty => ({ value: specialty.id, name: specialty.name }));

    fetch(url('/api/specialtytypes'))
      .then(response => response.json())
      .then(toSelectOptions)
      .then(specialties =>
        this.setState({
          types: specialties,
          selectedTypes: props.initialVet.specialties.map(specialty => specialty.id as string)
        })
      );

    this.state = {
      vet: Object.assign({}, props.initialVet),
      types: [],
      selectedTypes: []
    };
  }

  onSubmit(event) {
    event.preventDefault();

    const { vet } = this.state;

    const url = vet.isNew ? '/api/vet' : '/api/vet/' + vet.id;
    submitForm(vet.isNew ? 'POST' : 'PUT', url, vet, (status, response) => {
      if (status === 200 || status === 201) {
        const newVet = response as IVet;
        this.context.router.push({
          pathname: '/vets'
        });
      } else {
        console.log('ERROR?!...', response);
        this.setState({ error: response });
      }
    });
  }

  onInputChange(name: string, value: string, fieldError: IFieldError) {
    const { vet, error } = this.state;
    const modifiedVet = Object.assign({}, vet, { [name]: value });
    const newFieldErrors = error ? Object.assign({}, error.fieldErrors, { [name]: fieldError }) : { [name]: fieldError };
    this.setState({
      vet: modifiedVet,
      error: { fieldErrors: newFieldErrors }
    });
  }

  render() {
    const { vet, error, types, selectedTypes } = this.state;

    const handleOnChange = event => {
      const { selectedTypes, vet } = this.state;
      vet.specialties = [].slice.call(event.target.selectedOptions).map(o => {
        return { 'id': o.value };
      });
      selectedTypes.splice(0);
      vet.specialties.forEach((specialty) => {
        selectedTypes.push('' + specialty.id);
      });
    };

    return (
      <span>
        <h2>Add/Edit Vet</h2>
        <form className='form-horizontal' method='POST' action={url('/api/vet')}>
          <div className='form-group has-feedback'>
            <Input object={vet} error={error} constraint={NotEmpty} label='First Name' name='firstName' onChange={this.onInputChange} />
            <Input object={vet} error={error} constraint={NotEmpty} label='Last Name' name='lastName' onChange={this.onInputChange} />
            <div className='form-group'>
              <label className='col-sm-2 control-label'>Type</label>

              <div className='col-sm-10'>
                <select value={selectedTypes} size={3} multiple={true} className='form-control' onChange={handleOnChange}>
                  {types.map(option => <option key={option.value} value={option.value as string}>{option.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className='form-group'>
            <div className='col-sm-offset-2 col-sm-10'>
              <button className='btn btn-default' type='submit' onClick={this.onSubmit}>{vet.isNew ? 'Add Vet' : 'Update Vet'}</button>
            </div>
          </div>
        </form>
      </span>
    );
  }
}