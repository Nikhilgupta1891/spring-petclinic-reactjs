import * as React from 'react';

import { Link } from 'react-router';
import { IVet } from '../../types';

export default ({vet}: { vet: IVet }) => (
  <section>
    <h2>Vet Information</h2>

    <table className='table table-striped'>
      <tbody>
        <tr>
          <th>Name</th>
          <td><b>{vet.firstName} {vet.lastName}</b></td>
        </tr>
      </tbody>
    </table>

    <Link to={`/vets/${vet.id}/edit`} className='btn btn-default'>Edit Vet</Link>
    &nbsp;
    {/* <Link to={`/vets/${vet.id}/pets/new`} className='btn btn-default'>Add New Speci</Link> */}
  </section>
);
