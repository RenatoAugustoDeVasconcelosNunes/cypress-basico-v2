/// <reference types="Cypress" />

it.only('realizar login com sucesso', function(){

    cy.request({

        method: 'GET',
        url: 'https://serverest.dev/usuarios',

    })
        .then((response) => {

            expect(response.status).to.equal(200);
            // expect(response.body).console.log();
            expect(response.body).to.include('Fulano')


        })



})