import * as React from 'react';

import { url } from '../../util';
import { IVet } from '../../types';
import VetInformation from './VetInformation';

interface IVetPageProps {
  params?: { vetId?: string };
}

interface IVetPageState {
  vet?: IVet;
}

export default class VetInfoPage extends React.Component<IVetPageProps, IVetPageState> {

  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    const { params } = this.props;

    if (params && params.vetId) {
      const fetchUrl = url(`/api/vet/${params.vetId}`);
      fetch(fetchUrl)
        .then(response => response.json())
        .then(vet => this.setState({ vet }));
    }
  }

  render() {
    const { vet } = this.state;

    if (!vet) {
      return <h2>No Vet loaded</h2>;
    }

    return (
      <span>
        <VetInformation vet={vet} />
        {/* <PetsTable owner={owner} /> */}
      </span>
    );
  }
}
