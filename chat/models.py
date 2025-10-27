from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.CharField(max_length=100, default="general")
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        # ejemplo: [general] ivan: hola che
        return f"[{self.room}] {self.sender.username}: {self.text[:20]}"
