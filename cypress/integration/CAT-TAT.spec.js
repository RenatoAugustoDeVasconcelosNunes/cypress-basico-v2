/// <reference types="Cypress" />

//Comando para abrir o Cypress via termina --> npm run cy:open

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
        cy.contains('button', 'Enviar').click()
        //O contains é uma outra forma de mapear o elemento. Você passa primeiro o elemento e depois o que ele contém.

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
        cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')  

    })

    //Teste 06
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){

        cy.get('#firstName')
        .type('Renato')
        .should('have.value', 'Renato')
        .clear().
        should('have.value', '')

        cy.get('#lastName')
        .type('Nunes')
        .should('have.value', 'Nunes')
        .clear().
        should('have.value', '')

        cy.get('#email')
        .type('teste@teste.com')
        .should('have.value', 'teste@teste.com')
        .clear().
        should('have.value', '')

        cy.get('#phone')
        .type('123445')
        .should('have.value', '123445')
        .clear().
        should('have.value', '')

    })


    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){

        cy.get('.button')
        .click()
        
        cy.get('.error')
        .should('be.visible')
    })


    it('envia o formulário com sucesso usando um comando customizado', function(){

        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
    })

    it('mesmo teste acima mas com parâmetros', function(){

        cy.fillMandatoryFieldsAndSubmitWithParamanters('Renato', 'Nunes', 'teste@teste.com', 'Testando o teste')
        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function(){

        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')

    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){

        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')

    })

    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('[type="radio"]')
            .check('feedback')
            .should('have.value', 'feedback')

    })


    it('marca cada tipo de atendimento', function(){

        cy.get('[type="radio"]')
            .should('have.length', 3) //verifica o total de radio (neste caso 3 elementos)
            .each(function($radio) { //Utilizado para percorrer o "array" dos elementos radio)
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })

    })

    //Marca/Desmarca checkbox e verifica se está marcado ou não
    it('marca ambos checkboxes, depois desmarca o último', function(){

        cy.get('[type="checkbox"]')
            .check()
            .should('be.checked')
            .last().uncheck().should('not.be.checked')

        //Outra forma de fazer:
        //cy.get('input[type="checkbox"]')
        // .check()
        // .should('be.checked')
        // .last().uncheck().should('not.be.checked')

    })

    it('seleciona um arquivo da pasta fixtures', function(){

        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')

            .should(function($input){
                console.log($input) //Loga na aba "Console", do inspecionar, um jQuery que é utilizado como base no expect
                expect($input[0].files[0].name).to.equal('example.json')
                //$input[0].files[0].name --> Isso é como se estivesse indo acessando os níveis de um HTML (por exemplo), até chegar
                //na "tag" que precisa pegar a informação.
                //Então o $input[0] é o primeiro nível, .files[0] é o segundo nível, e .name é onde contém o nome do arquivo que 
                //precisamos validar no "to.equal". Cada parte desta cadeia é chamada de objeto.
            })
    })


    it('seleciona um arquivo simulando um drag-and-drop', function(){

        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function($input){
                console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })


    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){

        cy.fixture('example.json', null).as('myExemplo')

        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('@myExemplo')
            .should(function($input){
                console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })


    })


    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){

        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })


    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){

        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        //cy.get('#title')
    })


    it.only('testa a página da política de privacidade de forma independente', function(){

        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        //A validação se a página da Política de privacidade abriu ou não, pode ser feita das duas formas abaixo:
        //gitcy.get('#title').contains('Política de privacidade')
        cy.contains('Política de privacidade').should('be.visible')
    })


    




})
