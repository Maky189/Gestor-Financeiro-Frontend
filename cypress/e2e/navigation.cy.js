describe('Navigation Tests', () => {
  it('should redirect to login if not authenticated', () => {
    cy.visit('/')
    cy.url().should('include', '/login.html')
  })

  it('should load login page', () => {
    cy.visit('/login.html')
    cy.contains('Login').should('be.visible')
  })

  it('should load register page', () => {
    cy.visit('/register.html')
    cy.contains('Criar Conta').should('be.visible')
  })
})