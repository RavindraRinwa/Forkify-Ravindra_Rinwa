import View from './View.js';
import icons from 'url:../../img/icons.svg';
class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page1 and there no other pages
    if (numPages === 1) return;
    //Page1 and there are other pages
    else if (this._data.page === 1) return this._generateMarkupButton('next');
    //on last page
    else if (this._data.page === numPages)
      return this._generateMarkupButton('prev');
    //other page
    else {
      return (
        this._generateMarkupButton('next') + this._generateMarkupButton('prev')
      );
    }
  }
  _generateMarkupButton(dir) {
    return `
  <button class="btn--inline pagination__btn--${dir}" data-goto="${
      dir === 'next' ? this._data.page + 1 : this._data.page - 1
    }">
    <span>Page ${
      dir === 'next' ? this._data.page + 1 : this._data.page - 1
    }</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-${
      dir === 'next' ? 'right' : 'left'
    }"></use>
    </svg>
  </button> `;
  }
  //we use event deligation bacause we more than one element.
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      //beacuse we have span tag like stuff so we use closest
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      handler(goto);
    });
  }
}
export default new paginationView();
