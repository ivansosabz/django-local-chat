# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.group_name = f"chat_{self.room_name}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data or "{}")
        user = data.get("user", "Anónimo")
        message = data.get("message", "")
        # difunde a todos en la sala
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "chat.message", "user": user, "message": message}
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "user": event["user"],
            "message": event["message"],
        }))
