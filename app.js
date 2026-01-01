
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
    products.forEach((item) => {
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
}

// Storage products
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products))
  }
}


// Create objects after loading DOM
document.addEventListener('DOMContentLoaded', (e) => {
  const product = new Product()
  const view = new View()
  const storage = new Storage()

  const products = product.getProducts()
    .then(products => {
      view.displayProducts(products)
      Storage.saveProducts(products)
    })

})





