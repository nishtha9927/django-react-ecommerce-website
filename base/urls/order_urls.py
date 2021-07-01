from django.contrib import admin
from django.urls import path
from ..views import order_views as views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    path('',views.getOrders,name='orders'),
    path('add/',views.addOrderItems,name='order-add'),
    path('razorpay/pay/<str:pk>/',views.start_payment,name='order-pay'),
    path('razorpay/payment/success/', views.handle_payment_success, name="payment_success"),
    path('myorders/',views.getMyOrders,name='my_orders'),
    path('<str:pk>/paid/',views.updateOrderToPaid,name='order-pay-detail'),
    path('<str:pk>/delivered/',views.updateOrderToDelivered,name='order-delivered-detail'),
    path('<str:pk>/',views.getOrderById,name='order-detail'),
    
    
]