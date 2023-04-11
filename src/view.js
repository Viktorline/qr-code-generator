/* eslint-disable no-param-reassign */

import onChange from 'on-change';

const speechSpeed = 60;
const returnSpeed = 2500;

const displayTextLetterByLetter = (element, phrase, delay) => {
  let index = 0;
  const interval = setInterval(() => {
    element.message.textContent += phrase[index];
    index += 1;

    if (index >= phrase.length) {
      clearInterval(interval);
    }
  }, delay);
};

const renderMan = (actionType, elements, delay, phrase = '') => {
  switch (actionType) {
    case 'typing':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('typing', 'page__officeGuy');
      break;
    case 'talking':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('talking', 'page__officeGuy');
      elements.message.textContent = '';
      displayTextLetterByLetter(elements, phrase, delay);
      break;
    case 'blinking':
      elements.officeGuy.classList = '';
      elements.officeGuy.classList.add('blinking', 'page__officeGuy');
      elements.message.textContent = '';
      break;
    default:
      break;
  }
};

const renderErrors = (elements, value) => {
  switch (value) {
    case 'invalid':
      renderMan('talking', elements, speechSpeed, 'Your link is not valid!');
      break;
    case 'AxiosError':
      renderMan('talking', elements, speechSpeed, 'We got network error!');
      break;
    case 'unknown':
      renderMan('talking', elements, speechSpeed, 'We got unknown problem');
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

export default (state, elements) =>
  onChange(state, (path, value) => {
    switch (value) {
      case 'sendingRequest':
        renderMan('typing', elements);
        // typing
        break;
      case 'responseRecieved':
        renderQr(elements, state.qrCode);
        renderMan('talking', elements, speechSpeed, 'Your QrCode is ready. Copy on click.');
        setTimeout(() => {
          renderMan('blinking', elements);
        }, 4000);
        break;
      case 'copyied':
        renderMan('talking', elements, speechSpeed, 'Copied to clipboard!');
        setTimeout(() => {
          renderMan('blinking', elements);
        }, returnSpeed);
        break;
      case 'failed':
        renderErrors(elements, state.form.error);
        setTimeout(() => {
          renderMan('blinking', elements);
        }, returnSpeed);
        break;
      case '':
        break;
      default:
        break;
    }
  });
