// JSON Server URL (ensure you have json-server installed)
const API_URL = `http://localhost:3000/menu_items`

// Menu Item CRUD Operations
class MenuManager {
    // CREATE: Add a new menu item
    static async createMenuItem(menuItem) {
        try {
            const response = await fetch(`${API_URL}/menu_items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuItem)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating menu item:', error);
        }
    }

    // READ: Get all menu items
    static async getAllMenuItems() {
        try {
            const response = await fetch(`${API_URL}/menu_items`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    }

    // READ: Get a single menu item by ID
    static async getMenuItemById(id) {
        try {
            const response = await fetch(`${API_URL}/menu_items/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching menu item ${id}:`, error);
        }
    }

    // UPDATE: Modify an existing menu item
    static async updateMenuItem(id, updatedItem) {
        try {
            const response = await fetch(`${API_URL}/menu_items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error updating menu item ${id}:`, error);
        }
    }

    // DELETE: Remove a menu item
    static async deleteMenuItem(id) {
        try {
            const response = await fetch(`${API_URL}/menu_items/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error(`Error deleting menu item ${id}:`, error);
        }
    }
}

// Order CRUD Operations
class OrderManager {
    // CREATE: Place a new order
    static async createOrder(orderDetails) {
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }

    // READ: Get all orders
    static async getAllOrders() {
        try {
            const response = await fetch(`${API_URL}/orders`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    // UPDATE: Update order status
    static async updateOrderStatus(id, status) {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            return await response.json();
        } catch (error) {
            console.error(`Error updating order ${id}:`, error);
        }
    }

    // DELETE: Cancel an order
    static async cancelOrder(id) {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error(`Error canceling order ${id}:`, error);
        }
    }
}

// Contact Form CRUD Operations
class ContactManager {
    // CREATE: Submit contact form
    static async submitContactForm(contactData) {
        try {
            const response = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error submitting contact form:', error);
        }
    }

    // READ: Get all contact submissions
    static async getAllContacts() {
        try {
            const response = await fetch(`${API_URL}/contacts`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    }

    // UPDATE: Update contact status
    static async updateContactStatus(id, status) {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            return await response.json();
        } catch (error) {
            console.error(`Error updating contact ${id}:`, error);
        }
    }
}

// DOM Event Listeners and Interactions
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    // Enhanced Contact Form Submission
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        try {
            await ContactManager.submitContactForm(formData);
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            alert('Error submitting your message. Please try again.');
        }
    });

    // Optional: Add Menu Management Section
    const menuManagementSection = document.createElement('section');
    menuManagementSection.id = 'menu-management';
    menuManagementSection.innerHTML = `
        <h2>Menu Management</h2>
        <div class="menu-management-form">
            <h3>Add/Edit Menu Item</h3>
            <form id="menu-item-form">
                <input type="hidden" id="menu-item-id">
                <div class="form-group">
                    <label for="menu-item-name">Name:</label>
                    <input type="text" id="menu-item-name" required>
                </div>
                <div class="form-group">
                    <label for="menu-item-description">Description:</label>
                    <textarea id="menu-item-description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="menu-item-price">Price (KSh):</label>
                    <input type="number" id="menu-item-price" required>
                </div>
                <button type="submit">Save Menu Item</button>
            </form>
            <div id="menu-list" class="menu-list"></div>
        </div>
    `;

    document.querySelector('main').appendChild(menuManagementSection);

    // Menu Item Form Submission
    const menuItemForm = document.getElementById('menu-item-form');
    menuItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const menuItemData = {
            name: document.getElementById('menu-item-name').value,
            description: document.getElementById('menu-item-description').value,
            price: parseFloat(document.getElementById('menu-item-price').value),
            category: 'Fast Foods',
            image: 'images/placeholder.jpg'
        };

        const menuItemId = document.getElementById('menu-item-id').value;

        try {
            if (menuItemId) {
                await MenuManager.updateMenuItem(menuItemId, menuItemData);
            } else {
                await MenuManager.createMenuItem(menuItemData);
            }
            
            menuItemForm.reset();
            loadMenuList();
        } catch (error) {
            alert('Error saving menu item');
        }
    });

    // Load and Display Menu List
    async function loadMenuList() {
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = '';
        
        const menuItems = await MenuManager.getAllMenuItems();
        
        menuItems.forEach(item => {
            const menuItemElement = document.createElement('div');
            menuItemElement.classList.add('menu-item-admin');
            menuItemElement.innerHTML = `
                <span>${item.name} - KSh ${item.price}</span>
                <div class="admin-actions">
                    <button onclick="editMenuItem(${item.id})">Edit</button>
                    <button onclick="deleteMenuItem(${item.id})">Delete</button>
                </div>
            `;
            menuList.appendChild(menuItemElement);
        });
    }

    // Edit Menu Item
    window.editMenuItem = async (id) => {
        const menuItem = await MenuManager.getMenuItemById(id);
        
        document.getElementById('menu-item-id').value = id;
        document.getElementById('menu-item-name').value = menuItem.name;
        document.getElementById('menu-item-description').value = menuItem.description;
        document.getElementById('menu-item-price').value = menuItem.price;
    };

    // Delete Menu Item
    window.deleteMenuItem = async (id) => {
        if (confirm('Are you sure you want to delete this menu item?')) {
            await MenuManager.deleteMenuItem(id);
            loadMenuList();
        }
    };

    // Initial load of menu list
    loadMenuList();
});git