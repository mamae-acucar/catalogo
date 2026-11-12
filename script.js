// 1. NÚMERO DO WHATSAPP (Troque pelo seu: DDI + DDD + Número)
const WHATSAPP_NUMBER = "5513991312486";

// 2. LISTA DE PRODUTOS (Edite os itens aqui)
const products = [
    {
        id: 1,
        name: "Bolo Red Velvet (fatia)",
        category: "bolos",
        price: 4.7,
        desc: "Massa aveludada vermelha com recheio cremoso de cream cheese e frutas vermelhas.",
        img: "images/bolo_velvet.jpg",
    },
    {
        id: 2,
        name: "Brigadeiros (100 un)",
        category: "doces",
        price: 100.0,
        desc: "Brigadeiros feitos com chocolate em sabores variados.",
        img: "https://unsplash.com",
    },
    {
        id: 3,
        name: "Torta de Limão Siciliano",
        category: "salgados",
        price: 65.0,
        desc: "Base crocante de biscoito, creme azedinho de limão e merengue suíço maçaricado.",
        img: "https://unsplash.com",
    },
    {
        id: 4,
        name: "Bolo Chocolatudo",
        category: "bolos",
        price: 90.0,
        desc: "Três camadas de massa de cacau 70% com muito brigadeiro cremoso.",
        img: "https://unsplash.com",
    },
];

let cart = [];

// Formata números para Real (R$)
function formatMoney(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Mostra os produtos na tela
function renderProducts(category = "todos") {
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = "";

    const filtered = category === "todos" ? products : products.filter((p) => p.category === category);

    filtered.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="product-img">
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-footer">
            <span class="product-price">${formatMoney(product.price)}</span>
            <button class="add-btn" onclick="addToCart(${product.id})">+ Adicionar</button>
          </div>
        </div>
      `;
        catalog.appendChild(card);
    });
}

// Filtra por categoria ao clicar nos botões
function filterProducts(category, btn) {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(category);
}

// Adiciona item ao carrinho
function addToCart(productId) {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
        existingItem.qty++;
    } else {
        const product = products.find((p) => p.id === productId);
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

// Aumenta ou diminui quantidade no modal
function changeQty(productId, delta) {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter((i) => i.id !== productId);
    }
    updateCartUI();
    renderModalItems();
}

// Atualiza barra inferior e totais
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    document.getElementById("cart-count").innerText = `${totalItems} ${totalItems === 1 ? "item" : "itens"}`;
    document.getElementById("cart-total").innerText = formatMoney(totalPrice);
    document.getElementById("modal-total").innerText = formatMoney(totalPrice);

    const openBtn = document.getElementById("open-cart-btn");
    openBtn.disabled = totalItems === 0;
    if (totalItems === 0) closeModal();
}

// Abre janela do pedido
function openModal() {
    renderModalItems();
    document.getElementById("cart-modal").style.display = "flex";
}

// Fecha janela do pedido
function closeModal() {
    document.getElementById("cart-modal").style.display = "none";
}

// Lista os itens dentro do modal
function renderModalItems() {
    const list = document.getElementById("cart-items-list");
    list.innerHTML = "";

    cart.forEach((item) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small>${formatMoney(item.price * item.qty)}</small>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span style="margin: 0 8px;">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      `;
        list.appendChild(div);
    });
}

// Gera o link e abre o WhatsApp
function sendWhatsApp() {
    if (cart.length === 0) return;

    let message = "Olá! Gostaria de fazer o seguinte pedido pelo catálogo:\n\n";
    let total = 0;

    cart.forEach((item) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `*${item.qty}x* ${item.name} - ${formatMoney(subtotal)}\n`;
    });

    message += `\n*Total: ${formatMoney(total)}*`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me{WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(url, "_blank");
}

// Inicia o catálogo ao abrir a página
renderProducts();
