import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(res => previewView._generateMarkupPreview(res))
      .join(' ');
  }
  // previewView._generateMarkupPreview
}

export default new BookmarksView();
