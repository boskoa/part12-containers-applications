describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Tester',
      username: 'tester',
      password: 'testing'
    }

    const user2 = {
      name: 'Tester 2',
      username: 'tester2',
      password: 'testing'
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.request('POST', 'http://localhost:3003/api/users', user2)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
    cy.contains('username')
  })

  describe('Log in', function() {
    it('Succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('tester')
      cy.get('#password').type('testing')
      cy.get('#login').click()
      cy.contains('Tester is logged in')
    })

    it('Fails with incorrect credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('tester')
      cy.get('#password').type('joking')
      cy.get('#login').click()
      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: 'testing' })
    })

    it('A blog can be created', function() {
      cy.contains('create').click()
      cy.get('#title').type('Some testing blog')
      cy.get('#author').type('Test author')
      cy.get('#url').type('www.example.com/test_blog')
      cy.get('#submitBlog').click()
      cy.visit('http://localhost:3000')
      cy.contains('Some testing blog, by Test author')
    })

    describe('With already existing blog', function() {
      beforeEach(function() {
        cy.addBlog({
          title: 'Some existing blog',
          author: 'Test author',
          url: 'www.example.com/original_blog'
        })
      })

      it('Blog can be liked', function() {
        cy.contains('show').click()
        cy.contains('like').click()
        cy.contains('Likes: 1')
      })

      describe('Removing the blog',function() {
        it('can be done by post creator', function() {
          cy.contains('show').click()
          cy.contains('remove').click()
          cy.get('.note').should('contain', 'Some existing blog')
            .and('have.css', 'color', 'rgb(0, 128, 0)')
        })

        it('can\'t be done by other users', function() {
          cy.get('#logout').click()
          cy.login({ username: 'tester2', password: 'testing' })
          cy.contains('show').click()
          cy.get('.detailed').should('not.contain', 'remove')
        })
      })
    })
    describe('With several existing blogs', function() {
      beforeEach(function() {
        cy.addBlog({
          title: 'Some existing blog 1',
          author: 'Test author',
          url: 'www.example.com/original_blog',
          likes: 0
        })
        cy.addBlog({
          title: 'Some existing blog 2',
          author: 'Test author',
          url: 'www.example.com/original_blog',
          likes: 2
        })
        cy.addBlog({
          title: 'Some existing blog 3',
          author: 'Test author',
          url: 'www.example.com/original_blog',
          likes: 8
        })
        cy.addBlog({
          title: 'Some existing blog 4',
          author: 'Test author',
          url: 'www.example.com/original_blog',
          likes: 5
        })
      })
      it('blogs are sorted by number of likes', function() {
        cy.get('.box>button').click({ multiple: true })
        cy.get('.likesNum')
          .then(($elements) => Cypress.$.makeArray($elements).map((e) => e.innerText))
          .should('deep.equal', ['8', '5', '2', '0'])
      })
    })
  })
})