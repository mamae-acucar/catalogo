// 1. NÚMERO DO WHATSAPP (Troque pelo seu: DDI + DDD + Número)
const WHATSAPP_NUMBER = "5513991312486";

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
    const existingItem = cart.find((item) => String(item.id) === String(productId));
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
    const item = cart.find((i) => String(i.id) === String(productId));
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter((i) => String(i.id) !== String(productId));
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
          <button onclick="changeQty('${item.id}', -1)">-</button>
          <span style="margin: 0 8px;">${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1)">+</button>
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
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(url, "_blank", "noopener");
}

// ===== MONTE SEU BOLO =====
// Edite massas, recheios e preços aqui
// ===== MONTE SEU BOLO =====
const CAKE_BUILDER = {
    pricePerSlice: 4.7, // preço de cada fatia
    maxFillings: 2, // máximo de recheios por fatia
    maxSlices: 50,
    massas: [{ name: "Pão de ló" }, { name: "Massa de chocolate" }],
};

let builderSlices = 1;

function openBuilder() {
    builderSlices = 1;

    document.getElementById("builder-massas").innerHTML = CAKE_BUILDER.massas
        .map(
            (m, i) => `
        <label class="option">
          <input type="radio" name="massa" value="${i}" onchange="updateBuilder()">
          <span class="option-text"><strong>${m.name}</strong></span>
        </label>`,
        )
        .join("");

    document.getElementById("builder-recheios").innerHTML = fillings
        .map(
            (r, i) => `
        <label class="option">
          <input type="checkbox" name="recheio" value="${i}" onchange="updateBuilder()">
          <img src="${r.img}" alt="${r.name}" class="option-img">
          <span class="option-text"><strong>${r.name}</strong><small>${r.desc}</small></span>
        </label>`,
        )
        .join("");

    document.getElementById("builder-limit").innerText = `(até ${CAKE_BUILDER.maxFillings})`;
    updateBuilder();
    document.getElementById("builder-modal").style.display = "flex";
}

function closeBuilder() {
    document.getElementById("builder-modal").style.display = "none";
}

function changeSlices(delta) {
    builderSlices = Math.min(CAKE_BUILDER.maxSlices, Math.max(1, builderSlices + delta));
    updateBuilder();
}

function getBuilderSelection() {
    const massaInput = document.querySelector('input[name="massa"]:checked');
    const massa = massaInput ? CAKE_BUILDER.massas[massaInput.value] : null;
    const recheios = [...document.querySelectorAll('input[name="recheio"]:checked')].map((el) => fillings[el.value]);
    return { massa, recheios };
}

function updateBuilder() {
    const { massa, recheios } = getBuilderSelection();
    const reachedLimit = recheios.length >= CAKE_BUILDER.maxFillings;

    document.querySelectorAll('input[name="recheio"]').forEach((el) => {
        el.disabled = reachedLimit && !el.checked;
    });

    document.getElementById("builder-slices").innerText = builderSlices;
    document.getElementById("builder-price").innerText = formatMoney(CAKE_BUILDER.pricePerSlice * builderSlices);
    document.getElementById("builder-add-btn").disabled = !massa || recheios.length === 0;
}

// Cada fatia é um item de R$ 4,70; a quantidade de fatias vira a quantidade no carrinho
function addCustomCake() {
    const { massa, recheios } = getBuilderSelection();
    if (!massa || recheios.length === 0) return;

    const name = `Fatia de bolo: ${massa.name} + ${recheios.map((r) => r.name).join(" e ")}`;
    const existing = cart.find((item) => item.custom && item.name === name);

    if (existing) {
        existing.qty += builderSlices;
    } else {
        cart.push({
            id: `custom-${Date.now()}`,
            custom: true,
            name,
            price: CAKE_BUILDER.pricePerSlice,
            qty: builderSlices,
        });
    }

    updateCartUI();
    closeBuilder();
}

// Inicia o catálogo ao abrir a página
renderProducts();
