import { createContext, useContext ,useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext=createContext();

export const AppContextProvider=({children})=>{
    const currency=import.meta.VITE_CURRENCY
    const navigate=useNavigate()
    const [user,setUser]=useState(true)
    const [isseller,setIsseller]=useState(false)
  const [showUserLogin,setShowUserLogin]=useState(false)
const [products,setproducts]=useState([])
const [cartItems,setCartItems]=useState({})
const [searchQuery,setSearchQuery]=useState({})

const fetchProducts=async()=>{
    setproducts(dummyProducts)
}

useEffect(()=>{
    fetchProducts()
},[])

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

const value={currency,navigate,user,setUser,setIsseller,isseller,showUserLogin,setShowUserLogin,
    products,setproducts,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery}
return <AppContext.Provider value={value}>
    {children}
</AppContext.Provider>
}

export const useAppContext=()=>{
    return useContext(AppContext)
}