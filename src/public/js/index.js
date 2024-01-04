// esta declaración es para evitar error de doble definición de socket
if (typeof socket === 'undefined') {
    const socket = io();
}

