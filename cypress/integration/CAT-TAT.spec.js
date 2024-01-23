/// <reference types="Cypress" />

//Comando para abrir o Cypress via terminal --> npm run cy:open

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
        // const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste.'
        const longText = Cypress._.repeat('Teste', 10)

        cy.clock()
        
        cy.get('#firstName').type('Renato', {delay: 0})
        cy.get('#lastName').type('Nunes', {delay: 0})
        cy.get('#email').type('teste@teste.com', {delay: 0})
        cy.get('#open-text-area').type(longText, {delay: 0}).should('have.value', longText)
        cy.contains('button', 'Enviar').click()
        //O contains é uma outra forma de mapear o elemento. Você passa primeiro o elemento e depois o que ele contém.

        cy.get('.success').should('be.visible')

        cy.tick(3000)
        
        cy.get('.success').should('not.be.visible')

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
        
        Cypress._.times(5, function() {

            cy.get('#phone').type('k').should('have.value', '')

        })

    })

    //Teste 05
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){

        Cypress._.times(5, function (){

        cy.get('#firstName').type('Renato', {delay: 0})
        cy.get('#lastName').type('Nunes', {delay: 0})
        cy.get('#email').type('teste@teste.com', {delay: 0})
        cy.get('#open-text-area').type('Teste', {delay: 0})
        cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')  

        })

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


    it('testa a página da política de privacidade de forma independente', function(){

        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        //A validação se a página da Política de privacidade abriu ou não, pode ser feita das duas formas abaixo:
        //gitcy.get('#title').contains('Política de privacidade')
        cy.contains('Política de privacidade').should('be.visible')
    })


    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', function(){

        //Faz exibir a mensagem de sucesso que está contida na tag "sucess", e realiza a validação com o "and", e depois esconde a 
        //mensagem novamente. O mesmo é realizado com a tag "error".
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')

        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')

        
    })

    it('preenche a area de texto usando o comando invoke', function(){

        const nome = "Renato Nunes"
        const longText = Cypress._.repeat('0123456789', 20)
        cy.get('#firstName')
            .should('not.have.value')
            .invoke('val', nome)
            .should('have.value', nome)
        
        cy.get('#open-text-area')
            .should('not.have.value')
            .invoke('val', longText)
            .should('have.value', longText)
    
        
    })


    it.only('faz uma requisição HTTP', function(){

        cy.request({
            method: 'GET',
            url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
        })
            .then((response) => {

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK')
                expect(response.body).to.include('CAC TAT')
                expect(response.body).to.include('🐈')

            })

        //Forma diferente de fazer

        // cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        //     .should(function(response){
        //         const {status, statusText, body } = response
        //         expect(status).to.equal(200)
        //         expect(statusText).to.equal('OK')
        //         expect(body).to.include('CAC TAT')
        //     })
        
    })

    it.only('encontrando o gato no html', function(){

        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .invoke('hide')
            .should('not.be.visible')

    })


})
