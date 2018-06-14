import { createConfirmation } from 'react-confirm';

import ConfirmDialog from '../components/common/ConfirmDialog';

const configureConfirm = createConfirmation(ConfirmDialog);

const confirm = options => configureConfirm({ options });

export default confirm;
