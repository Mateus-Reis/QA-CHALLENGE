import { bookStoreSearch } from '../../data/book-store';
import { BookStorePage } from '../../pages/book-store.page';

describe('Book Store', () => {
  it('filters to the matching title and author and restores books after clearing the search', () => {
    const bookStorePage = new BookStorePage();
    const { matchingBook, unrelatedTitle } = bookStoreSearch;

    bookStorePage.visit();

    bookStorePage.getBookTitle(matchingBook.title).should('be.visible');
    bookStorePage.getBookTitle(unrelatedTitle).should('be.visible');

    bookStorePage.searchFor(matchingBook.title);

    bookStorePage.getSearchInput().should('have.value', matchingBook.title);
    bookStorePage.getBookRows().should('have.length', 1);
    bookStorePage
      .getBookTitle(matchingBook.title)
      .should('have.text', matchingBook.title)
      .and('be.visible');
    bookStorePage
      .getBookAuthor(matchingBook.title)
      .should('have.text', matchingBook.author);
    bookStorePage.getBookTitle(unrelatedTitle).should('not.exist');

    bookStorePage.clearSearch();

    bookStorePage.getSearchInput().should('have.value', '');
    bookStorePage.getBookTitle(matchingBook.title).should('be.visible');
    bookStorePage.getBookTitle(unrelatedTitle).should('be.visible');
  });
});
