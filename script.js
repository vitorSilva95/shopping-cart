function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function fetchLoading(url) {
  const container = document.getElementsByClassName('container')[0];
  const loading = createCustomElement('section', 'loading', '');
  const loadingSpan = createCustomElement('span', '', '...loading');
  loading.appendChild(loadingSpan);
  container.appendChild(loading);
  const response = await fetch(url);
  container.removeChild(loading);
  return response;
}

function computerObject(currentValue) {
  return {
    sku: currentValue.id,
    name: currentValue.title,
    image: currentValue.thumbnail,
  };
}

function getCartItems() {
  return document.querySelectorAll('.cart__items')[0];
}

async function requestMerdadoLivre() {
  const collection = [];
  const response = await fetchLoading('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await response.json()
  .then((data) => data.results);
  json.forEach((currentValue) => {
  const computerObj = computerObject(currentValue);
  collection.push(computerObj);
});
return collection;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function totalItems(price, add) {
  const total = document.getElementById('total-price');
  const precoCalc = price * (add ? 1 : -1);
  const precoAtual = parseFloat(total.innerText ? total.innerText : '0');
  total.innerText = (Math.round(((precoAtual + precoCalc) * 100)) / 100);
}

function saveLocalStorage() {
  const ol = getCartItems();
  localStorage.setItem('ol', JSON.stringify(Array.from(ol.childNodes).map((el) => el.innerText)));
}

function cartItemClickListener(event) {
  const element = event.target.parentNode;
  const indexPreco = (event.target).innerText.split('$');
  const price = parseFloat(indexPreco[1]);
  totalItems(price, false);
  element.removeChild(event.target);
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  totalItems(salePrice, true);
  return li;
}

async function fetchWithLoadingObj() {
  const sectionItems = document.getElementsByClassName('items')[0];
  const computerItems = await requestMerdadoLivre();
  computerItems.forEach((element) => {
    const createELementItem = createProductItemElement(element);
    sectionItems.appendChild(createELementItem);
    });
  }
  async function requestMercadoLivreItem(id) {
    const response = await fetchLoading(`https://api.mercadolibre.com/items/${id}`);
    const json = await response.json();
    return json;
  }

  function getLocalStorage() {
    const element = JSON.parse(localStorage.getItem('ol') || '[]');
    const cartItems = getCartItems();

    element.forEach((valor) => {
      const valueArray = valor.split(' | ');
      const obj = {
        sku: valueArray[0].replace('SKU: ', ''),
        name: valueArray[1].replace('NAME: ', ''),
        salePrice: valueArray[2].replace('PRICE: $', ''),
      };
      cartItems.appendChild(createCartItemElement(obj));
    });
  }

    async function onClickAddButton(event) {
      const parent = event.target.parentNode;
      const elements = parent.firstChild.innerText;
      const cartItems = getCartItems();
      const apiItem = await requestMercadoLivreItem(elements)
      .then((element) => {
        const objItem = {
          sku: element.id,
          name: element.title,
          salePrice: element.price,
        };
        return objItem;
      });
      cartItems.appendChild(createCartItemElement(apiItem));
      saveLocalStorage();
  }

  function emptyCart() {
    const cart = getCartItems();
    cart.innerText = '';
    const total = document.getElementById('total-price');
    total.innerText = '';
    localStorage.removeItem('ol');
  }

window.onload = async () => {
  getLocalStorage();
  await fetchWithLoadingObj();
  const buttonAdd = Array.from(document.getElementsByClassName('item__add'));
  buttonAdd.forEach((button) => {
    button.addEventListener('click', onClickAddButton);
  });
  const ButtonClickRemoveItem = Array.from(document.querySelectorAll('.cart_item'));
  ButtonClickRemoveItem.forEach((button) => {
    button.addEventListener('click', onClickAddButton);
  });
  const buttonEmptyCart = document.getElementsByClassName('empty-cart')[0];
  buttonEmptyCart.addEventListener('click', emptyCart);
};
