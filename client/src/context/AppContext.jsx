import { createContext, useContext ,useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import {toast} from "react-hot-toast";
import axios from "axios";
export const AppContext=createContext();

axios.defaults.withCredentials=true;    
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL
export const AppContextProvider=({children})=>{
      const currency=import.meta.env.VITE_CURRENCY
      const navigate=useNavigate()
       const [user,setUser]=useState(null)
     const [isSeller,setIsSeller]=useState(false)
     const [showUserLogin,setShowUserLogin]=useState(false)
    const [products,setproducts]=useState([])
    const [cartItems,setCartItems]=useState({})
    const [searchQuery,setSearchQuery]=useState({})


    //fetch seller status
    const fetchSeller=async()=>{
        try{
            const {data}= await axios.get('/api/seller/is-auth')
            if(data.success){
                setIsSeller(true)
            }
            else{
                setIsSeller(false)
            }
        }catch(error){
            setIsSeller(false)
        }
    }

    //fetch User data and cart items from backend
    const fetchUser=async()=>{
        try {
            const {data}=await axios.get('/api/user/is-auth')
            if(data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
    
        } catch (error) {
            setUser(null)
        }
    }
const fetchProducts=async()=>{
   try{
    const {data} =await axios.get('/api/product/list')
    if(data.success){
        setproducts(data.products)
    }
    else{
        toast.error(data.message)
    }
   }catch(error){
    toast.error(error.message)
   }
}

useEffect(()=>{
    fetchSeller()
    fetchProducts()
    fetchUser()
},[])
//update database cart items when cartItems state changes
useEffect(()=>{
const updateCart=async()=>{
    try {
    const {data}=  await axios.post('/api/cart/update',{cartItems})
        if(!data.success){
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }}
    if(user){
        updateCart()
    }
},[cartItems])

//add product to cart
const addToCart=(itemId)=>{
    let cartData=structuredClone(cartItems);

    if(cartData[itemId]){
        cartData[itemId] +=1;
    }
    else{
        cartData[itemId]=1;
    }
setCartItems(cartData);
toast.success("Added to cart")
}

//get cart item count
const getCartCount=()=>{
    let totalCount=0;
    for(const item in cartItems){
        totalCount+=cartItems[item]
    }
    return totalCount;
}
//get cart total amount
const getCartAmount=()=>{
    let totalAmount=0;
    for(const items in cartItems){
        let iteminfo=products.find((product)=>product._id===items);
        if(cartItems[items]>0){
            totalAmount+=iteminfo.offerPrice*cartItems[items]
        }
    }
    return Math.floor(totalAmount*100)/100;
}
//update cart item quantity
const updateCartItem=(itemId,quantity)=>{
let cartData=structuredClone(cartItems);
cartData[itemId]=quantity;
setCartItems(cartData)
toast.success("cart updated")
}

//delete cart items
const removeFromCart=(itemId)=>{
    let cartData=structuredClone(cartItems);
    if(cartData[itemId]){
          cartData[itemId] -=1;
          if(cartData[itemId]===0){
            delete cartData[itemId];
          }
    }
    toast.success("Removed from cart");
    setCartItems(cartData)
}

const value={setCartItems,fetchProducts,axios,currency,navigate,user,setUser,setIsSeller,isSeller,showUserLogin,setShowUserLogin,
    products,setproducts,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartCount,getCartAmount}
return <AppContext.Provider value={value}>
    {children}
</AppContext.Provider>
}

export const useAppContext=()=>{
    return useContext(AppContext)
}