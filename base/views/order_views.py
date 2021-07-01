from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from ..serailizers import ProductSerializer,OrderSerializer
from ..models import Product,Order,OrderItem,ShippingAddress
from rest_framework import status
from django.utils import timezone
import datetime 
import razorpay
import json


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data =request.data
   
    orderItems = data['orderItems']
    if orderItems and len(orderItems) == 0:
        return Response({'detail':'No Order Items'},status=status.HTTP_400_BAD_REQUEST)
    else:
        # Create Order

        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice'],

        )

        # create Shipping Address

        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country'],
        )
        # create order items and set order to order item relationship

        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                quantity = i['qty'],
                price = i['price'],
                image = product.image.url,
            )

        # update stock

            product.countInStock -= int(item.quantity)  
            product.save()
        serializer = OrderSerializer(order,many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request,pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order,many=False)
            return Response(serializer.data)
        else:
            return Response({'detail':'Not Authorized to view this order'},status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'detail':'Order does not exists'},status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request,pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.datetime.now(tz=timezone.utc)
    order.save()
    return Response({'success':'Order was Paid'})

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request,pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.datetime.now(tz=timezone.utc)
    order.save()
    return Response({'success':'Order was Delivered'})

@api_view(['POST'])
def start_payment(request,pk):
    # request.data is coming from frontend
    amount = request.data['amount']
    

    # setup razorpay client
    client = razorpay.Client(auth=("rzp_test_M9Y5UcWMLScd71","8m7APq9H0PFNXCbThdCmOhil"))

    # create razorpay order
    payment = client.order.create({"amount": float(amount) * 100, 
                                   "currency": "INR", 
                                   "payment_capture": "1"})


    order = Order.objects.get(_id=pk)
    
    serializer = OrderSerializer(order,many=False)
   
   
   

    """order response will be 
    {'id': 17, 
    'order_date': '20 November 2020 03:28 PM', 
    'order_product': '**product name from frontend**', 
    'order_amount': '**product amount from frontend**', 
    'order_payment_id': 'order_G3NhfSWWh5UfjQ', # it will be unique everytime
    'isPaid': False}"""

    data = {
        "payment": payment,
        "order": serializer.data
        
    }
    return Response(data)

@api_view(['POST'])
def handle_payment_success(request):
    # request.data is coming from frontend
    res = json.loads(request.data["response"])
    oid = request.data['orderId']
    print(oid)

    """res will be:
    {'razorpay_payment_id': 'pay_G3NivgSZLx7I9e', 
    'razorpay_order_id': 'order_G3NhfSWWh5UfjQ', 
    'razorpay_signature': '76b2accbefde6cd2392b5fbf098ebcbd4cb4ef8b78d62aa5cce553b2014993c0'}
    """

    ord_id = ""
    raz_pay_id = ""
    raz_signature = ""

    # res.keys() will give us list of keys in res
    for key in res.keys():
        if key == 'razorpay_order_id':
            ord_id = res[key]
        elif key == 'razorpay_payment_id':
            raz_pay_id = res[key]
        elif key == 'razorpay_signature':
            raz_signature = res[key]

    # get order by payment_id which we've created earlier with isPaid=False
    # order = Order.objects.get(order_payment_id=ord_id)

    data = {
        'razorpay_order_id': ord_id,
        'razorpay_payment_id': raz_pay_id,
        'razorpay_signature': raz_signature
    }

    client = razorpay.Client(auth=("rzp_test_M9Y5UcWMLScd71","8m7APq9H0PFNXCbThdCmOhil"))

    # checking if the transaction is valid or not if it is "valid" then check will return None
    check = client.utility.verify_payment_signature(data)

    if check is not None:
        print("Redirect to error url or error page")
        return Response({'error': 'Something went wrong'})

    # if payment is successful that means check is None then we will turn isPaid=True
    order = Order.objects.get(_id=oid)
    order.isPaid = True
    order.paidAt = datetime.datetime.now(tz=timezone.utc)
    order.save()

    res_data = {
        'message': 'payment successfully received!'
    }

    return Response(res_data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders,many=True)
    return Response(serializer.data)


    
    

    