from django.contrib import admin
from django.urls import path
from ..views import users_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    path('login/', users_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    
    path('',users_views.getUsers,name='users'),
    path('register/',users_views.registerUser,name='user-register'),
    path('profile/',users_views.getUserProfile,name='users-profile'),
    path('profile/update/',users_views.updateUserProfile,name='users-profile-update'),
    path('update/<str:pk>/',users_views.updateUser,name='users-update'),
    path('<str:pk>/',users_views.getUserByID,name='get-user'),
    path('delete/<str:pk>/',users_views.deleteUsers,name='users-delete'),
    
  
    
]