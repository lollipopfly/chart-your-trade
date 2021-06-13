const messages = {
  auth: {
    "auth/email-already-in-use":
      "Адрес электронной почты уже используется другой учетной записью!",
    "auth/user-not-found":
      "Пользователь не найден. Возможно, пользователь был удален.",
    "auth/wrong-password":
      "Пароль недействителен или у пользователя нет пароля.",
    "auth/too-many-requests":
      "Доступ к этой учетной записи временно приостановлен из-за многих неудачных попыток входа в систему. Повторите попытку позже.",

    "auth/success-registration": "Вы успешно зарегистрировались!",
    "auth/success-login": "Вы успешно авторизовались!",
  },
  validation: {
    decimal: "Введите число",
    email: "Введите правильный email адрес",
    minLength: "Пароль должен превышать {min} символов",
    numeric: "Введите цифру",
    required: "Это поле необходимо заполнить",
  },
  portfolio: {
    "success-add": "Портфель добавлен!",
    "success-update": "Портфель обновлен!",
  },
  trade: {
    "success-add": "Сделка добавлена!",
    "success-update": "Сделка обновлена!",
    "no-trades": "У вас еще нет сделок.",
  },

  modal: {
    add: "Добавить",
    update: "Редактировать",
    button: {
      add: "Добавить",
      update: "Обновить",
    },
  },
  actions: {
    "sure-question": "Вы уверены?",
  },
  error: {
    "something-went-wrong": "Что-то пошло не так!",
  },
};

export default messages;
