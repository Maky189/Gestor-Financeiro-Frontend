describe('Account Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/users/me', { statusCode: 200, body: { user: 'test' } })
    cy.intercept('GET', '**/api/account', { statusCode: 200, body: { numero_conta: '12345', saldo_atual: 500 } }).as('account')
  })

  it('should load and display account info', () => {
    cy.visit('/conta.html')
    cy.wait('@account')
    cy.get('#account-number').should('contain', '12345')
    cy.get('#account-balance').should('contain', '500.00')
  })

  it('should add balance', () => {
    cy.intercept('POST', '**/api/account/saldo', { statusCode: 200, body: { saldo_atual: 600 } }).as('addBalance')
    cy.visit('/conta.html')
    cy.wait('@account')
    cy.get('#add-amount').type('100')
    cy.get('#add-balance-btn').click()
    cy.wait('@addBalance')
    cy.get('#account-balance').should('contain', '600.00')
  })
})