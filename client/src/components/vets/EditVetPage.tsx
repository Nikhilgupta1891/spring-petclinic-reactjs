import * as React from 'react';

import { IVet } from '../../types';
import { url } from '../../util';
import VetEditor from './VetEditor';

interface IEditVetPageProps {
  params?: { vetId?: string };
}

interface IEditVetPageState {
  vet: IVet;
}

export default class EditVetPage extends React.Component<IEditVetPageProps, IEditVetPageState> {
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
    const vet = this.state && this.state.vet;
    if (vet) {
      return <VetEditor initialVet={vet} />;
    }
    return null;
  }
}
