describe('Add Expense Modal Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/users/me', { statusCode: 200, body: { user: 'test' } })
    cy.intercept('POST', '**/api/spendings', { statusCode: 201, body: { success: true } }).as('addSpending')
  })

  it('should open modal on load', () => {
    cy.visit('/aba-de-entrada.html')
    cy.get('#modalOverlay').should('have.class', 'active')
  })

  it('should add expense', () => {
    cy.visit('/aba-de-entrada.html')
    cy.get('#gastoInput').type('Test Expense')
    cy.get('#descricaoInput').type('Description')
    cy.get('#categoryBtn').click()
    cy.get('#dropdownContent a').first().click()
    cy.get('#valorInput').type('50')
    cy.get('#saveBtn').click()
    cy.wait('@addSpending')
  })

  it('should cancel modal', () => {
    cy.visit('/aba-de-entrada.html')
    cy.get('#cancelBtn').click()
    cy.get('#modalOverlay').should('not.have.class', 'active')
  })
})