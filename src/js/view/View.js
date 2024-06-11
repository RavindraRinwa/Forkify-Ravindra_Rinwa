import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    if (!markup) return;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  update(data) {
    //
    this._data = data;
    const newMarkup = this._generateMarkup();

    //convert the string into dom object which live in memory
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    // console.log(newElements);
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(currElements);

    //Upadate the text element
    newElements.forEach((newEl, i) => {
      //

      const curEl = currElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      if (
        !newEl.isEqualNode(curEl) &&
        newEl?.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //Update the attribute like updateTo
      /*
    console.log(newEl.attributes); get the list of all attribute which is changed from curr to new
    */
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }

      //
    });
  }
  //Spinner
  renderSpinner() {
    const markup = `<div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //render Error
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //renderSuccess
  renderMessage(message = this._message) {
    const markup = `<div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
