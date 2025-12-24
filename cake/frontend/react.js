// Load cakes on index.html
if (document.getElementById('cakes-list')) {
    fetch('http://localhost:3000/api/cakes')
        .then(res => res.json())
        .then(cakes => {
            const list = document.getElementById('cakes-list');
            cakes.forEach(cake => {
                list.innerHTML += `
                    <div class="cake-item">
                        <h3>${cake.name}</h3>
                        <p>${cake.description}</p>
                        <p>Price: $${cake.price}</p>
                    </div>
                `;
            });
        });
}

// Populate cake select on order.html
if (document.getElementById('cake-select')) {
    fetch('http://localhost:3000/api/cakes')
        .then(res => res.json())
        .then(cakes => {
            const select = document.getElementById('cake-select');
            cakes.forEach(cake => {
                select.innerHTML += `<option value="${cake.id}">${cake.name} - $${cake.price}</option>`;
            });
        });
}

// Handle order form submission
const form = document.getElementById('order-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const order = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            datetime: document.getElementById('datetime').value,
            instructions: document.getElementById('instructions').value,
            cakeId: document.getElementById('cake-select').value,
            payment: document.getElementById('payment').value
        };
        fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        })
        .then(res => res.text())
        .then(msg => alert(msg));
    });
}