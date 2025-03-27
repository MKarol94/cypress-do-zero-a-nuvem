describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach(() => {
        cy.visit('./src/index.html')
    });

    it('verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', () => {
        cy.clock() //Congela o relógio do navegador

        const longText = Cypress._.repeat('abcdefghijklmnopqrstuvxyz', 10)

        cy.get('#firstName').type('Maria Flor')
        cy.get('#lastName').type('Ribeiro da Silva')
        cy.get('#email').type('maria.flor@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success > strong')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')

        cy.tick(3000) //Avança 3 segundos para não precisar esperar a mensagem 

        cy.get('.success > strong').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.clock()

        cy.get('#firstName').type('João Maria')
        cy.get('#lastName').type('da Silva')
        cy.get('#email').type('joao.gmail.com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error > strong')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios')

        cy.tick(3000)

        cy.get('.error > strong').should('not.be.visible')
    })

    it('campo telefone permanece vazio quando não preenchido por valor não-numérico', () => {
        cy.get('#phone')
            .type('Telefone')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()

        cy.get('#firstName').type('Guilhermina')
        cy.get('#lastName').type('Soares')
        cy.get('#email').type('mina@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error > strong')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios')

        cy.tick(3000)

        cy.get('.error > strong').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
            .type('Ana Clara')
            .should('have.value', 'Ana Clara')
            .clear()
            .should('have.value', '')

        cy.get('#lastName')
            .type('Almeida')
            .should('have.value', 'Almeida')
            .clear()
            .should('have.value', '')

        cy.get('#email')
            .type('ana@gmail.com')
            .should('have.value', 'ana@gmail.com')
            .clear()
            .should('have.value', '')

        cy.get('#phone')
            .type('11978569874')
            .should('have.value', '11978569874')
            .clear()
            .should('have.value', '')

        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()

        cy.contains('button', 'Enviar').click()

        cy.get('.error > strong')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios')

        cy.tick(3000)

        cy.get('.error > strong').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {
        const data = {
            firstName: 'Leo',
            lastName: 'Stronda',
            email: 'leo@gmail.com',
            text: 'Teste.'
        }

        cy.fillMandatoryFieldsAndSubmit(data)

        cy.get('.success > strong')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
    })

    it('seleciona um produto (YouTube)', () => {
        cy.get('#product').select('YouTube')
        cy.get('#product')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria')
        cy.get('#product')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1)
        cy.get('#product')
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get(':nth-child(4) > input').check()
            .should('be.checked')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
            .each(typeOfService => {
                cy.wrap(typeOfService)
                    .check()
                    .should('be.checked');
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]')
            .selectFile('cypress/fixtures/example.json')
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')
            })

    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('exampleFile')
        cy.get('input[type="file"]')
            .selectFile('@exampleFile')
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.contains('a', 'Política de Privacidade')
            .should('have.attr', 'href', 'privacy.html')
            .and('have.attr', 'target', '_blank')

    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.contains('a', 'Política de Privacidade')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('h1', 'CAC TAT - Política de Privacidade')
            .should('be.visible')
    })

    it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
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
      


})
