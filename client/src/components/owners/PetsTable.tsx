import * as React from 'react';

import { Link } from 'react-router';
import { IOwner, IPet } from '../../types';
import { url } from '../../util';

const VisitsTable = ({ ownerId, pet }: { ownerId: number, pet: IPet }) => (
  <table className='table-condensed'>
    <thead>
      <tr>
        <th>Visit Date</th>
        <th>Description</th>
        <th>Veterinarian</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {pet.visits.map(visit => (
        <tr key={visit.id}>
          <td>{visit.date}</td>
          <td>{visit.description}</td>
          <td>{visit.vet.firstName + ' ' + visit.vet.lastName}</td>
          <td><button >Cancel Visit</button></td>
        </tr>
      ))}
      <tr>
        <td>
          <Link to={`/owners/${ownerId}/pets/${pet.id}/edit`}>Edit Pet</Link>
        </td>
        <td>
          <Link to={`/owners/${ownerId}/pets/${pet.id}/visits/new`}>Add Visit</Link>
        </td>
      </tr>
    </tbody>
  </table>
);

interface IPetsTableProps {
  owner: IOwner;
}

interface IPetsTableState {
};
export default class PetsTable extends React.Component<IPetsTableProps, IPetsTableState> {

  constructor(props) {
    super(props);
    this.onCancel = this.onCancel.bind(this);
  }

  onCancel = (visit) => (e) => {
    const { owner } = this.props;
    const fetchUrl = url('/api/owners/' + owner.id + '/visits/' + visit.id);
    fetch(fetchUrl, { method: 'delete' })
      .then(response => {
        console.log('Visit deleted from system');
        owner.pets.forEach(pet => {
          pet.visits = pet.visits.filter(record => record !== visit);
        });
        this.setState({ owner: owner });
      })
      .catch(error => {
        console.log('ERROR?!...', error);
        this.setState({ error: error });
      });
  }

  render() {
    const { owner } = this.props;
    return (<section>
      <h2>Pets and Visits</h2>
      <table className='table table-striped'>
        <tbody>
          {owner.pets.map(pet => (
            <tr key={pet.id}>
              <td style={{ 'verticalAlign': 'top' }}>
                <dl className='dl-horizontal'>
                  <dt>Name</dt>
                  <dd>{pet.name}</dd>
                  <dt>Birth Date</dt>
                  <dd>{pet.birthDate}</dd>
                  <dt>Type</dt>
                  <dd>{pet.type.name}</dd>
                </dl>
              </td>
              <td style={{ 'verticalAlign': 'top' }}>
                <table className='table-condensed'>
                  <thead>
                    <tr>
                      <th>Visit Date</th>
                      <th>Description</th>
                      <th>Veterinarian</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pet.visits.map(visit => (
                      <tr key={visit.id}>
                        <td>{visit.date}</td>
                        <td>{visit.description}</td>
                        <td>{visit.vet.firstName + ' ' + visit.vet.lastName}</td>
                        <td><button onClick={this.onCancel(visit)}>Cancel Visit</button></td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <Link to={`/owners/${owner.id}/pets/${pet.id}/edit`}>Edit Pet</Link>
                      </td>
                      <td>
                        <Link to={`/owners/${owner.id}/pets/${pet.id}/visits/new`}>Add Visit</Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>);
  }
}