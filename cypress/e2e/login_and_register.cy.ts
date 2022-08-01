describe('testing login', () => {
  it('email-password login', () => {
    cy.visit('http://localhost:3000/login');

    cy.get(".mantine-TextInput-input").click()
    .type('test2@test.hu')
    cy.get(".mantine-PasswordInput-innerInput").click()
    .type('12345678')
    
    cy.get(".mantine-Button-root").click()
    
    cy.url().should('eq', 'http://localhost:3000/')
    
    // signing out
    cy.get(".profile-area button").click()
    
    cy.get(".mantine-Anchor-root").click()
    cy.get('[placeholder="Your name"]').click()
    .type('Martin')
    cy.get('[placeholder="hello@mantine.dev"]').click()
    .type('test30@test.hu')
    cy.get('[placeholder="Your password"]').click()
    .type('12345678')
    cy.get(".mantine-Button-root").click()
    
    cy.url().should('eq', 'http://localhost:3000/')
  })
})

export {}