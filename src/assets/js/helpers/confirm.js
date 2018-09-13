import { createConfirmation } from 'react-confirm';

import ConfirmDialog from '../components/common/ConfirmDialog';

import ComplexConfirmDialog from '../components/common/ComplexConfirmDialog';

const defaultConfirmation = createConfirmation(ConfirmDialog);

const complexConfirmation = createConfirmation(ComplexConfirmDialog);

export const confirm = options => defaultConfirmation({ options });

export const complexConfirm = options => complexConfirmation({ options });
