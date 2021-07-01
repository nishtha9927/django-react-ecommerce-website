import React,{useState,useEffect} from 'react'
import {Button,Row,Col,ListGroup,Image,Card} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import { getOrderDetails,listMyOrders,payOrder,deliverOrder } from '../actions/orderActions'
import Loader from '../components/Loader'
import Axios from 'axios'
import { ORDER_PAY_RESET,ORDER_DELIVERED_RESET } from '../constants/orderConstants'




function OrderScreen({match,history}) {

    const [sdkReady, setSdkReady] = useState(false)
    const orderId = match.params.id
    const dispatch = useDispatch()
    const orderDetails = useSelector(state => state.orderDetails)
    const {order,loading,error} = orderDetails
    const [pay, setPay] = useState(true)

    const orderPay = useSelector(state => state.orderPay)
    const {loading:loadingPay,success:successPay} = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading:loadingDeliver,success:successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin


    if(!loading && !error){
    order.itemsPrice = order.orderItems.reduce((acc,item) => acc + item.price * item.quantity,0).toFixed(2)
    }

    const loadScript = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
        
      }


    
    useEffect(() => {

        if(!userInfo){
            history.push('/login')
        }

        if(!order || successPay || successDeliver || order._id!=Number(orderId)){
        dispatch({type:ORDER_PAY_RESET})
        dispatch({type:ORDER_DELIVERED_RESET})
        dispatch(getOrderDetails(orderId))
            
        }else if(order.paidAt){
            setPay(false)
            
        }
        
    
        
       
    }, [dispatch,successPay,order,orderId,successDeliver,userInfo,history])
    

    const handlePaymentSuccess = async (response) => {
        
        try {
        
          let bodyData = new FormData();
    
          // we will send the response we've got from razorpay to the backend to validate the payment
          bodyData.append("response", JSON.stringify(response));
          bodyData.append("orderId",orderId)
    
          await Axios({
            url: `/api/orders/razorpay/payment/success/`,
            method: "POST",
            data: bodyData,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
              .catch((err) => {
                console.log(err);
              });
            //   window.location.reload();
            dispatch(payOrder(orderId))
            dispatch(listMyOrders())

        } catch (error) {
          console.log(console.error());
        }
        
        

        
      }

    const showRazorpay = async () => {
        const res = loadScript();
        setSdkReady(true)
        
    
        let bodyData = new FormData();
        
        
    
        // we will pass the amount and product name to the backend using form data
        bodyData.append("amount", order.totalPrice.toString());
        
    
        const data = await Axios({
          url: `/api/orders/razorpay/pay/${orderId}/`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          data: bodyData,
        }).then((res) => {
          return res;
        });
    
        var options = {
          key_id: 'rzp_test_M9Y5UcWMLScd71',
          key_secret:'8m7APq9H0PFNXCbThdCmOhil',
          amount: data.data.payment.amount,
          currency: "INR",
          name: "GetItAll",
          description: "Test transaction",
          image: "", // add image url
          order_id: data.data.payment.id,
          handler: function (response) {
            // we will handle success by calling handlePayment method and
            // will pass the response that we've got from razorpay
            handlePaymentSuccess(response);
          },
          prefill: {
            name: order.user.name,
            email: order.user.email,
            
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
    
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      };

    
    

    const deliverHandler = () => {
         dispatch(deliverOrder(order))
    }

    
    
    

    return loading? (
        <Loader/>
    ):error?(
        <Message variant='danger'>{error}</Message>
    ):(
        <div>
            <h1>Order : {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name : </strong>{order.user.name}</p>
                            <p><strong>Email : </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Shipping : </strong>
                                {order.shippingAddress.address},{order.shippingAddress.city}
                                {'  '}
                                {order.shippingAddress.postalCode},
                                {'  '}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered On {order.deliveredAt.substring(0,10)}</Message>
                            ):(
                                <Message variant='warning'>Not Delivered</Message>
                            )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method:</strong>
                                {order.paymentMethod}
                            
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid On {order.paidAt.substring(0,10)}</Message>
                            ):(
                                <Message variant='warning'>Not Paid</Message>
                            )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0?<Message variant='info'>Your order is empty</Message>:(
                                <ListGroup variant="flush">
                                    {order.orderItems.map((item,index) => (
                                        <ListGroup.Item key={item._id}>
                                            <Row>
                                                <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                <Link to={`/product/${item.product}`} style={{ textDecoration: 'none' }}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="text-center">
                            <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                    Item:
                                    </Col>
                                    <Col>
                                    ₹{order.itemsPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                    Shipping:
                                    </Col>
                                    <Col>
                                    ₹{order.shippingPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                    Tax:
                                    </Col>
                                    <Col>
                                    ₹{order.taxPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                    Total:
                                    </Col>
                                    <Col>
                                    ₹{order.totalPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item className="text-center">
                                    {loadingPay && <Loader/>}
                                    {!pay ? (
                                        <Loader/>
                                    ):(
                                    <button onClick={showRazorpay} className="btn btn-primary btn-block">
                                        Pay with razorpay
                                    </button>
                                    )}
                                </ListGroup.Item>

                            )}
                            {loadingDeliver && <Loader/>}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button
                                   type="button" 
                                   className="btn btn-block"
                                   onClick={deliverHandler}
                                    >
                                        Mark As Delivered
                                    </Button>
                            </ListGroup.Item>
                        )}


                            
                                {error && <Message variant='danger'>{error}</Message>}
                            

                        </ListGroup>
                        
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen
