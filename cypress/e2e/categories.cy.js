describe('Categories Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/users/me', { statusCode: 200, body: { user: 'test' } })
    cy.intercept('GET', '**/api/categories', { statusCode: 200, body: [
      { nome: 'Food', id: 1 },
      { nome: 'Transport', id: 2 }
    ] }).as('categories')
    cy.intercept('GET', '**/api/spendings', { statusCode: 200, body: [
      { nome: 'Lunch', preco: 10, categoria_id: 1 },
      { nome: 'Bus', preco: 5, categoria_id: 2 }
    ] }).as('spendings')
  })

  it('should load and display categories', () => {
    cy.visit('/categorias.html')
    cy.wait(['@categories', '@spendings'])
    cy.get('.lista-categorias').should('contain', 'Food')
    cy.get('.lista-categorias').should('contain', 'Transport')
  })

  it('should display spendings for selected category', () => {
    cy.visit('/categorias.html')
    cy.wait(['@categories', '@spendings'])
    cy.get('.lista-categorias').contains('Food').click()
    cy.get('.categoria-display').should('contain', 'Lunch')
    cy.get('.categoria-display').should('contain', '10 esc')
  })
})