let currentEditId = null;
let editModal = null;

if (document.getElementById('editModal')) {
    editModal = new bootstrap.Modal(document.getElementById('editModal'));
}

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

if (document.getElementById('carForm')) {
    document.getElementById('carForm').addEventListener('submit', handleCarSubmit);

    if (document.getElementById('saveEditBtn')) {
        document.getElementById('saveEditBtn').addEventListener('click', handleCarUpdate);
    }

    if (document.getElementById('usernameDisplay')) {
        document.getElementById('usernameDisplay').textContent = 'User';
    }

    loadCars();
}

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    if (!username || !password) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Please enter both username and password</div>';
        return;
    }

    try {
        messageDiv.innerHTML = '<div class="alert alert-info">Logging in...</div>';

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            const message = result.isNewUser ?
                'Account created successfully! Redirecting...' :
                'Login successful! Redirecting...';

            messageDiv.innerHTML = `<div class="alert alert-success">${message}</div>`;
            setTimeout(() => {
                window.location.href = '/app';
            }, 1000);
        } else {
            messageDiv.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
        }
    } catch (error) {
        console.error('Login error:', error);
        messageDiv.innerHTML = '<div class="alert alert-danger">Login failed. Please try again.</div>';
    }
}

async function loadCars() {
    try {
        const response = await fetch('/api/cars');

        if (!response.ok) {
            throw new Error('Failed to fetch cars');
        }

        const result = await response.json();

        if (result.success) {
            updateCarTable(result.data);
        } else {
            showAlert('Error loading cars: ' + result.message, 'danger');
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        showAlert('Error loading cars. Please try again.', 'danger');
    }
}

function updateCarTable(cars) {
    const tbody = document.querySelector('#carTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!cars || cars.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No cars found. Add your first car!</td></tr>';
        return;
    }

    cars.forEach(car => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(car.model)}</td>
            <td>${car.year}</td>
            <td>${car.mpg}</td>
            <td><span class="badge ${getEfficiencyBadgeClass(car.efficiency)}">${car.efficiency}</span></td>
            <td>${car.age} years</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editCar('${car._id}', '${escapeHtml(car.model)}', ${car.year}, ${car.mpg})">
                    Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCar('${car._id}')">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getEfficiencyBadgeClass(efficiency) {
    const classes = {
        'Poor': 'bg-danger',
        'Average': 'bg-warning',
        'Good': 'bg-info',
        'Excellent': 'bg-success'
    };
    return classes[efficiency] || 'bg-secondary';
}

async function handleCarSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const carData = {
        model: formData.get('model'),
        year: formData.get('year'),
        mpg: formData.get('mpg')
    };

    try {
        const response = await fetch('/api/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Car added successfully!', 'success');
            event.target.reset();
            updateCarTable(result.data);
        } else {
            showAlert('Error adding car: ' + result.message, 'danger');
        }
    } catch (error) {
        console.error('Error adding car:', error);
        showAlert('Error adding car. Please try again.', 'danger');
    }
}

function editCar(id, model, year, mpg) {
    currentEditId = id;
    document.getElementById('editId').value = id;
    document.getElementById('editModel').value = model;
    document.getElementById('editYear').value = year;
    document.getElementById('editMpg').value = mpg;

    if (editModal) {
        editModal.show();
    }
}

async function handleCarUpdate() {
    const carData = {
        model: document.getElementById('editModel').value,
        year: document.getElementById('editYear').value,
        mpg: document.getElementById('editMpg').value
    };

    try {
        const response = await fetch(`/api/cars/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Car updated successfully!', 'success');
            if (editModal) {
                editModal.hide();
            }
            updateCarTable(result.data);
        } else {
            showAlert('Error updating car: ' + result.message, 'danger');
        }
    } catch (error) {
        console.error('Error updating car:', error);
        showAlert('Error updating car. Please try again.', 'danger');
    }
}

async function deleteCar(id) {
    if (!confirm('Are you sure you want to delete this car?')) {
        return;
    }

    try {
        const response = await fetch(`/api/cars/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Car deleted successfully!', 'success');
            updateCarTable(result.data);
        } else {
            showAlert('Error deleting car: ' + result.message, 'danger');
        }
    } catch (error) {
        console.error('Error deleting car:', error);
        showAlert('Error deleting car. Please try again.', 'danger');
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

window.editCar = editCar;
window.deleteCar = deleteCar;