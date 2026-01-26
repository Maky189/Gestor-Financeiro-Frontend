describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/users/me', { statusCode: 200, body: { user: 'test' } }).as('sessionCheck')

    cy.intercept('GET', '**/api/account', { statusCode: 200, body: { saldo_atual: 1000 } }).as('accountData')
    cy.intercept('GET', '**/api/categories', { statusCode: 200, body: [{ nome: 'Food' }, { nome: 'Transport' }] }).as('categoriesData')
    cy.intercept('GET', '**/api/spendings', { statusCode: 200, body: [] }).as('spendingsData')
  })

  it('should load dashboard and display data', () => {
    cy.visit('/index.html')
    cy.wait(['@sessionCheck', '@accountData', '@categoriesData', '@spendingsData'])
    cy.get('#orcamentoRestante').should('contain', '1000 esc')
    cy.get('#despesaTotal').should('contain', '0 esc')
  })

  it('should navigate to other pages', () => {
    cy.visit('/index.html')
    cy.get('a[href="conta.html"]').click()
    cy.url().should('include', '/conta.html')
  })
})