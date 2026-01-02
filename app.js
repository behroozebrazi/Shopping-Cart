
const productsCenter = document.querySelector('.products-center')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const cartOverlay = document.querySelector('.cart-overlay')
const cartDOM = document.querySelector('.cart')
const closeCartBtn = document.querySelector('.close-cart')
const cartBtn = document.querySelector('.cart-btn')
const clearCartBtn = document.querySelector('.clear-cart')

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

// Manage storage products
class Storage {
  // Save products in browser
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products))
  }

  // Get a product by a product id
  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem('products'))
    return products.find(item => item.id === id)
  }

  // Save cart's products to browser
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  // Get cart's products from browser
  static getCart() {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
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

  // Add a product to cart - click on product button
  getCartButtons() {
    // return a Nodelist (which doesn't have the list methods, such as map, filter, reduce, push, pop)
    const buttonsNodelist = document.querySelectorAll('.product-btn')
    // convert a Nodelist to a List by spread operator [...]
    const buttons = [...buttonsNodelist]
    // add event listener to buttons
    buttons.forEach(button => {
      let id = button.dataset.id
      button.addEventListener('click', () => {
        let cartItem = Storage.getProduct(id)
        /// Update cart with a product at browser
        // get cart's products from browser
        cart = Storage.getCart()
        let cartIndex = cart.findIndex(item => item.id === cartItem.id)
        if (cartIndex >= 0) {
          cart[cartIndex].amount += 1
          cartItem = cart[cartIndex]
        } else {
          cartItem = { ...cartItem, amount: 1 }
          cart = [...cart, cartItem] // cart.push(cartItem)
        }
        // save cart's products to browser
        Storage.saveCart(cart)
        // calculate total and price of cart and add to DOM
        this.setCartValues(cart)
        // add an item to cart in DOM
        this.addCartItem(cartItem)
        // show cart sidebar
        this.showCart()
      })
    })
  }

  // Calculate total and price of cart and add to DOM
  setCartValues(cart) {
    let totalItems = 0
    let totalPrice = 0
    cart.forEach(item => {
      totalItems += item.amount
      totalPrice += item.amount * item.price
    })
    cartItems.innerText = totalItems
    cartTotal.innerText = '$' + totalPrice
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
        <i class="fas fa-chevron-up"></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down"></i>
      </div>
    `
    cartContent.appendChild(div)
  }

  // Show cart sidebar
  showCart() {
    cartOverlay.classList.add('transparentBcg')
    cartDOM.classList.add('show-cart')
  }

  // Hide cart sidebar
  hideCart() {
    cartOverlay.classList.remove('transparentBcg')
    cartDOM.classList.remove('show-cart')
  }

  // Open cart sidebar
  openCart() {
    cartBtn.addEventListener('click', () => { this.showCart() })
  }

  // Close cart sidebar
  closeCart() {
    closeCartBtn.addEventListener('click', () => { this.hideCart() })
    cartOverlay.addEventListener('click', (event) => {
      if (event.target === cartOverlay)
        this.hideCart()
    })
  }

  // Initialize App
  initApp() {
    cart = Storage.getCart()
    cart.forEach(item => { this.addCartItem(item) })
    this.setCartValues(cart)
    this.openCart()
    this.closeCart()
  }

  // 
  cartProcess() {
    clearCartBtn.addEventListener('click', () => this.clearCart())
  }

  // Remove all products from cart
  clearCart() {
    let cartItems = cart.map((item) => { return item.id })
    console.log(cartItems)
    cartItems.forEach((id) => { return this.removeProduct(id) })
    while (cartContent.children.length > 0)
      cartContent.removeChild(cartContent.children[0])
  }

  // Remove one product from cart
  removeProduct(id) {
    cart = cart.filter(item => item.id !== id)
    this.setCartValues(cart)
    Storage.saveCart(cart)
  }
}


// Create objects after loading DOM
document.addEventListener('DOMContentLoaded', (e) => {
  const product = new Product()
  const view = new View()

  // Initialize app
  view.initApp()

  const products = product.getProducts()
    .then(products => {
      view.displayProducts(products)
      Storage.saveProducts(products)
    })
    .then(() => {
      view.getCartButtons()
      view.cartProcess()
    })

})

