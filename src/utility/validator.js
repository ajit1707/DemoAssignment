import validation from 'validate.js';
import Constant from './constant';

export function validate(fieldName, value, errorMessage) {
  const constraints = {
    email: {
      presence: true,
      format: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: `^${Constant.INVALID_USERNAME}`,
      },
    },
    username: {
      presence: true,
      format: {
        pattern: /^(\+44\d{4}|\(?0\d{4}\)?)\d{6}$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: `^${Constant.INVALID_USERNAME}`,
      },
    },
    phoneNumber: {
      presence: true,
      format: {
        pattern: /^(\+44\d{4}|\(?0\d{4}\)?)\d{6}$/,
        message: `^${Constant.INVALID_PHONE_NUMBER}`,
      },
    },
    password: {
      presence: true,
      length: {
        minimum: 8,
        message: `^${Constant.INVALID_PASSWORD_LENGTH}`,
      },
    },
    confirmPassword: {
      presence: true,
      equality: 'password',
    },
    postalCode: {
      presence: true,
      format: {
        pattern: /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/,
        message: `^${Constant.INVALID_POSTAL_CODE}`,
      },
    },
    projectCode: {
      presence: true,
      length: {
        minimum: 6,
        message: 'length should be of 6 characters',
      },
    },
    textRequired: {
      presence: true,
      length: {
        minimum: 1,
        message: errorMessage,
      },
    },
    selectCategory: {
      presence: true,
      within: 'Select Category',
    },
  };

  const formValues = {};
  formValues[fieldName] = value;

  const formFields = {};
  formFields[fieldName] = constraints[fieldName];

  const result = validation(formValues, formFields);

  if (result) {
    return result[fieldName][0];
  }
  return null;
}

export function checkNullOrWhiteSpaces(text) {
  return /^\s+$/.test(text) || !text;
}

export function checkWhiteSpaces(text) {
  return /^\s/.test(text) || !text;
}
