from django.contrib import admin
from django.urls import path, include
from core.api import router 

urlpatterns =
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]



