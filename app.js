
const productsCenter = document.querySelector('.products-center')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')

let cart = []

// Receive product from product.json
class Product {
  // fetch data
  async getProducts() {
    // an asynchronous process that returns a Promise
    try {
      const fetchedData = await fetch('./products.json')
      const data = await fetchedData.json()
      const products = data.items.map((item) => {
        const { id } = item.sys
        const { title, price } = item.fields
        const image = item.fields.image.fields.file.url
        return { id, title, price, image }
      })
      return products
    } catch (error) {
      console.log(error)
    }
  }
}

// Show products in DOM
class View {
  // show products in DOM
  displayProducts(products) {
    let productsCenterItems = ''
    products.forEach(item => {
      const newItem = `
        <article class="product">
          <div class="img-container">
            <img src=${item.image} alt=${item.title} class="product-img">
            <button class="product-btn" data-id=${item.id}>Add to cart</button>
          </div>
          <h3>${item.title}</h3>
          <h4>$${item.price}</h4>
        </article>
      `
      productsCenterItems += newItem
    })
    productsCenter.innerHTML = productsCenterItems
  }

  // Add a product to cart
  getCartButtons() {
    // return a Nodelist (which doesn't have the list methods, such as map, filter, reduce, push, pop)
    const buttonsNodelist = document.querySelectorAll('.product-btn')
    // convert a Nodelist to a List by spread operator [...]
    const buttons = [...buttonsNodelist]
    // add event listener to buttons
    buttons.forEach(button => {
      let id = button.dataset.id
      button.addEventListener('click', (event) => {
        let cartItem = Storage.getProduct(id)
        // update cart
        cart = Storage.getCart()
        let cartIndex = cart.findIndex(item => item.id === cartItem.id)
        if (cartIndex >= 0) {
          cart[cartIndex].amount += 1
          cartItem = cart[cartIndex]
        } else {
          cartItem = { ...cartItem, amount: 1 }
          cart = [...cart, cartItem] // cart.push(cartItem)
        }
        Storage.saveCart(cart)
        this.setCartValues(cart)
        this.addCartItem(cartItem)
      })
    })
  }

  // Calculate total and price of cart
  setCartValues(cart) {
    let totalItems = 0
    let totalPrice = 0
    cart.forEach(item => {
      totalItems += item.amount
      totalPrice += item.amount * item.price
    })
    cartItems.innerText = totalItems
    cartTotal.innerText = totalPrice
  }

  // Add an item to cart in DOM
  addCartItem(item) {
    const div = document.createElement('div')
    div.classList.add('cart-item')
    div.innerHTML = `
      <img src=${item.image} alt=${item.title}>
        <div>
          <h4>${item.title}</h4>
          <h5>$${item.price}</h5>
          <span class="remove-item">Delete</span>
        </div>
        <div>
          <i class="fas-fa-chevron-up"></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas-fa-chevron-down"></i>
        </div>
`
    cartContent.appendChild(div)
  }
}

// Manage storage products
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products))
  }
  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem('products'))
    return products.find(item => item.id === id)
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }
  static getCart() {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  }
}


// Create objects after loading DOM
document.addEventListener('DOMContentLoaded', (e) => {
  const product = new Product()
  const view = new View()

  const products = product.getProducts()
    .then(products => {
      view.displayProducts(products)
      Storage.saveProducts(products)
      cart = Storage.getCart()
    })
    .then(() => {
      view.setCartValues(cart)
      view.getCartButtons()
    })




})





