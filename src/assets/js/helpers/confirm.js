import { createConfirmation } from 'react-confirm';

import ConfirmDialog from '../components/common/ConfirmDialog';

const configureConfirm = createConfirmation(ConfirmDialog);

const confirm = (message, options = {}) => configureConfirm({ message, options });

export default confirm;
