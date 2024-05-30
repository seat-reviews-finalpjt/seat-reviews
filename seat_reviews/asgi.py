import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
import seat_reviews.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'seat_reviews.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": seat_reviews.routing.application,
})
