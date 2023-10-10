/// <reference types="Cypress" />

//describe é a suíte de testes e o it é o test case
describe('Central de Atendimento ao Cliente TAT', function() {

    //Dentro do beforeEach deve conter tudo que será realizado, antes da execução de qualquer test case. Neste caso está abrindo
    //a página, para depois iniciar o teste "verificar o título da aplicação"
    beforeEach(function(){
        //Acessa o site (neste caso está acessando o arquivo local do site)
        cy.visit('./src/index.html')

    })

    //it é um comando no qual contém os dados de um teste específico. Neste caso, o teste é "verificar o título da aplicação"
    //Teste 01
    it('verificar o título da aplicação', function() {

        

        //Realiza a validação se o título da página é Central de Atendimento ao Cliente TAT
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    //Teste 02
    //.only informa que quer executar apenas este test case
    it('preencher os campos obrigatórios e envia o formulário', function(){

        //Criação de variável
        //const é o tipo da variável, e longText é o nome da variável
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste.'
        cy.get('#firstName').type('Renato', {delay: 0})
        cy.get('#lastName').type('Nunes', {delay: 0})
        cy.get('#email').type('teste@teste.com', {delay: 0})
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    //Teste 03
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){

        cy.get('#firstName').type('Renato', {delay: 0})
        cy.get('#lastName').type('Nunes', {delay: 0})
        cy.get('#email').type('teste@teste,com', {delay: 0})
        cy.get('#open-text-area').type('Teste', {delay: 0})
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')  

    })

    //Teste 04
    it('campo telefone continua vazio quando preenchido com valor não-numérico,', function(){
        
        cy.get('#phone').type('k').should('have.value', '')

    })

    //Teste 05
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){

        cy.get('#firstName').type('Renato', {delay: 0})
        cy.get('#lastName').type('Nunes', {delay: 0})
        cy.get('#email').type('teste@teste.com', {delay: 0})
        cy.get('#open-text-area').type('Teste', {delay: 0})
        cy.get('#phone-checkbox').check()
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')  

    })



})
