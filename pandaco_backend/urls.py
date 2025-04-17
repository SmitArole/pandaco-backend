from django.contrib import admin
from django.urls import path, include
from core.api import router  # 👈 This line connects your contractor API

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # 👈 This makes /api/contractors/ work!
]

