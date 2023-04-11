/* eslint-disable */

import onChange from 'on-change';

const renderMan = (actionType, elements, phrase = '') => {
  switch (actionType) {
    case 'typing':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('typing', 'page__officeGuy');
      break;
    case 'talking':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('talking', 'page__officeGuy');
      elements.message.textContent = '';
      elements.message.textContent = phrase;
      break;
    case 'blinking':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('blinking', 'page__officeGuy');
      break;
    default:
      break;
  }
};

const renderErrors = (elements, value) => {
  switch (value) {
    case 'invalid':
      renderMan('talking', elements, 'Your link is not valid!');
      break;
    case 'AxiosError':
      renderMan('talking', elements, 'We got network error!');
      break;
    case 'unknown':
      renderMan('talking', elements, 'We got unknown problem');
      break;
    default:
      break;
  }

  elements.form.reset();
  elements.input.focus();
};

const renderQr = (elements, qrCode) => {
  const qrCodeImage = document.createElement('img');

  qrCodeImage.src = qrCode;
  qrCodeImage.alt = 'Generated QR Code';
  qrCodeImage.title = 'Click to copy QR code';
  qrCodeImage.classList.add('pointer');

  elements.qrContainer.innerHTML = '';
  elements.qrContainer.appendChild(qrCodeImage);
  elements.qrContainer.classList.add('active');
  elements.form.style.display = 'none';
};

// const buttonBlock = (value = null) => {
//   const button = document.querySelector('button[type="submit"]');
//   button.disabled = !!value;
// };

export default (state, elements) =>
  onChange(state, (path, value) => {
    console.log(value);

    switch (value) {
      case 'sendingRequest':
        renderMan('typing', elements);
        // typing
        break;
      case 'responseRecieved':
        renderQr(elements, state.qrCode);
        renderMan('talking', elements, 'Your QrCode is ready. Copy on click.');
        // renderMan('blinking', elements);
        break;
      case 'copyied':
        renderMan('talking', elements, 'Copied to clipboard!');
        break;
      case 'failed':
        renderErrors(elements, state.form.error);
        break;
      default:
        break;
    }
  });
