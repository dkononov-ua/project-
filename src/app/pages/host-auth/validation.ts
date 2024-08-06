import { FormGroup, ValidationErrors } from '@angular/forms';

export const formErrors: any = {
  password: '',
  email: '',
  dob: '',
};

export const validationMessages: any = {
  password: {
    required: "Пароль обов'язково",
    minlength: 'Мін. 7 символів.',
    maxlength: 'Не більше довжина 25 символів',
    pattern: 'Літеру та цифру',
  },

  email: {
    required: "Пошта обов'язкова",
    pattern: 'Невірно вказана пошта',
    minlength: 'Мінімальна довжина 7 символів',
  },

  dob: {
    required: "Дата народження обов'язково",
    pattern: 'Невірно вказана дата народження',
  },
};

export function onValueChanged(loginForm: FormGroup): void {
  Object.keys(loginForm.controls).forEach(field => {
    const control = loginForm.get(field);
    if (control && control.dirty && control.invalid) {
      const messages = validationMessages[field];
      Object.keys(control.errors as ValidationErrors).forEach(key => {
        formErrors[field] += messages[key] + ' ';
      });
    }
  });
}

// перевірка паролю на надійність
export function checkPasswordStrength(password: string): string {
  const hasDigit = /\d/.test(password);
  const hasCyrillicOrLatinLetter = /[а-яА-Яa-zA-Z]/.test(password); // Перевірка на наявність літери кирилиці або латиниці
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Перевірка на наявність спеціального символу
  const hasNoConsecutiveCharacters = !/(.)\1{2,}/.test(password);
  const hasMinimumLength = password.length >= 7;
  let passStrengthMessage = '';

  if (hasDigit && hasCyrillicOrLatinLetter && hasSpecialCharacter && hasNoConsecutiveCharacters && hasMinimumLength) {
    passStrengthMessage = 'ok';
  } else {
    if (!hasDigit) {
      passStrengthMessage += 'Мінімум 1 цифру. ';
    }
    if (!hasCyrillicOrLatinLetter) {
      passStrengthMessage += 'Мінімум 1 літеру кирилиці або латиниці. ';
    }
    if (!hasSpecialCharacter) {
      passStrengthMessage += 'Мінімум 1 спеціальний символ. ';
    }
    if (!hasNoConsecutiveCharacters) {
      passStrengthMessage += 'Більше двох символів підряд. ';
    }
    if (!hasMinimumLength) {
      passStrengthMessage += 'Мінімум 7 символів. ';
    }
  }
  return passStrengthMessage;
}

// перевірка паролю на правильність повторення
export function checkPasswordMatch(password: string, confirmPassword: string) {
  let passMatchMessage = '';
  if (password && confirmPassword && password === confirmPassword) {
    passMatchMessage = 'ok';
  } else {
    passMatchMessage = 'Паролі не збігаються';
  }
  return passMatchMessage;
}
