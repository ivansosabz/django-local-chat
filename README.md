# 🤝 Documento de Coordinación — Proyecto Django Local Chat

## 👋 Hola Ross

Este documento es para organizar cómo trabajaremos juntos en nuestro **mini proyecto de chat local con Django Channels**.  
El objetivo es que tengamos claro **qué hace el proyecto**, **qué parte desarrolla cada uno** y **cómo vamos a integrarlo sin pisarnos el trabajo**.

---

## 💬 Descripción general del proyecto

Crearemos un **chat en tiempo real** utilizando **Django + Django Channels**.  
El propósito principal es **aprender los conceptos de comunicación en tiempo real** y **comunicación entre procesos (IPC)** en entornos web modernos.

El sistema permitirá:

- Que varios usuarios se conecten a una misma sala de chat.
- Enviar y recibir mensajes sin recargar la página (WebSockets).
- Guardar el historial de mensajes en base de datos.

---

## 👥 Roles del equipo

| Integrante | Rol | Descripción |
|-------------|-----|-------------|
| **Iván** | Backend Django clásico | Crea la base del proyecto, modelos, vistas, templates y endpoints. |
| **Ross** | Tiempo real (Channels) | Implementa Django Channels, WebSockets y la comunicación entre procesos. |

---

## ⚡ Tu rol: Ross — Tiempo real con Django Channels

Tu trabajo será conectar la base del proyecto Django (que dejaré lista) con un sistema de comunicación en tiempo real usando **Channels** y **WebSockets**.

### 🔧 Tareas principales

1. **Instalar y configurar Django Channels**
   - Instalar el paquete `channels`.
   - Configurar `settings.py` para incluir `"channels"` y `ASGI_APPLICATION`.

2. **Configurar el enrutador ASGI**
   - Editar `chatproj/asgi.py` para manejar HTTP y WebSockets con:
     - `ProtocolTypeRouter`
     - `AuthMiddlewareStack`
   - Agregar la ruta WebSocket:
     ```
     ws/chat/<room_name>/ → ChatConsumer
     ```

3. **Crear el archivo `consumers.py`**
   - Crear la clase `ChatConsumer` que implemente:
     - `connect()` → unir al grupo de la sala.
     - `receive()` → recibir y guardar mensajes.
     - `chat_message()` → enviar mensajes a todos los clientes conectados.
   - Usar `group_add`, `group_send` y `group_discard`.

4. **Configurar el Channel Layer**
   - Para pruebas locales:
     ```python
     CHANNEL_LAYERS = {
         "default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}
     }
     ```
   - Luego, agregar configuración para **Redis** (opcional).

5. **Modificar el template `room.html`**
   - Agregar el script JS para la conexión WebSocket:
     ```javascript
     const chatSocket = new WebSocket(
         "ws://" + window.location.host + "/ws/chat/" + roomName + "/"
     );
     ```
   - Escuchar `onmessage` para mostrar los mensajes en pantalla.
   - Enviar nuevos mensajes usando `chatSocket.send()`.

6. **Pruebas**
   - Abrir dos navegadores con la misma sala.
   - Enviar mensajes y confirmar que se actualicen instantáneamente.
   - Verificar que los mensajes se guarden en la base de datos.

---

## 🧱 Qué dejará listo Iván

Cuando empieces, ya vas a tener:

- La estructura base del proyecto Django (`chatproj/` y `chat/`).
- El modelo `Message` con:
  - `sender`, `room`, `text`, `timestamp`.
- Migraciones aplicadas y base de datos configurada.
- Vistas y rutas:
  - `/room/<room_name>/` → muestra la sala.
  - `/api/messages/<room_name>/` → historial JSON.
- Template `room.html` con:
  - `<div id="messages">`
  - `<input id="messageInput">`
  - `<button id="sendBtn">`

Tu tarea será enchufar **Channels** y **WebSockets** sobre esta base.

---

## 🔄 Flujo de trabajo entre nosotros

1. **Iván**
   - Crea la base Django y sube el proyecto al repositorio (`main`).
2. **Ross**
   - Crea una nueva rama (`realtime` o `channels`).
   - Implementa Channels, Consumers y JS WebSocket.
3. **Integración**
   - Ambos prueban localmente.
   - Se hace **merge** de la rama de Ross en `main`.
4. **Prueba final**
   - Confirmar que los mensajes se envían y reciben en tiempo real.

---

## 🗺️ Roadmap (plan de avance)

| Etapa | Descripción | Responsable |
|--------|--------------|-------------|
| 1️⃣ | Crear estructura Django base y modelo `Message` | Iván |
| 2️⃣ | Implementar vistas y template del chat | Iván |
| 3️⃣ | Configurar Channels y WebSockets | Ross |
| 4️⃣ | Integrar las partes y probar el chat en vivo | Ambos |
| 5️⃣ | (Opcional) Reemplazar `InMemoryChannelLayer` por Redis | Ross |
| 6️⃣ | Mejorar diseño del frontend | Ambos |

---

## 💡 Recomendaciones de trabajo

### 📂 Control de versiones (Git)
- Trabajemos en **ramas separadas** (`backend`, `channels`, `main`).
- Hacer commits pequeños y descriptivos:
  ```bash
  git commit -m "Agrega ChatConsumer y configuración de Channels"
