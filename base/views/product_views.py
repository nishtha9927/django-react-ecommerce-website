from rest_framework import serializers
from django.core.paginator import Paginator,EmptyPage,PageNotAnInteger
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from ..serailizers import ProductSerializer
from ..models import Product,Review
from rest_framework import status




@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    print('query:',query)
    if query == None:
        query=''
    products = Product.objects.filter(name__icontains=query)
    page = request.query_params.get('page')
    paginator = Paginator(products,8)

    try:
        #jb page no ho to page no ke hisab se products dedo
        products = paginator.page(page)
    except PageNotAnInteger:
        #jb koi page no na ho to first page dedo
        products = paginator.page(1)
    except EmptyPage:
        #agr page exists na krta ho to last page dedo
        products = paginator.page(paginator.num_pages)
    print("abc",paginator.num_pages)

    if page == None:
        page = 1
    page = int(page)
    # i stands for case insensitive
    serializer = ProductSerializer(products,many=True)
    return Response({'products':serializer.data,'page':page,'pages':paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    #all products with rating greater than equals to 4 and ordered in descending order of rating andonly first 5 products
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data)
    


@api_view(['GET'])
def getProduct(request,pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product,many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user = user,
        name = 'Sample Name',
        price = 0,
        brand = 'Sample brand',
        countInStock = 0,
        category = 'Sample Category',
        description = ''
    )
    serializer = ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data = request.data
    product = Product.objects.get(_id=pk)
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    product.save()
    
    
    serializer = ProductSerializer(product,many=False)
    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def DeleteProduct(request,pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response("Product Deleted")

@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    product.image = request.FILES.get('image')
    product.save()
    return Response("Image was uploaded")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request,pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1-Review already exists
    #get all reviews of particular product in which user=user
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail':'Product already reviewed'}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)

    # 2-No Rating or 0
    elif data['rating'] == 0:
        content = {'detail':'Please select a rating'}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)


    # 3-Create Review

    else:
        review = Review.objects.create(
            user=user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment'],

        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total / len(reviews)
        product.save()
        return Response({'detail':'Review added'})
    
