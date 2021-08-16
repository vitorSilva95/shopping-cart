function computerObject(currencyValue) {
  return {
    sku: currencyValue.id,
    name: currencyValue.title,
    image: currencyValue.thumbnail,
  };
}

async function requestMerdadoLivre() {
  const collection = [];
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await response.json()
  .then((data) => data.results);
  json.forEach((currencyValue) => {
  const computerObj = computerObject(currencyValue);
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

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchObj() {
  const sectionItems = document.getElementsByClassName('items')[0];
  const computerItems = await requestMerdadoLivre();
  computerItems.forEach((element) => {
    const createELementItem = createProductItemElement(element);
    sectionItems.appendChild(createELementItem);
    });
  }
  async function requestMercadoLivreItem(id) {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const json = await response.json();
    return json;
  }

    async function onClickAddButton(event) {
      const parent = event.target.parentNode;
      const elements = parent.firstChild.innerText;
      const cartItems = document.querySelectorAll('.cart__items')[0];
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
  }

window.onload = async () => {
  await fetchObj();
  const buttonAdd = Array.from(document.getElementsByClassName('item__add'));
  buttonAdd.forEach((button) => {
    button.addEventListener('click', onClickAddButton);
  });
  
  console.log(buttonAdd);
};
