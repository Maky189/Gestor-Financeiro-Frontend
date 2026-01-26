describe('History Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/users/me', { statusCode: 200, body: { user: 'test' } })
    cy.intercept('GET', '**/api/categories', { statusCode: 200, body: [{ id: 1, nome: 'Food' }] })
    cy.intercept('GET', '**/api/spendings', { statusCode: 200, body: [
      { nome: 'Lunch', data: '2023-01-01', descricao: 'Daily lunch', categoria_id: 1, preco: 10 }
    ] }).as('spendings')
  })

  it('should load and display transaction history', () => {
    cy.visit('/historico.html')
    cy.wait('@spendings')
    cy.get('.historico-tabela tbody').should('contain', 'Lunch')
    cy.get('.historico-tabela tbody').should('contain', '10 esc')
  })
})