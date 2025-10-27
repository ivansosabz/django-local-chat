from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Message
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.utils import timezone
import json
from django.http import HttpResponseBadRequest

# @login_required
def room(request, room_name):
    # Esta vista solo devuelve el HTML. Ross después mete WebSocket en ese HTML.
    return render(request, "chat/room.html", {"room_name": room_name})

def get_messages(request, room_name):
    # Traemos los últimos ~50 mensajes de esa sala
    msgs = (
        Message.objects
        .filter(room=room_name)
        .order_by("-timestamp")[:50]
    )

    # los damos vuelta para que queden viejo -> nuevo
    data = [
        {
            "sender": m.sender.username,
            "text": m.text,
            "timestamp": m.timestamp.isoformat(),
        }
        for m in reversed(msgs)
    ]

    return JsonResponse({"messages": data})

@csrf_exempt
def send_message(request, room_name):
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST allowed")

    try:
        body = json.loads(request.body.decode("utf-8"))
        text = body.get("text", "").strip()
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    if text == "":
        return HttpResponseBadRequest("Empty message")

    # TODO en el futuro: usar request.user
    # Por ahora: usamos un usuario fijo para desarrollo
    demo_user, _ = User.objects.get_or_create(username="demo", defaults={"password": "demo"})

    msg = Message.objects.create(
        sender=demo_user,
        room=room_name,
        text=text,
        timestamp=timezone.now(),
    )

    return JsonResponse({
        "sender": msg.sender.username,
        "text": msg.text,
        "timestamp": msg.timestamp.isoformat(),
    })
