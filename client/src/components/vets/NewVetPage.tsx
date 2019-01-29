import * as React from 'react';
import { IVet } from '../../types';
import VetEditor from './VetEditor';

const newVet = (): IVet => ({
  id: null,
  isNew: true,
  firstName: '',
  lastName: '',
  specialties: []
});

export default () => <VetEditor initialVet={newVet()} />;

