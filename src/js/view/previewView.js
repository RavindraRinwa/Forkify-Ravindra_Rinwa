import { KEY } from '../config.js';
import View from './View.js';
import icons from 'url:../../img/icons.svg';
class PreviewView extends View {
  _generateMarkupPreview(rec) {
    const id = window.location.hash.slice(1);
    console.log(rec);
    return `<li class="preview">
            <a class="preview__link ${
              rec.id === id ? 'preview__link--active' : ''
            }" href="#${rec.id}">
              <figure class="preview__fig">
                <img src="${rec.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${rec.title}</h4>
                <p class="preview__publisher">${rec.publisher}</p>
              </div>
              <div class="preview__user-generated ${rec.key ? '' : 'hidden'}">
               <svg>
               <use href="${icons}#icon-user"></use>
               </svg>
              </div>
            </a>
          </li>`;
  }
}

export default new PreviewView();
