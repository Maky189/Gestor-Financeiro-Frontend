describe('Profile Edit Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/users/me', { statusCode: 200, body: { user: 'test' } })
  })

  it('should load profile edit page', () => {
    cy.visit('/profile_edit.html')
    cy.get('.goback a').should('have.attr', 'href', 'profile.html')
  })

  it('should go back to profile', () => {
    cy.visit('/profile_edit.html')
    cy.get('.goback a').click()
    cy.url().should('include', '/profile.html')
  })
})