/// <reference types="cypress" />

describe('Страница конструктора бургеров', () => {
  beforeEach(() => {
    // Загружаем фикстуры с тестовыми данными
    cy.fixture('ingredients').as('ingredientsData');
    cy.fixture('user').as('userData');
    cy.fixture('order').as('orderData');

    // Перехватываем и мокируем запросы к API
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Имитируем авторизованного пользователя
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    cy.setCookie('accessToken', 'mock-access-token');

    // Переходим на главную страницу приложения
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем localStorage и cookies после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Должны отображаться ингредиенты после загрузки страницы', () => {
    cy.contains('Соберите бургер').should('be.visible');
    cy.get('[data-testid=ingredient-items]').should('have.length.gt', 0);
  });

  it('Добавление булки в конструктор', () => {
    cy.get('[data-testid=ingredient-item]')
      .first()
      .find('button')
      .click();

    cy.get('[data-testid=constructor-bun]')
      .should('contain', 'Краторная булка');
  });

  it('Добавление начинки в конструктор', () => {
    cy.get('[data-testid=ingredient-item]')
      .eq(1)
      .find('button')
      .click();

    cy.get('[data-testid=constructor-main]')
      .should('contain', 'Биокотлета');
  });

  it('Открытие модального окна при клике на ингредиент', () => {
    cy.get('[data-testid=ingredient-item]')
      .contains('Краторная булка')
      .click();

    cy.get('[data-testid=modal]')
      .should('be.visible')
      .within(() => {
        cy.contains('Краторная булка').should('be.visible');
      });
  });

  it('Закрытие модального окна по кнопке закрытия', () => {
    cy.get('[data-testid=ingredient-item]')
      .contains('Краторная булка')
      .click();

    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('Закрытие модального окна по нажатию клавиши Esc', () => {
    cy.get('[data-testid=ingredient-item]')
      .contains('Краторная булка')
      .click();

    cy.get('body').type('{esc}');
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('Закрытие модального окна по клику на оверлей', () => {
    cy.get('[data-testid=ingredient-item]')
      .contains('Краторная булка')
      .click();

    cy.get('[data-testid=modal-overlay]')
      .click({ force: true });

    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('Оформление заказа: успешное создание и очистка конструктора', () => {
    // Добавляем ингредиенты в конструктор
    cy.get('[data-testid=ingredient-item]').first().find('button').click();
    cy.get('[data-testid=ingredient-item]').eq(1).find('button').click();
    cy.get('[data-testid=ingredient-item]').eq(2).find('button').click();

    // Нажимаем кнопку оформления заказа
    cy.contains('Оформить заказ').click();

    // Проверяем отображение модального окна с номером заказа
    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=order-number]').should('contain', '12345');

    // Закрываем модальное окно
    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');

    // Проверяем, что состояние конструктора сброшено
    cy.get('[data-testid=constructor-bun]').should('not.exist');
    cy.get('[data-testid=constructor-main-null]')
      .should('contain', 'Выберите начинку');
  });
});
