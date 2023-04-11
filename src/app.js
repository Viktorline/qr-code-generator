import * as yup from 'yup';
import axios from 'axios';
import viewer from './view.js';

const generateQRCode = async (data) => {
  const apiUrl = 'https://api.qrserver.com/v1/create-qr-code/';
  const params = {
    data,
    size: '350x350',
    format: 'png',
  };

  try {
    const response = await axios.get(apiUrl, { params, responseType: 'arraybuffer' });
    const qrCodeImageUrl = URL.createObjectURL(
      new Blob([response.data], { type: response.headers['content-type'] }),
    );
    return qrCodeImageUrl;
  } catch (error) {
    throw new Error('Error generating QR code:', error);
  }
};

export default () => {
  const state = {
    form: {
      valid: true,
      error: [],
      status: '',
    },
    qrCode: [],
    message: '',
  };

  const form = document.querySelector('.page__form');
  const input = document.querySelector('#url-input');
  const message = document.querySelector('.page__message');
  const button = document.querySelector('.page__button');
  const qrContainer = document.querySelector('.page__qrcontainer');
  const officeGuy = document.querySelector('.page__officeGuy');

  const elements = {
    form,
    input,
    message,
    button,
    qrContainer,
    officeGuy,
  };

  const watchedState = viewer(state, elements);

  const reset = () => {
    watchedState.form.status = '';
    watchedState.form.error = [];
    watchedState.qrCode = [];
    watchedState.message = '';

    elements.form.reset();
    elements.input.focus();
    elements.qrContainer.innerHTML = '';
    elements.qrContainer.classList.remove('active');
    elements.form.style.display = 'flex';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.form.status = 'sendingRequest';
    const formData = new FormData(event.target);
    const inputValue = formData.get('url');

    const schema = yup.string().required().url('invalid');

    schema
      .validate(inputValue)
      .then(() => generateQRCode(inputValue))
      .then((response) => {
        watchedState.qrCode = response;
        watchedState.form.status = 'responseRecieved';
        watchedState.form.errors = [];
      })
      .catch((err) => {
        if (err.name === 'AxiosError') {
          watchedState.form.error = err.name;
        } else if (err.message === 'notValid') {
          watchedState.form.error = err.message;
        } else {
          const [error] = err.errors;
          watchedState.form.error = error;
        }
        watchedState.form.status = 'failed';
        watchedState.form.valid = false;
      });
  });

  elements.qrContainer.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'img') {
      const qrCodeImage = event.target;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = qrCodeImage.width;
      canvas.height = qrCodeImage.height;
      context.drawImage(qrCodeImage, 0, 0);

      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ [blob.type]: blob });
        navigator.clipboard
          .write([item])
          .then(() => {
            watchedState.form.status = 'copyied';
            setTimeout(() => {
              watchedState.form.status = '';
            }, 4000);
          })
          .catch((error) => {
            throw new Error('Error copying QR code to clipboard:', error);
          });
      });
    }
  });

  elements.officeGuy.addEventListener('click', () => {
    reset();
  });
};
