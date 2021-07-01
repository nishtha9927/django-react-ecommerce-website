from django.contrib import admin
from django.urls import path
from ..views import product_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    
    path('',product_views.getProducts,name='Products'),
    path('create/',product_views.createProduct,name='create-product'),
    path('upload/',product_views.uploadImage,name='upload-image'),
    path('top/',product_views.getTopProducts,name='top-products'),
    path('<str:pk>/reviews/',product_views.createProductReview,name='Product-review'),
    path('<str:pk>/',product_views.getProduct,name='Product'),
    path('delete/<str:pk>/',product_views.DeleteProduct,name='delete-product'),
    path('update/<str:pk>/',product_views.updateProduct,name='update-product'),
]