import * as React from 'react';
import VetEditor from './VetEditor';
import { IVet } from '../../types';

const newVet = (): IVet => ({
  id: null,
  isNew: true,
  firstName: '',
  lastName: '',
  specialties: []
});

export default () => <VetEditor initialVet={newVet()} />;