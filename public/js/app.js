// Referencias al DOM
const form = document.getElementById('formGasto');
const tablaCuerpo = document.getElementById('tablaCuerpo');
const htmlElement = document.documentElement;
const btnTema = document.getElementById('btnTema');

// Alternar Modo Claro/Oscuro
btnTema.addEventListener('click', () => {
    const temaActual = htmlElement.getAttribute('data-bs-theme');
    if (temaActual === 'dark') {
        htmlElement.setAttribute('data-bs-theme', 'light');
        btnTema.innerText = '🌙 Modo Oscuro';
        btnTema.className = 'btn btn-outline-dark btn-sm';
    } else {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        btnTema.innerText = '☀️ Modo Claro';
        btnTema.className = 'btn btn-outline-light btn-sm';
    }
});

// Autocompletar fecha y hora actual
const ahora = new Date();
document.getElementById('fecha').value = ahora.toISOString().split('T')[0];
document.getElementById('hora').value = ahora.toTimeString().split(' ')[0].substring(0,5);

// Calcular y actualizar Dashboard
function actualizarDashboard(gastos) {
    const hoy = new Date().toISOString().split('T')[0];
    const d = new Date();
    const diaSemana = d.getDay() || 7; 
    d.setHours(-24 * (diaSemana - 1));
    const inicioSemana = d.toISOString().split('T')[0];
    const inicioMes = hoy.substring(0, 7) + '-01';

    let sumHoy = 0, sumSemana = 0, sumMes = 0;

    gastos.forEach(g => {
        const valor = g.tipo === 'Ingreso' ? g.monto : -g.monto;
        if(g.fecha === hoy) sumHoy += valor;
        if(g.fecha >= inicioSemana && g.fecha <= hoy) sumSemana += valor;
        if(g.fecha >= inicioMes && g.fecha <= hoy) sumMes += valor;
    });

    const pintar = (id, total) => {
        const el = document.getElementById(id);
        el.innerText = `S/ ${total.toFixed(2)}`;
        el.className = total >= 0 ? "mb-0 fw-bold texto-ingreso" : "mb-0 fw-bold text-danger";
    };

    pintar('balHoy', sumHoy);
    pintar('balSemana', sumSemana);
    pintar('balMes', sumMes);
}

// Leer registros (GET) y pintar la tabla
async function cargarGastos() {
    const res = await fetch('/api/gastos');
    const gastos = await res.json();
    
    actualizarDashboard(gastos);

    tablaCuerpo.innerHTML = '';
    gastos.forEach(g => {
        const enlace = g.comprobante ? `<a href="${g.comprobante}" target="_blank" class="badge bg-info text-dark text-decoration-none mt-1 d-inline-block">📄 Ver Voucher</a>` : '';
        
        tablaCuerpo.innerHTML += `
            <tr>
                <td style="font-size: 0.8rem;">${g.fecha}<br><span class="text-muted">${g.hora}</span></td>
                <td>
                    <span class="fw-bold">${g.concepto}</span><br>
                    <span class="text-muted" style="font-size: 0.85rem;">${g.descripcion}</span>
                </td>
                <td style="font-size: 0.85rem;">
                    <span class="badge text-bg-secondary">${g.metodo}</span><br>${enlace}
                </td>
                <td class="${g.tipo === 'Ingreso' ? 'texto-ingreso' : 'text-danger'} fw-bold" style="white-space: nowrap;">
                    ${g.tipo === 'Ingreso' ? '+' : '-'} S/ ${g.monto.toFixed(2)}
                </td>
                <td><button class="btn btn-sm btn-outline-danger" onclick="borrarGasto(${g.id})">X</button></td>
            </tr>
        `;
    });
}

// Crear registro (POST)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const metodo = document.getElementById('metodo').value;
    const archivoInput = document.getElementById('archivo');
    const archivo = archivoInput.files[0];

    // Validaciones de archivo
    if (archivo) {
        const sizeMB = archivo.size / (1024 * 1024);
        const tipo = archivo.type;
        
        if (sizeMB > 5) {
            alert("❌ El archivo supera los 5 MB permitidos.");
            return; 
        }
        if (tipo !== "image/png" && tipo !== "application/pdf") {
            alert("❌ Formato no válido. Solo se permite PNG o PDF.");
            return; 
        }
    }

    // Validación lógica
    if (metodo !== 'Efectivo' && !archivo) {
        const confirmar = confirm("⚠️ Movimiento bancario sin comprobante.\n\n¿Seguro que deseas guardar este registro sin adjuntar el archivo?");
        if(!confirmar) return;
    }

    const formData = new FormData();
    formData.append('concepto', document.getElementById('concepto').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('monto', document.getElementById('monto').value);
    formData.append('fecha', document.getElementById('fecha').value);
    formData.append('hora', document.getElementById('hora').value);
    formData.append('tipo', document.getElementById('tipo').value);
    formData.append('metodo', metodo);
    
    if (archivo) {
        formData.append('archivo', archivo);
    }

    await fetch('/api/gastos', {
        method: 'POST',
        body: formData
    });

    // Limpiar formulario tras guardar
    document.getElementById('concepto').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('monto').value = '';
    archivoInput.value = ''; 
    cargarGastos();
});

// Borrar registro (DELETE)
async function borrarGasto(id) {
    if(confirm("¿Borrar permanentemente?")) {
        await fetch(`/api/gastos/${id}`, { method: 'DELETE' });
        cargarGastos();
    }
}

// Ejecución inicial al abrir la página
cargarGastos();

// Actualizar automáticamente cada 3 segundos (3000 milisegundos)
setInterval(cargarGastos, 3000);