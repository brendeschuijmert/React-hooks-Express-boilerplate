import { toast } from 'react-toastify';

const options = {
  pauseOnFocusLoss: false,
  autoClose: 3000,
};

export default (type, message) => {
  switch (type) {
    case 'success':
      return toast.success(message, options);

    case 'info':
      return toast.info(message, options);

    case 'warn':
      return toast.warn(message, options);

    case 'error':
      return toast.error(message, options);

    default:
      return toast.dismiss();
  }
};
