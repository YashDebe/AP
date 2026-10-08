const API_URL = "https://dummyjson.com/products";

let products = [];

// Fetch products from API
async function loadProducts() {

    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    loading.style.display = "block";
    error.innerText = "";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        products = data.products;

        displayProducts(products);
        loadCategories();

    } catch (err) {

        error.innerText = "Unable to load products. Please try again.";

        console.error(err);

    } finally {

        loading.style.display = "none";
    }
}


// Display products
function displayProducts(productList) {

    const container = document.getElementById("productContainer");

    container.innerHTML = "";

    if (productList.length === 0) {

        container.innerHTML = `
            <p>No products found.</p>
        `;

        return;
    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img 
                src="${product.thumbnail}" 
                alt="${product.title}"
            >

            <div class="product-info">

                <div class="product-title">
                    ${product.title}
                </div>

                <span class="category">
                    ${product.category}
                </span>

                <div class="price">
                    $${product.price}
                </div>

                <p class="description">
                    ${product.description.substring(0, 100)}...
                </p>

                <div class="rating">
                    ⭐ ${product.rating}
                </div>

            </div>
        `;

        container.appendChild(card);
    });
}


// Load categories
function loadCategories() {

    const select = document.getElementById("categoryFilter");

    const categories = [
        ...new Set(products.map(product => product.category))
    ];

    select.innerHTML = `
        <option value="all">All Categories</option>
    `;

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        select.appendChild(option);
    });
}


// Search
document.getElementById("searchInput").addEventListener("input", function () {

    const searchText = this.value.toLowerCase();

    const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText)
    );

    displayProducts(filtered);
});


// Category filter
document.getElementById("categoryFilter").addEventListener("change", function () {

    const category = this.value;

    if (category === "all") {

        displayProducts(products);

    } else {

        const filtered = products.filter(
            product => product.category === category
        );

        displayProducts(filtered);
    }
});


// Initial API call
loadProducts();