describe('a new user login', () => {
  const user = Cypress.env('user');

  before(() => {
    cy.visit('/');
  });

  it('should be that the submit button gets disabled', () => {
    cy.get('[name="email"]').type(user.email);
    cy.get('[type="submit"]').should('be.disabled');
  });

  it('should be invalid with wrong credentials', () => {
    cy.get('[name="password"]').type('wrong password');
    cy.get('[type="submit"]').click();

    cy.get('.Toastify').contains('Email or password is wrong');
  });

  it('should be successful with login', () => {
    cy.get('[name="password"]')
      .clear()
      .type(user.password);
    cy.get('[type="submit"]').click();
    cy.get('.Toastify').contains('You are successfully logged in!');
    cy.url().should('include', '/restaurants');
  });
});
