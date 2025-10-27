from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("sender", "room", "text_preview", "timestamp")
    list_filter = ("room", "sender", "timestamp")
    search_fields = ("text", "room", "sender__username")
    ordering = ("-timestamp",)

    def text_preview(self, obj):
        return obj.text[:40]
    text_preview.short_description = "text"
