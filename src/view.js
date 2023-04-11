/* eslint-disable no-param-reassign */

import onChange from 'on-change';

const speechSpeed = 30;
const returnSpeed = 2500;
const returnToBlinkingSpeed = 4000;

const displayTextLetterByLetter = (elements, phrase, delay) => {
  elements.qrContainer.style.pointerEvents = 'none';
  elements.button.disabled = true;
  let index = 0;
  const interval = setInterval(() => {
    elements.message.textContent += phrase[index];
    index += 1;

    if (index >= phrase.length) {
      clearInterval(interval);
      elements.qrContainer.style.pointerEvents = 'auto';
      elements.button.disabled = false;
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

export default (state, elements) => onChange(state, (path, value) => {
  switch (value) {
    case 'sendingRequest':
      renderMan('typing', elements);
      break;
    case 'responseRecieved':
      renderQr(elements, state.qrCode);
      renderMan('talking', elements, speechSpeed, 'Your QrCode is ready. Copy on click.');
      setTimeout(() => {
        renderMan('blinking', elements);
      }, returnToBlinkingSpeed);
      break;
    case 'copyied':
      renderMan(
        'talking',
        elements,
        speechSpeed,
        'Copied to clipboard! Click on me to create a new one!',
      );
      setTimeout(() => {
        renderMan('blinking', elements);
      }, returnToBlinkingSpeed);
      break;
    case 'failed':
      renderErrors(elements, state.form.error);
      setTimeout(() => {
        renderMan('blinking', elements);
      }, returnSpeed);
      break;
    case 'reset':
      renderMan('blinking', elements);
      break;
    case '':
      break;
    default:
      break;
  }
});
