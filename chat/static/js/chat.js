document.addEventListener("DOMContentLoaded", () => {
    const messagesDiv = document.getElementById("messages");
    const roomName = messagesDiv.dataset.roomName;  // <- viene del data-room-name en el HTML
    const input = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    if (!roomName) {
        console.error("No se pudo obtener roomName desde el template.");
        return;
    }

    // Cargar historial de mensajes desde el endpoint Django
    async function loadHistory() {
        try {
            const response = await fetch(`/api/messages/${roomName}/`);
            if (!response.ok) {
                console.error("Error al pedir historial:", response.status);
                return;
            }

            const data = await response.json();
            messagesDiv.innerHTML = "";

            data.messages.forEach(msg => {
                const line = document.createElement("div");
                line.classList.add("message-line");
                line.innerHTML = `
                    <span class="timestamp">${msg.timestamp}</span>
                    <span class="sender">${msg.sender}:</span>
                    <span class="text">${msg.text}</span>
                `;
                messagesDiv.appendChild(line);
            });

            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } catch (err) {
            console.error("Error cargando historial:", err);
        }
    }

    loadHistory();

    // Por ahora el botón solo limpia el input y loguea.
    sendBtn.onclick = async function () {
        const text = input.value.trim();
        if (text === "") {
            return;
        }

        // 1. mandar al backend
        try {
            const response = await fetch(`/api/send/${roomName}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                console.error("Error al enviar mensaje:", response.status);
                return;
            }

            const saved = await response.json();

            // 2. agregar al chat visualmente
            const line = document.createElement("div");
            line.classList.add("message-line");
            line.innerHTML = `
                <span class="timestamp">${saved.timestamp}</span>
                <span class="sender">${saved.sender}:</span>
                <span class="text">${saved.text}</span>
            `;
            messagesDiv.appendChild(line);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // 3. limpiar input
            input.value = "";
            input.focus();
        } catch (err) {
            console.error("Fallo al enviar mensaje:", err);
        }
    };
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            sendBtn.click();
        }
    });

});
