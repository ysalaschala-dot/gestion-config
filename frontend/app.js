let token = null;

const API_BASE = 'http://localhost:3000';

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const msgDiv = document.getElementById('loginMsg');

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    msgDiv.textContent = data.message;

    if (res.ok) {
      token = data.token;
      sessionStorage.setItem('token', token);
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('appSection').style.display = 'block';
      loadLotes();
      loadRecepciones();
    }
  } catch (err) {
    msgDiv.textContent = 'Error de conexión: ' + err.message;
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  token = null;
  sessionStorage.removeItem('token');
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('appSection').style.display = 'none';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
});

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Load lotes
async function loadLotes() {
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/api/lotes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const lotes = await res.json();
    const list = document.getElementById('lotesList');
    const select = document.getElementById('loteId');
    
    list.innerHTML = '';
    select.innerHTML = '<option value="">Seleccionar lote...</option>';
    
    lotes.forEach(lote => {
      list.innerHTML += `<div class="item"><strong>${lote.codigo}</strong> - ${lote.estado} - ${lote.pesoNetoKg}kg</div>`;
      select.innerHTML += `<option value="${lote.id}">${lote.codigo}</option>`;
    });
  } catch (err) {
    console.error('Error al cargar lotes:', err);
  }
}

// Load recepciones
async function loadRecepciones() {
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/api/recepciones`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const recepciones = await res.json();
    const list = document.getElementById('recepcionesList');
    
    list.innerHTML = '';
    recepciones.forEach(r => {
      list.innerHTML += `<div class="item"><strong>${r.loteCodigo}</strong> - ${r.pesoNetoKg}kg - ${r.proceso}</div>`;
    });
  } catch (err) {
    console.error('Error al cargar recepciones:', err);
  }
}

// Register recepción
document.getElementById('recepcionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const loteId = document.getElementById('loteId').value;
  const pesoBrutoKg = parseFloat(document.getElementById('pesoBruto').value);
  const taraKg = parseFloat(document.getElementById('tara').value);
  const proceso = document.getElementById('proceso').value;
  const msgDiv = document.getElementById('recepcionMsg');

  try {
    const res = await fetch(`${API_BASE}/api/recepciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ loteId, pesoBrutoKg, taraKg, proceso })
    });
    const data = await res.json();
    msgDiv.textContent = data.message;

    if (res.ok) {
      document.getElementById('recepcionForm').reset();
      loadLotes();
      loadRecepciones();
    }
  } catch (err) {
    msgDiv.textContent = 'Error: ' + err.message;
  }
});

// Consultar lote
document.getElementById('consultaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const loteId = document.getElementById('consultaLoteId').value;
  const msgDiv = document.getElementById('consultaMsg');
  const resultDiv = document.getElementById('consultaResult');

  try {
    const res = await fetch(`${API_BASE}/api/recepciones/lote/${loteId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok) {
      msgDiv.textContent = 'Lote encontrado';
      resultDiv.innerHTML = `
        <h3>${data.lote.codigo}</h3>
        <p><strong>Estado:</strong> ${data.lote.estado}</p>
        <p><strong>Peso neto:</strong> ${data.lote.pesoNetoKg}kg</p>
        <p><strong>Tipo:</strong> ${data.lote.tipoBiomasa}</p>
        <h4>Recepciones:</h4>
        ${data.recepciones.map(r => `<div class="item">Peso: ${r.pesoNetoKg}kg - Proceso: ${r.proceso}</div>`).join('')}
        <h4>Trazabilidad:</h4>
        ${data.trazabilidad.map(t => `<div class="item">${t.evento} - ${t.descripcion}</div>`).join('')}
      `;
    } else {
      msgDiv.textContent = data.message;
      resultDiv.innerHTML = '';
    }
  } catch (err) {
    msgDiv.textContent = 'Error: ' + err.message;
  }
});

// Check token on load
window.addEventListener('load', () => {
  const savedToken = sessionStorage.getItem('token');
  if (savedToken) {
    token = savedToken;
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('appSection').style.display = 'block';
    loadLotes();
    loadRecepciones();
  }
});
