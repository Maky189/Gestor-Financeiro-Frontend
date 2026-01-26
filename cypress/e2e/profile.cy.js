describe('Profile Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/users/me', { statusCode: 200, body: {
      nome: 'John', apelido: 'Doe', email: 'john@example.com', numero: '123456789', morada: 'Test Address'
    } }).as('userMe')
  })

  it('should load and display user profile', () => {
    cy.visit('/profile.html')
    cy.wait('@userMe')
    cy.get('.user-profile-name').should('contain', 'John Doe')
    cy.get('#user-email').should('contain', 'john@example.com')
    cy.get('#user-telefone').should('contain', '123456789')
    cy.get('#user-morada').should('contain', 'Test Address')
  })

  it('should navigate to edit profile', () => {
    cy.visit('/profile.html')
    cy.get('a[href="profile_edit.html"]').click()
    cy.url().should('include', '/profile_edit.html')
  })
})