// Advanced Shopping Cart functionality with localStorage persistence
document.addEventListener('DOMContentLoaded', function() {
    // Initialize global cart object
    window.cart = {
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        
        addItem: function(productData) {
            // Find if item already exists
            const existingItemIndex = this.items.findIndex(item => 
                item.name === productData.name && 
                JSON.stringify(item.extras) === JSON.stringify(productData.extras)
            );
            
            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                this.items[existingItemIndex].quantity += productData.quantity;
                this.items[existingItemIndex].price += productData.price;
            } else {
                // Add new item
                this.items.push(productData);
            }
            
            this.saveToStorage();
            this.updateCartDisplay();
        },
        
        removeItem: function(index) {
            this.items.splice(index, 1);
            this.saveToStorage();
            this.updateCartDisplay();
        },
        
        clearCart: function() {
            this.items = [];
            this.saveToStorage();
            this.updateCartDisplay();
        },
        
        getTotalPrice: function() {
            return this.items.reduce((total, item) => total + item.price, 0);
        },
        
        saveToStorage: function() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },
        
        updateCartDisplay: function() {
            const cartContainer = document.getElementById('cart-items');
            const totalElement = document.getElementById('total-price');
            const submitButton = document.getElementById('submit-order');
            
            if (cartContainer) {
                cartContainer.innerHTML = '';
                
                if (this.items.length === 0) {
                    cartContainer.innerHTML = `
                        <div class="text-center text-muted py-4">
                            <i class="bi bi-cart3 fs-1"></i>
                            <p class="mt-2">Ihr Warenkorb ist leer</p>
                            <small>Wählen Sie Produkte aus, um sie hier zu sehen</small>
                        </div>
                    `;
                } else {
                    this.items.forEach((item, index) => {
                        const itemElement = document.createElement('div');
                        itemElement.className = 'cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded bg-white';
                        
                        let extrasText = '';
                        if (item.extras && item.extras.length > 0) {
                            extrasText = `<br><small class="text-muted">Extras: ${item.extras.join(', ')}</small>`;
                        }
                        
                        itemElement.innerHTML = `
                            <div class="flex-grow-1">
                                <strong>${item.name}</strong>${extrasText}
                                <br><small class="text-success">Menge: ${item.quantity}</small>
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="me-3 fw-bold">${item.price.toFixed(2)} €</span>
                                <button class="btn btn-sm btn-outline-danger" onclick="window.cart.removeItem(${index})" title="Entfernen">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        `;
                        
                        cartContainer.appendChild(itemElement);
                    });
                }
            }
            
            if (totalElement) {
                totalElement.textContent = this.getTotalPrice().toFixed(2) + ' €';
            }
            
            // Enable/disable submit button based on cart content and form validity
            if (submitButton) {
                const isCartEmpty = this.items.length === 0;
                const isFormValid = this.validateForm();
                submitButton.disabled = isCartEmpty || !isFormValid;
            }
            
            // Update cart badge if exists
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
                cartBadge.textContent = itemCount;
                cartBadge.style.display = itemCount > 0 ? 'inline' : 'none';
            }
        },
        
        validateForm: function() {
            const customerName = document.getElementById('customerName');
            const customerEmail = document.getElementById('customerEmail');
            const customerPhone = document.getElementById('customerPhone');
            const deliveryAddress = document.getElementById('deliveryAddress');
            
            if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
                return false;
            }
            
            return customerName.value.trim() !== '' &&
                   customerEmail.value.trim() !== '' &&
                   customerPhone.value.trim() !== '' &&
                   deliveryAddress.value.trim() !== '';
        }
    };
    
    // Enhanced addToCart function
    window.addToCart = function(button) {
        const product = button.getAttribute('data-product');
        const basePrice = parseFloat(button.getAttribute('data-price'));
        const quantityId = button.getAttribute('data-quantity-id');
        const extrasGroup = button.getAttribute('data-extras-group');
        
        // Get quantity
        const quantityInput = document.getElementById(quantityId);
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        
        // Calculate price with extras
        let unitPrice = basePrice;
        const selectedExtras = [];
        
        if (extrasGroup) {
            const extrasSection = document.getElementById(extrasGroup + '-extras');
            if (extrasSection) {
                const checkboxes = extrasSection.querySelectorAll('input[type="checkbox"]:checked');
                checkboxes.forEach(checkbox => {
                    const extraPrice = parseFloat(checkbox.value) || 0;
                    unitPrice += extraPrice;
                    const label = checkbox.nextElementSibling;
                    if (label) {
                        selectedExtras.push(label.textContent.trim());
                    }
                });
            }
        }
        
        // Add to cart
        window.cart.addItem({
            name: product,
            price: unitPrice * quantity,
            quantity: quantity,
            extras: selectedExtras
        });
        
        // Show success message
        alert(`${product} wurde zum Einkaufswagen hinzugefügt!`);
    };
    
    // Initialize cart display
    window.cart.updateCartDisplay();
    
    // Handle cart interactions
    document.addEventListener('click', function(event) {
        // Add to cart buttons
        if (event.target.closest('.add-to-cart-btn')) {
            const button = event.target.closest('.add-to-cart-btn');
            window.addToCart(button);
        }
        
        // Clear cart button
        if (event.target.closest('#clearCart')) {
            if (confirm('Möchten Sie den Warenkorb wirklich leeren?')) {
                window.cart.clearCart();
            }
        }
        
        // Submit order button
        if (event.target.closest('#submit-order')) {
            if (window.cart.items.length === 0) {
                alert('Ihr Warenkorb ist leer. Bitte fügen Sie Produkte hinzu.');
                return;
            }
            
            if (!window.cart.validateForm()) {
                alert('Bitte füllen Sie alle Pflichtfelder aus.');
                return;
            }
            
            // Get customer data
            const customerName = document.getElementById('customerName').value;
            const customerEmail = document.getElementById('customerEmail').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const deliveryAddress = document.getElementById('deliveryAddress').value;
            const orderNotes = document.getElementById('orderNotes')?.value || '';
            
            // Convert cart items to the format expected by confirmation page
            const orderedPizzasData = window.cart.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                extras: item.extras || []
            }));
            
            // Save order data to localStorage (compatible with existing confirmation page)
            localStorage.setItem('customerName', customerName);
            localStorage.setItem('customerEmail', customerEmail);
            localStorage.setItem('customerPhone', customerPhone);
            localStorage.setItem('deliveryAddress', deliveryAddress);
            localStorage.setItem('orderNotes', orderNotes);
            localStorage.setItem('orderedPizzas', JSON.stringify(orderedPizzasData));
            localStorage.setItem('totalPrice', window.cart.getTotalPrice().toFixed(2));
            
            console.log('Order data saved:', {
                customer: customerName,
                items: orderedPizzasData,
                total: window.cart.getTotalPrice().toFixed(2)
            });
            
            // Clear cart after successful order
            window.cart.clearCart();
            
            // Redirect to confirmation page
            window.location.href = 'confirmation.html';
        }
    });
    
    // Form validation on input
    document.addEventListener('input', function(event) {
        if (event.target.closest('#customer-form')) {
            window.cart.updateCartDisplay(); // Update submit button state
        }
    });
});
