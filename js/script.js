document.addEventListener('DOMContentLoaded', function() {
    // Logic for the order form page (e.g., index.html)
    const orderForm = document.querySelector('#order-form form'); 
    if (orderForm) {
        console.log('Order form script part loaded for index.html');
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            console.log('Order form submitted.');

            const customerName = document.getElementById('customerName').value;
            const deliveryAddress = document.getElementById('deliveryAddress').value;
            const customerPhone = document.getElementById('customerPhone').value;
            console.log('Customer Data:', { customerName, deliveryAddress, customerPhone });

            const pizzas = [
                { id: 'margheritaCheck', name: 'Pizza Margherita', quantityId: 'margheritaQuantity', price: 8.50, extras: [{id: 'margheritaExtraCheese', name: 'Extra Käse', price: 1.50}, {id: 'margheritaExtraGarlic', name: 'Extra Knoblauch-Soße', price: 0.75}, {id: 'margheritaExtraOlives', name: 'Oliven', price: 1.00}] },
                { id: 'pepperoniCheck', name: 'Pepperoni Pizza', quantityId: 'pepperoniQuantity', price: 9.50, extras: [{id: 'pepperoniExtraCheese', name: 'Extra Käse', price: 1.50}, {id: 'pepperoniExtraGarlic', name: 'Extra Knoblauch-Soße', price: 0.75}, {id: 'pepperoniExtraOlives', name: 'Oliven', price: 1.00}] },
                { id: 'vegetarianCheck', name: 'Hawaii Pizza', quantityId: 'vegetarianQuantity', price: 10.00, extras: [{id: 'hawaiiExtraCheese', name: 'Extra Käse', price: 1.50}, {id: 'hawaiiExtraGarlic', name: 'Extra Knoblauch-Soße', price: 0.75}, {id: 'hawaiiExtraOlives', name: 'Oliven', price: 1.00}] },
                { id: 'pilzeCheck', name: 'Pilz Pizza', quantityId: 'pilzeQuantity', price: 9.00, extras: [{id: 'pilzeExtraCheese', name: 'Extra Käse', price: 1.50}, {id: 'pilzeExtraGarlic', name: 'Extra Knoblauch-Soße', price: 0.75}, {id: 'pilzeExtraOlives', name: 'Oliven', price: 1.00}] }
            ];

            const orderedPizzasData = [];
            let totalPriceData = 0;

            pizzas.forEach(pizza => {
                const checkbox = document.getElementById(pizza.id);
                if (checkbox && checkbox.checked) { 
                    const quantityInput = document.getElementById(pizza.quantityId);
                    if (quantityInput) { 
                        const quantity = parseInt(quantityInput.value);
                        let pizzaPrice = pizza.price;
                        const selectedExtras = [];

                        pizza.extras.forEach(extra => {
                            const extraCheckbox = document.getElementById(extra.id);
                            if (extraCheckbox && extraCheckbox.checked) {
                                pizzaPrice += extra.price;
                                selectedExtras.push(extra.name);
                            }
                        });

                        orderedPizzasData.push({
                            name: pizza.name,
                            quantity: quantity,
                            price: pizzaPrice * quantity,
                            extras: selectedExtras
                        });
                        totalPriceData += pizzaPrice * quantity;
                    }
                }
            });
            console.log('Ordered Pizzas Data:', orderedPizzasData);
            console.log('Total Price Data:', totalPriceData);

            localStorage.setItem('customerName', customerName);
            localStorage.setItem('deliveryAddress', deliveryAddress);
            localStorage.setItem('customerPhone', customerPhone);
            localStorage.setItem('orderedPizzas', JSON.stringify(orderedPizzasData));
            localStorage.setItem('totalPrice', totalPriceData.toFixed(2));
            console.log('Data saved to localStorage.');

            window.location.href = 'confirmation.html';
        });
    }

    // Logic for the confirmation page (confirmation.html)
    const confirmationPageOrderedPizzasContainer = document.getElementById('orderedPizzas');
    if (confirmationPageOrderedPizzasContainer) {
        console.log('Confirmation page script part loaded.');
        const customerNameData = localStorage.getItem('customerName');
        const deliveryAddressData = localStorage.getItem('deliveryAddress');
        const customerPhoneData = localStorage.getItem('customerPhone');
        const orderedPizzasJSON = localStorage.getItem('orderedPizzas');
        const totalPriceFromStorage = localStorage.getItem('totalPrice');

        console.log('Data retrieved from localStorage:', {
            customerNameData,
            deliveryAddressData,
            customerPhoneData,
            orderedPizzasJSON,
            totalPriceFromStorage
        });

        const orderedPizzasFromStorage = orderedPizzasJSON ? JSON.parse(orderedPizzasJSON) : null;
        console.log('Parsed orderedPizzasFromStorage:', orderedPizzasFromStorage);

        const customerNameEl = document.getElementById('customerName');
        if (customerNameEl) customerNameEl.textContent = customerNameData || 'N/A';
        
        const deliveryAddressEl = document.getElementById('deliveryAddress');
        if (deliveryAddressEl) deliveryAddressEl.textContent = deliveryAddressData || 'N/A';
        
        const customerPhoneEl = document.getElementById('customerPhone');
        if (customerPhoneEl) customerPhoneEl.textContent = customerPhoneData || 'N/A';
        
        const totalPriceEl = document.getElementById('totalPrice');
        if (totalPriceEl) totalPriceEl.textContent = totalPriceFromStorage ? parseFloat(totalPriceFromStorage).toFixed(2) : '0.00';

        if (orderedPizzasFromStorage && orderedPizzasFromStorage.length > 0) {
            orderedPizzasFromStorage.forEach(pizza => {
                const pizzaElement = document.createElement('div');
                pizzaElement.classList.add('order-item');
                let extrasText = '';
                if (pizza.extras && pizza.extras.length > 0) {
                    extrasText = ` (Extras: ${pizza.extras.join(', ')})`;
                }
                pizzaElement.innerHTML = `<span>${pizza.name} (x${pizza.quantity})${extrasText}</span> <span>${parseFloat(pizza.price).toFixed(2)} €</span>`;
                confirmationPageOrderedPizzasContainer.appendChild(pizzaElement);
            });        } else {
            confirmationPageOrderedPizzasContainer.innerHTML = '<p>Keine Pizzen bestellt.</p>';
            console.log('No pizzas to display or orderedPizzasFromStorage is empty/null.');
        }
    }    // Pizza card toggle functionality
    window.toggleExtras = function(pizzaType, event) {
        // Prevent event bubbling to avoid conflicts
        if (event) {
            event.stopPropagation();
        }
        
        console.log('Toggling extras for:', pizzaType);
        const extrasSection = document.getElementById(pizzaType + '-extras');
        
        if (extrasSection) {
            const isCurrentlyVisible = extrasSection.style.display === 'block';
            
            // Hide all other extras sections first
            const allExtrasSections = document.querySelectorAll('.extras-section');
            allExtrasSections.forEach(section => {
                if (section.id !== pizzaType + '-extras') {
                    section.style.display = 'none';
                    section.classList.remove('showing');
                }
            });
            
            // Toggle current section
            if (isCurrentlyVisible) {
                extrasSection.style.display = 'none';
                extrasSection.classList.remove('showing');
            } else {
                extrasSection.style.display = 'block';
                extrasSection.classList.add('showing');
            }
        }
    };

    // Improved event delegation - close cards only when clicking outside the entire card
    document.addEventListener('click', function(event) {
        // Check if the click is inside any pizza card
        const pizzaCard = event.target.closest('.pizza-card');
        
        // If click is inside a card, don't close any cards
        if (pizzaCard) {
            return;
        }
        
        // If click is outside all cards, close all open extras sections
        const allExtrasSections = document.querySelectorAll('.extras-section');
        allExtrasSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('showing');
        });    });    // Cart functionality is handled by cart.js - no duplicate implementation needed
});