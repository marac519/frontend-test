describe('testing login', () => {
    it('email-password login', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get(".mantine-TextInput-input").click()
      .type('test2@test.hu')
      cy.get(".mantine-PasswordInput-innerInput").click()
      .type('12345678')
      
      cy.get(".mantine-Button-root").click()
      
      cy.url().should('eq', 'http://localhost:3000/')
      
      cy.visit('http://localhost:3000/upload');

      cy.get('.mantine-Dropzone-root input').selectFile('cypress/assets/dog.jpg',{force: true})
      cy.get('.icon-tabler-circle-check')
    })
  })

  export {}