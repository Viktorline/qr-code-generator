/* eslint-disable */

import onChange from 'on-change';

const renderErrors = (elements, value) => {
  switch (value) {
    case 'invalid':
      elements.message.textContent = 'Your link is not valid!';
      break;
    case 'AxiosError':
      elements.feedback.textContent = 'We got network error!';
      break;
    case 'unknown':
      elements.feedback.textContent = 'We got unknown problem';
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

const renderMan = (actionType, elements, phrase = null) => {
  switch (actionType) {
    case 'typing':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('typing', 'page__officeGuy');
      break;
    case 'talking':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('talking', 'page__officeGuy');
      break;
    case 'blinking':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('blinking', 'page__officeGuy');
      break;
    default:
      break;
  }
};

const buttonBlock = (value = null) => {
  const button = document.querySelector('button[type="submit"]');
  button.disabled = !!value;
};

export default (state, elements) =>
  onChange(state, (path, value) => {
    console.log(value);

    switch (value) {
      case 'sendingRequest':
        buttonBlock(value);
        renderMan('typing', elements);
        // typing
        break;
      case 'responseRecieved':
        // console.log(state.qrCode);
        renderQr(elements, state.qrCode);
        renderMan('talking', elements);
        // renderMan('blinking', elements);
        // talk
        // blinking
        break;
      case 'failed':
        renderErrors(elements, state.form.error);
        renderMan('talking', elements);
        // renderMan('talk');
        break;
      case 'copy':
        // renderMan('talk');
        break;
      default:
        break;
    }
  });
