
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
    let productsCenter = ''
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
      productsCenter += newItem
    })
    document.querySelector('.products-center').innerHTML = productsCenter
  }

  // add listener to buttons "Add to cart"
  getCartButtons() {
    // return a Nodelist (which doesn't have the list methods, such as map, filter, reduce, push, pop)
    const buttonsNodelist = document.querySelectorAll('.product-btn')
    // convert a Nodelist to a List by spread operator [...]
    const buttons = [...buttonsNodelist]



    buttons.forEach(button => {
      let id = button.dataset.id
      let cartItem = Storage.getProduct(id)

      // add listener to buttons
      button.addEventListener('click', (event) => {
        // cart.push({ ...cartItem, amount: 1 })
        cart = [...cart, { ...cartItem, amount: 1 }]

        console.log(cart)


      })
    })
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
    return JSON.parse(localStorage.getItem('cart'))
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
    })
    .then(() => view.getCartButtons())

})





