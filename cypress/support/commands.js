Cypress.Commands.add('fillMandatoryFieldsAndSubmit',function(){

    cy.get('#firstName').type('Renato')
    cy.get('#lastName').type('Nunes')
    cy.get('#email').type('teste@teste.com')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('fillMandatoryFieldsAndSubmitWithParamanters',function(firstName, lastName, email, text_area){

    cy.get('#firstName').type(firstName)
    cy.get('#lastName').type(lastName)
    cy.get('#email').type(email)
    cy.get('#open-text-area').type(text_area)
    cy.get('button[type="submit"]').click()
})