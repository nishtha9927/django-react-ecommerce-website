import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form,Button } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails,updateUser } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserEditScreen({match,history}) {
    const userId = match.params.id

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [isAdmin,setIsAdmin] = useState(false)
    
    const dispatch = useDispatch()

    
    const userDetails = useSelector(state => state.userDetails)
    const {error,loading,user} = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const {error:errorUpdate,loading:loadingUpdate,success:successUpdate} = userUpdate

    useEffect(() => {
        if(successUpdate){
            dispatch({type:USER_UPDATE_RESET})
            history.push('/admin/userlist')
        }
        else{
            if(!user.name || user._id!==Number(userId)){
                dispatch(getUserDetails(userId))
            }
            else{
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }

        }
        
       
    }, [user,dispatch,userId,successUpdate,history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({"_id":user._id,"name":name,"email":email,"isAdmin":isAdmin}))
        
        
    }
    return (
        <div>
            <Link to='/admin/userlist'>
                Go back
            </Link>
        <FormContainer>
            <h1>Edit User</h1>
            
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loadingUpdate && <Loader/>}
            <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
                    <Form.Label>
                        Name
                    </Form.Label><br></br>
                    <Form.Control
                        
                        type='name'
                        placeholder='Enter Name'
                        value = {name}
                        onChange = {(e) => setName(e.target.value)}
                    >
                    </Form.Control><br></br>
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>
                        Email Address
                    </Form.Label><br></br>
                    <Form.Control
                        
                        type='email'
                        placeholder='Enter Email Id'
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                    >
                    </Form.Control><br></br>
                </Form.Group>
                <Form.Group controlId='isadmin'>
                   
                    <Form.Check
                        
                        type='checkbox'
                        label='is Admin'
                        checked = {isAdmin}
                        onChange = {(e) => setIsAdmin(e.target.checked)}
                    >
                    </Form.Check><br></br>
                    </Form.Group>
                    
                    <Button className="my-3" type='submit' variant='primary'>Update</Button>
            </Form>
            
        </FormContainer>
        </div>
    )
}

export default UserEditScreen
