import * as React from 'react';

import { IOwner, IPet, IPetType, IVisit, IError, IRouterContext, ISelectOption, IVet } from '../../types';

import { url, submitForm } from '../../util';
import { NotEmpty } from '../form/Constraints';

import DateInput from '../form/DateInput';
import Input from '../form/Input';
import PetDetails from './PetDetails';
import SelectInput from '../form/SelectInput';


interface IVisitsPageProps {
  params: {
    ownerId: string,
    petId: string
  };
}

interface IVisitsPageState {
  visit?: IVisit;
  owner?: IOwner;
  error?: IError;
  vets?: ISelectOption[];
  selectedVet?: IVet;
}

export default class VisitsPage extends React.Component<IVisitsPageProps, IVisitsPageState> {

  context: IRouterContext;

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };


  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { params } = this.props;

    if (params && params.ownerId) {
      const toSelectOptions = (vets: IVet[]): ISelectOption[] => vets.map(vet => ({ value: vet.id, name: vet.firstName + ' ' + vet.lastName }));

      Promise.all(
        [fetch(url('api/vets'))
          .then(response => response.json())
          .then(toSelectOptions),
        fetch(url(`/api/owner/${params.ownerId}`))
          .then(response => response.json())
        ]
      ).then(results => this.setState({
        vets: results[0],
        owner: results[1],
        visit: { id: null, isNew: true, date: null, description: '' },
        selectedVet: { specialties: null, firstName: null, lastName: null, id: null, isNew: false }
      }));
    }

  }

  onSubmit(event) {
    event.preventDefault();

    const petId = this.props.params.petId;
    const { owner, visit, selectedVet } = this.state;

    const request = {
      date: visit.date,
      description: visit.description,
    };

    const url = '/api/owners/' + owner.id + '/pets/' + petId + '/vets/' + selectedVet.id + '/visits';
    submitForm('POST', url, request, (status, response) => {
      if (status === 204) {
        this.context.router.push({
          pathname: '/owners/' + owner.id
        });
      } else {
        console.log('ERROR?!...', response);
        this.setState({ error: response });
      }
    });
  }

  onInputChange(name: string, value: string) {
    const { visit } = this.state;

    this.setState(
      { visit: Object.assign({}, visit, { [name]: value }) }
    );
  }

  onSelectChange(name: string, value: string) {
    const { selectedVet } = this.state;

    this.setState(
      { selectedVet: Object.assign({}, selectedVet, { [name]: value }) }
    );
  }

  render() {
    if (!this.state) {
      return <h2>Loading...</h2>;
    }

    const { owner, error, visit, selectedVet } = this.state;
    const petId = this.props.params.petId;

    const pet = owner.pets.find(candidate => candidate.id.toString() === petId);

    // const handleOnChange = event => {
    //   const { visit } = this.state;
    //   visit.vet = vets.find(event.target.value);
    //   console.log('select on change', event.target.value);
    // };

    return (
      <div>
        <h2>Visits</h2>
        <b>Pet</b>
        <PetDetails owner={owner} pet={pet} />

        <form className='form-horizontal' method='POST' action={url('/api/owner')}>
          <div className='form-group has-feedback'>
            <DateInput object={visit} error={error} label='Date' name='date' onChange={this.onInputChange} />
            <Input object={visit} error={error} constraint={NotEmpty} label='Description' name='description' onChange={this.onInputChange} />
            <SelectInput object={selectedVet} error={error} label='Veterinarian' name='id' options={this.state.vets} onChange={this.onSelectChange} />
          </div>
          <div className='form-group'>
            <div className='col-sm-offset-2 col-sm-10'>
              <button className='btn btn-default' type='submit' onClick={this.onSubmit}>Add Visit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}


