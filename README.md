# 💬 Django Local Chat — Mini Proyecto con Django Channels

## 📘 Descripción general

Este proyecto es un **mini chat local** desarrollado con **Django + Django Channels**, cuyo objetivo principal es **entender los conceptos básicos de comunicación en tiempo real** y **comunicación entre procesos (IPC)** en aplicaciones web modernas.

El sistema permite que múltiples usuarios intercambien mensajes en una misma sala de chat, con actualizaciones en tiempo real gracias al uso de **WebSockets**.

---

## 👥 Equipo de desarrollo

| Rol | Integrante | Responsabilidad principal |
|------|-------------|-----------------------------|
| 🧩 **Iván** | Backend Django clásico | Crear la base del proyecto, modelos, vistas, templates y endpoints HTTP |
| ⚡ **Ross** | Comunicación en tiempo real | Integrar Django Channels, WebSockets y capa de comunicación entre procesos |

---

## 🎯 Objetivo del proyecto

Aprender y aplicar los conceptos de:

- Django tradicional (modelos, vistas, templates, URLs)
- WebSockets y Django Channels
- Comunicación entre procesos (IPC) mediante Channel Layers
- Arquitectura básica de un chat local en tiempo real

---

## 🏗️ Estructura del trabajo

### 🧩 **Iván (Backend / Estructura base)**

1. Crear el repositorio y la estructura inicial del proyecto Django.  
2. Definir el modelo `Message` con los campos:
   - `sender` (usuario)
   - `room` (nombre de la sala)
   - `text` (contenido del mensaje)
   - `timestamp` (fecha y hora)
3. Implementar vistas y rutas:
   - `/room/<room_name>/` → página HTML de chat.  
   - `/api/messages/<room_name>/` → historial de mensajes en JSON.  
4. Crear el template base (`room.html`) con los elementos:
   - `<div id="messages">`
   - `<input id="messageInput">`
   - `<button id="sendBtn">`
5. Configurar autenticación básica de usuarios.

---

### ⚡ **Ross (Tiempo real / Django Channels)**

1. Instalar y configurar **Django Channels**.  
2. Modificar `asgi.py` para manejar HTTP y WebSockets.  
3. Crear el archivo `consumers.py` con la clase `ChatConsumer`:
   - `connect()` → unir el cliente al grupo de la sala.  
   - `receive()` → recibir mensajes del cliente, guardarlos y emitirlos.  
   - `chat_message()` → enviar mensajes a todos los clientes conectados.  
4. Configurar `CHANNEL_LAYERS`:
   - Fase 1: `InMemoryChannelLayer` (modo local simple).  
   - Fase 2: Redis (modo avanzado).  
5. Agregar el código JavaScript en `room.html` para abrir y gestionar la conexión WebSocket.

---

## 🧱 Estructura esperada del proyecto

