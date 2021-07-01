import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form,Button,Row,Col,Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails,getuserUpdateProfile } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'

function Myorders({history}) {
    const dispatch = useDispatch()

    
    const userDetails = useSelector(state => state.userDetails)
    const {error,loading,user} = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const {success} = userUpdateProfile

    const orderListMy = useSelector(state => state.orderListMy)
    const {loading:loadingOrders,error:errorOrders,orders} = orderListMy

    useEffect(() => {
        if(!userInfo){
            history.push('/login')
        }
        else{
            if(!user || !user.name || success || userInfo._id!==user._id){
                
                dispatch(listMyOrders())
            }
           
        }
        
    }, [dispatch,history,userInfo,user])

   

    return (
        <div>
            
               <h1 className="my-3">My Orders</h1>
               {loadingOrders? (
                   <Loader/>
               ):errorOrders? (
                   <Message variant="danger">{errorOrders}</Message>
               ):(
                   <Table striped responsive className="table-sm">
                       <thead>
                           <tr>
                               <th>ID</th>
                               <th>Date</th>
                               <th>Total Price</th>
                               <th>Paid</th>
                               <th>Delivered</th>
                               <th></th>
                           </tr>
                       </thead>
                       <tbody>
                           {orders.map(order => (
                               <tr key={order._id}>
                                   <td>{order._id}</td>
                                   <td>{order.createdAt.substring(0,10)}</td>
                                   <td>{order.totalPrice}</td>
                                   <td>{order.isPaid? order.paidAt.substring(0,10):<i className="fas fa-times" style={{color:'red'}}></i>}</td>
                                   <td>
                                       <LinkContainer to={`/order/${order._id}`}>
                                        <Button className="btn-sm">Details</Button>
                                        
                                        </LinkContainer>
                                   </td>
                               </tr>
                           ))}
                       </tbody>

                   </Table>
               )}
           
        </div>
    )
}

export default Myorders
