import React from 'react'

import { useAppContext } from '../context/AppContext'
import Productcard from './Productcard'
const Bestseller = () => {
  const {products} =useAppContext();
  return (
    
    <div className='mt-16'>
         <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
         <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 mt-6 gap-6'>
   {products.filter((product)=>product.inStock).slice(0,5).map((product,index)=>( <Productcard key ={index} product={product}/>)) }
     
   
         </div>
       </div>
  )
}

export default Bestseller
