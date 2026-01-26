describe('Options Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/users/me', { statusCode: 200, body: { user: 'test' } })
  })

  it('should load options page', () => {
    cy.visit('/options.html')
    cy.contains('Perfil do Utilizador').should('be.visible')
  })

  it('should navigate to profile', () => {
    cy.visit('/options.html')
    cy.get('a[href="profile.html"]').click()
    cy.url().should('include', '/profile.html')
  })

  it('should logout', () => {
    cy.intercept('POST', '**/api/users/logout', { statusCode: 200 }).as('logout')
    cy.visit('/options.html')
    cy.get('#logoutBtn').click()
    cy.wait('@logout')
    cy.url().should('include', '/login.html')
  })
})