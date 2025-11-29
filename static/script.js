//to store cart data
let cart = {};

//string to JSON
const productsData = JSON.parse(rawProductData.replace(/&quot;/g,'"'));
//product map by ID
const productMap = productsData.reduce((acc, p) => ({...acc, [p.id]: p}), {});

window.menuContent = '';

//list for orders
let Orders = [];

//function HTML for order summary
function getOrdersHtml() {
    let tableRows = '';
    // sorts order by ID
    const sortedOrders = [...Orders].sort((a, b) => b.id - a.id);
    // loops and formats row
    sortedOrders.forEach(order => {
        const itemsDisplay = order.items_list.join('<br>');
        tableRows += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2e4b36]">#${order.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.items_count}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${itemsDisplay}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">₱${order.total.toFixed(2)}</td>
            </tr>
        `;
    });

    // returns full HTML table
    return `
        <h2 class="text-3xl font-bold mb-6 text-gray-700 border-b pb-3 flex-shrink-0">
            Order Summary
        </h2>
        <div class="overflow-y-auto flex-grow min-h-0">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items List</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody class="bg-[#f7f7f5] divide-y divide-gray-200">
                    ${tableRows}
                </tbody>
            </table>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
            <p class="text-sm text-gray-500">Displaying recent orders (${Orders.length})</p>
        </div>
    `;
}

// function when switching view between Menu and Orders
function switchView(viewName) {
    const mainContentArea = document.getElementById('main-content-area');
    const navMenu = document.getElementById('nav-menu');
    const navOrders = document.getElementById('nav-orders');

    const inactiveClasses = ['text-gray-500', 'hover:bg-gray-100', 'hover:text-[#2e4b36]'];
    const activeClass = 'active-nav-link';

    [navMenu, navOrders].forEach(link => {
        link.classList.remove(activeClass);
        link.classList.add(...inactiveClasses);
    });

    // shows menu view
    if (viewName === 'menu') {
        mainContentArea.innerHTML = window.menuContent;
        navMenu.classList.add(activeClass);
        navMenu.classList.remove(...inactiveClasses);
        filterProducts('all');
    //shows orders view
    } else if (viewName === 'orders') {
        mainContentArea.innerHTML = getOrdersHtml();
        navOrders.classList.add(activeClass);
        navOrders.classList.remove(...inactiveClasses);
    }
}

//checkout and computation of total from backend
async function handleCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Processing...';

    const grandTotal = parseFloat(document.getElementById('total-display').textContent.replace('₱', ''));

    try {
        // sends cart data to Flask
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart)
        });
        // error response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // total number of items purchased
            const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
            // list of purhcased items
            const detailedItems = Object.keys(cart).map(id => {
                const product = productMap[id];
                return `${cart[id]}x ${product ? product.name : 'Unknown Item'}`;
            });
            // order id
            const lastId = Orders.length > 0 ? Math.max(...Orders.map(o => o.id)) : 1000;
            const newOrderId = lastId + 1;
            // creates order object
            const newOrder = {
                'id': newOrderId,
                'total': grandTotal,
                'items_count': totalItems,
                'items_list': detailedItems,
            };

            Orders.push(newOrder);
            showStatusModal(true, grandTotal.toFixed(2));
        } else {
            showStatusModal(false, result.error || 'Unknown calculation error.');
        }

    } catch (error) {
        console.error('Checkout error:', error);
        showStatusModal(false, 'Failed to connect to the server.');
    } finally {
        if (Object.keys(cart).length > 0) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'CHECKOUT';
        }
    }
}

//shows checkout status modal
function showStatusModal(success, message) {
    const modal = document.getElementById('status-message');
    const modalTitle = document.getElementById('modal-title');
    const modalTotalDisplay = document.getElementById('modal-total-display');
    const newOrderButton = modal.querySelector('button');

    //if checkout successful
    if (success) {
        modalTitle.textContent = 'Checkout Successful!';
        modalTitle.classList.remove('text-red-600');
        modalTitle.classList.add('text-green-600');
        document.getElementById('modal-total-display').textContent = `₱${message}`;
        modalTotalDisplay.classList.remove('hidden');
        newOrderButton.textContent = 'New Order';

        clearCart();       // clears cart after successful checkout

        // refresh orders view
        if (document.getElementById('main-content-area').querySelector('h2').textContent.includes('Order Summary')) {
            switchView('orders');
        }

    } else {
        // if checkout failed
        modalTitle.textContent = 'Transaction Failed';
        modalTitle.classList.remove('text-green-600');
        modalTitle.classList.add('text-red-600');
        document.getElementById('modal-total-display').textContent = message;
        modalTotalDisplay.classList.add('hidden');
        newOrderButton.textContent = 'Dismiss Error';
    }
    // shows modal
    modal.classList.remove('hidden');
}

//updates cart display and totals
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const itemCountDisplay = document.getElementById('item-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const scPwdDiscountCheckbox = document.getElementById('sc-pwd-discount');

    cartItemsContainer.innerHTML = '';

    let rawSubtotal = 0.00;
    let totalItems = 0;

    const emptyCartHtml = '<p id="empty-cart-message" class="text-gray-500 italic">Cart is empty. Add some products!</p>';
    const itemIDs = Object.keys(cart);

    // if cart is empty
    if (itemIDs.length === 0) {
        cartItemsContainer.innerHTML = emptyCartHtml;
        checkoutBtn.disabled = true;
        document.getElementById('subtotal-display').textContent = '₱0.00';
        document.getElementById('discount-display').textContent = '- ₱0.00';
        document.getElementById('total-display').textContent = '₱0.00';
        itemCountDisplay.textContent = '0 items';

        if (scPwdDiscountCheckbox) scPwdDiscountCheckbox.checked = false;
        return;
    }

    checkoutBtn.disabled = false;

    // categories
    const categories = ['Drinks', 'Starters', 'Main', 'Dessert'];
    const groupedCart = {};

    // item group sorting in cart
    itemIDs.forEach(id => {
        const product = productMap[id];
        const quantity = cart[id];
        if (product) {
            const category = product.category;
            if (!groupedCart[category]) groupedCart[category] = [];
            groupedCart[category].push({ id, quantity, product });
            rawSubtotal += product.price * quantity;
            totalItems += quantity;
        }
    });

    itemCountDisplay.textContent = `${totalItems} items`;

    // SC and PWD discount valuess and calculation
    const discountRate = scPwdDiscountCheckbox && scPwdDiscountCheckbox.checked ? 0.20 : 0.00;
    const discountAmount = rawSubtotal * discountRate;
    const grandTotal = rawSubtotal - discountAmount;

    //creates item under each category
    categories.forEach(category => {
        const items = groupedCart[category];

        //category header if cart has items
        if (items && items.length > 0) {
            const headerElement = document.createElement('h4');
            headerElement.className = 'text-base font-bold text-[#2e4b36] mt-3 border-b border-[#2e4b36]/20 pb-1';
            headerElement.textContent = category;
            cartItemsContainer.appendChild(headerElement);

            // renders each item
            items.forEach(({ id, quantity, product }) => {
                // gets price and compute line total
                const price = product.price;
                const lineTotal = price * quantity;

                //main item conatiner
                const itemElement = document.createElement('div');
                itemElement.className = 'flex justify-between items-center text-sm border-b border-gray-100 py-1';

                // item in HTML
                itemElement.innerHTML = `
                    <div class="flex-1 min-w-0 pr-2">
                        <p class="font-medium text-gray-800 truncate">${product.name}</p>
                        <p class="text-xs text-gray-500">₱${price.toFixed(2)}</p>
                    </div>

                    <div class="flex items-center space-x-2 ml-2">
                        <button onclick="decrementQuantity('${id}')"
                                class="bg-gray-200 text-gray-700 hover:bg-gray-300 w-6 h-6 rounded flex items-center justify-center text-base font-bold">
                            -
                        </button>
                        <input type="number"
                                id="qty-input-${id}"
                                value="${quantity}"
                                min="1"
                                class="w-12 text-center border rounded p-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2e4b36]"
                                onchange="updateQuantityFromInput('${id}', this.value)"
                                oninput="this.value = Math.max(1, this.value || 1)"
                        >
                        <button onclick="incrementQuantity('${id}')"
                                class="bg-[#2e4b36] text-white hover:bg-[#2e4b36] w-6 h-6 rounded flex items-center justify-center text-base font-bold">
                            +
                        </button>
                    </div>

                    <div class="w-16 text-right ml-4">
                        <span class="font-bold text-gray-900">₱${lineTotal.toFixed(2)}</span>
                    </div>
                `;

                // adds item to the cart container
                cartItemsContainer.appendChild(itemElement);
            });
        }
    });

    //display results
    document.getElementById('subtotal-display').textContent = `₱${rawSubtotal.toFixed(2)}`;
    document.getElementById('discount-display').textContent = `- ₱${discountAmount.toFixed(2)}`;

    document.getElementById('total-display').textContent = `₱${grandTotal.toFixed(2)}`;
}

// add item to cart
function addItemToCart(id) {
    if (document.getElementById('product-list')) {
        cart[id] = (cart[id] || 0) + 1;
        renderCart();
    }
}

// quantity updates
function updateQuantityFromInput(id, value) {
    let newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
    cart[id] = newQuantity;
    renderCart();
}

//increment quantity
function incrementQuantity(id) {
    if (cart[id]) {
        cart[id] += 1;
        renderCart();
    }
}

//decrements quantity
function decrementQuantity(id) {
    if (cart[id] && cart[id] > 1) {
        cart[id] -= 1;
    } else {
        delete cart[id];
    }
    renderCart();
}

// clears cart
function clearCart() {
    cart = {};
    renderCart();
}

// hide modal after checkout
function closeStatusModal() {
    document.getElementById('status-message').classList.add('hidden');
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.textContent = 'CHECKOUT';
    checkoutBtn.disabled = (Object.keys(cart).length === 0);
}

//filters product by category
function filterProducts(category) {
    const categoryButtons = document.querySelectorAll('.category-btn');
    if (categoryButtons.length === 0) return;

    const productCards = document.querySelectorAll('.product-card');

    categoryButtons.forEach(btn => {
        //category button styles
        const isSelected = btn.getAttribute('data-category') === category;
        if (isSelected) {
            btn.classList.add('bg-[#2e4b36]', 'text-white');
            btn.classList.remove('bg-gray-200', 'text-gray-700');
        } else {
            btn.classList.remove('bg-[#2e4b36]', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        }
    });

    //show/hide items based on selected category
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}