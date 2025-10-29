// static/js/chat.js
document.addEventListener("DOMContentLoaded", () => {
  // --- Elementos de la vista ---
  const messagesDiv = document.getElementById("messages");
  const input = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  
  const roomName = messagesDiv?.dataset?.roomName;

  if (!messagesDiv || !roomName) {
    console.error("Faltan elementos o data-room-name en el template.");
    return;
  }

  
  let currentUser = sessionStorage.getItem("chat_name");
  if (!currentUser) {
    const fromTemplate = messagesDiv?.dataset?.user;
    const n = fromTemplate || prompt("Ross") || "Ross";
    currentUser = (n || "").trim() || "Ross";
    sessionStorage.setItem("chat_name", currentUser);
  }

  // ---------- Utilidades ----------
  function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Si tu endpoint POST exige CSRF, toma el token de la cookie
  function getCookie(name) {
    const cookieStr = document.cookie || "";
    return cookieStr
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  }
  const csrftoken = getCookie("csrftoken");

  // Minimísimo escape para evitar inyectar HTML
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  
  function drawMessage(msg) {
    // Historial: {timestamp, sender, text}
    // WS:        {user, message}
    const ts =
      msg.timestamp ||
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const sender = msg.sender || msg.user || "Alguien";
    const text = msg.text || msg.message || "";

    const line = document.createElement("div");
    line.classList.add("message-line");
    line.innerHTML = `
      <span class="timestamp">${ts}</span>
      <span class="sender">${escapeHtml(sender)}:</span>
      <span class="text">${escapeHtml(text)}</span>
    `;
    messagesDiv.appendChild(line);
  }

  
  async function loadHistory() {
    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(roomName)}/`);
      if (!res.ok) {
        console.error("Error historial:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      messagesDiv.innerHTML = "";
      (data.messages || []).forEach(drawMessage);
      scrollToBottom();
    } catch (e) {
      console.error("Error cargando historial:", e);
    }
  }

  // ---------- 2) WebSocket (tiempo real) ----------
  let chatSocket = null;
  let reconnectTimer = null;

  function connectWS() {
    const scheme = location.protocol === "https:" ? "wss" : "ws";
    chatSocket = new WebSocket(
      `${scheme}://${location.host}/ws/chat/${encodeURIComponent(roomName)}/`
    );

    chatSocket.onopen = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      console.log("WS conectado");
    };

    chatSocket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        drawMessage(data);
        scrollToBottom();
      } catch (err) {
        console.error("Mensaje WS inválido:", err);
      }
    };

    chatSocket.onerror = (e) => {
      console.warn("WS error:", e);
    };

    chatSocket.onclose = () => {
      console.warn("WS cerrado. Reintentando en 2s…");
      reconnectTimer = setTimeout(connectWS, 2000);
    };
  }

  // ---------- 3) Enviar: WS (tiempo real) + POST (persistencia) ----------
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    const wsPayload = { user: currentUser, message: text };

    // a) Tiempo real
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(JSON.stringify(wsPayload));
    } else {
      console.warn("WS no abierto; se enviará solo por HTTP.");
    }

    // b) Guardar en BD (mantiene compatibilidad con tu API)
    try {
      await fetch(`/api/send/${encodeURIComponent(roomName)}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrftoken ? { "X-CSRFToken": csrftoken } : {}),
        },
        body: JSON.stringify({ text, sender: currentUser }),
      });
    } catch (e) {
      console.error("Error guardando por API:", e);
    }

    input.value = "";
    input.focus();
  }

  // ---------- 4) Eventos de UI ----------
  sendBtn?.addEventListener("click", sendMessage);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // ---------- 5) Arranque ----------
  loadHistory();
  connectWS();

  
  window.changeName = function () {
    sessionStorage.removeItem("chat_name");
    const n = prompt("Nuevo nombre:") || "Anónimo";
    const u = (n || "").trim() || "Anónimo";
    sessionStorage.setItem("chat_name", u);
    alert(`Nombre actualizado a: ${u}`);
  };
});
