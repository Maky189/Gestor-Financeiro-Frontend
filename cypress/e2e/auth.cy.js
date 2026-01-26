describe('Authentication Tests', () => {
  describe('Login', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/users/login', { statusCode: 200, body: { success: true } }).as('loginRequest')
    })

    it('should login successfully', () => {
      cy.visit('/login.html')
      cy.get('#usernameInput').type('testuser')
      cy.get('#passwordInput').type('testpass')
      cy.get('#loginBtn').click()
      cy.wait('@loginRequest')
      cy.url().should('include', '/index.html')
    })

    it('should show error on failed login', () => {
      cy.intercept('POST', '**/api/users/login', { statusCode: 401, body: { error: 'Invalid credentials' } }).as('loginFail')
      cy.visit('/login.html')
      cy.get('#usernameInput').type('wronguser')
      cy.get('#passwordInput').type('wrongpass')
      cy.get('#loginBtn').click()
      cy.wait('@loginFail')
      cy.url().should('include', '/login.html')
    })
  })

  describe('Register', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/users', { statusCode: 201, body: { success: true } }).as('registerRequest')
    })

    it('should register successfully', () => {
      cy.visit('/register.html')
      cy.get('#nomeInput').type('Test User')
      cy.get('#apelidoInput').type('Test')
      cy.get('#usernameInput').type('testuser')
      cy.get('#emailInput').type('test@example.com')
      cy.get('#telefoneInput').type('123456789')
      cy.get('#moradaInput').type('Test Address')
      cy.get('#senha').type('password123')
      cy.get('#confirmarSenha').type('password123')
      cy.get('#registerForm').submit()
      cy.wait('@registerRequest')
      cy.url().should('include', '/index.html')
    })

    it('should show error on password mismatch', () => {
      cy.visit('/register.html')
      cy.get('#nomeInput').type('Test User')
      cy.get('#apelidoInput').type('Test')
      cy.get('#usernameInput').type('testuser')
      cy.get('#emailInput').type('test@example.com')
      cy.get('#telefoneInput').type('123456789')
      cy.get('#moradaInput').type('Test Address')
      cy.get('#senha').type('password123')
      cy.get('#confirmarSenha').type('password456')
      cy.get('#registerForm').submit()
      cy.get('#erroSenhas').should('be.visible')
    })
  })
})