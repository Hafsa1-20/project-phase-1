
const DB_URL = 'http://localhost:3000/menu_items';

class MenuManager {
    
    static async createMenuItem(menuItem) {
        try {
            const response = await fetch(`${DB_URL}/menu_items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuItem)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create menu item');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating menu item:', error);
            alert('Failed to add menu item. Please try again.');
        }
    }

    
    static async fetchMenuItems() {
        try {
            const response = await fetch(`${DB_URL}/menu_items`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching menu items:', error);
            return [];
        }
    }

    // UPDATE: Update existing menu item
    static async updateMenuItem(id, updatedItem) {
        try {
            const response = await fetch(`${DB_URL}/menu_items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update menu item');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating menu item:', error);
            alert('Failed to update menu item. Please try again.');
        }
    }

    
    static async deleteMenuItem(id) {
        try {
            const response = await fetch(`${DB_URL}/menu_items/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete menu item');
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert('Failed to delete menu item. Please try again.');
        }
    }

    
    static async renderMenuItems() {
        const menuList = document.getElementById('menu-items-list');
        menuList.innerHTML = ''; 

        try {
            const menuItems = await this.fetchMenuItems();
            
            menuItems.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div class="menu-item">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <p>Price: KSh ${item.price}</p>
                        <div class="menu-item-actions">
                            <button class="edit-btn" data-id="${item.id}">Edit</button>
                            <button class="delete-btn" data-id="${item.id}">Delete</button>
                        </div>
                    </div>
                `;
                menuList.appendChild(listItem);
            });

            
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', this.handleEditMenuItem.bind(this));
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', this.handleDeleteMenuItem.bind(this));
            });
        } catch (error) {
            console.error('Error rendering menu items:', error);
        }
    }

    
    static async handleEditMenuItem(event) {
        const itemId = event.target.dataset.id;
        const newName = prompt('Enter new name for the menu item:');
        const newPrice = prompt('Enter new price for the menu item:');

        if (newName && newPrice) {
            try {
                const menuItems = await this.fetchMenuItems();
                const itemToUpdate = menuItems.find(item => item.id === parseInt(itemId));

                if (itemToUpdate) {
                    const updatedItem = {
                        ...itemToUpdate,
                        name: newName,
                        price: parseFloat(newPrice)
                    };

                    await this.updateMenuItem(itemId, updatedItem);
                    await this.renderMenuItems();
                }
            } catch (error) {
                console.error('Error editing menu item:', error);
            }
        }
    }

    
    static async handleDeleteMenuItem(event) {
        const itemId = event.target.dataset.id;
        const confirmDelete = confirm('Are you sure you want to delete this menu item?');

        if (confirmDelete) {
            try {
                await this.deleteMenuItem(itemId);
                await this.renderMenuItems();
            } catch (error) {
                console.error('Error deleting menu item:', error);
            }
        }
    }
}


class ContactManager {
    
    static async submitContactForm(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        try {
            const response = await fetch(`${DB_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                alert('Message sent successfully!');
                event.target.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Failed to send message. Please try again.');
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    MenuManager.renderMenuItems();

    
    const addMenuItemForm = document.getElementById('add-menu-item-form');
    if (addMenuItemForm) {
        addMenuItemForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('new-item-name').value;
            const description = document.getElementById('new-item-description').value;
            const price = parseFloat(document.getElementById('new-item-price').value);

            const newMenuItem = {
                name,
                description,
                price,
                category: 'Fast Foods' 
            };

            await MenuManager.createMenuItem(newMenuItem);
            await MenuManager.renderMenuItems();
            addMenuItemForm.reset();
        });
    }

    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', ContactManager.submitContactForm);
    }
});