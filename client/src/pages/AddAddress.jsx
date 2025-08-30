import React, { useState } from 'react'
import { assets } from '../assets/assets'
const InputField=({type,placeholder,name,handleChange,address})=>(
 <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none 
    text-gray-500 focus:border-primary transition'
     type={type} 
     placeholder={placeholder}
     name={name}
    onChange={handleChange}
     value={address}
     required/>
)
const AddAddress = () => {
    const [address,setAddress]=useState({
       firstname:'',
       lastname:'',
       email:'',
       street:'',
       city:'',
       state:'',
       zipcode:'',
       country:'',
       phone:'' 
    })
    const handleChange=(e)=>{
const {name,value}=e.target;
setAddress((prevAddress)=>({
    ...prevAddress,
    [name]:value,
}))

    }
    const onSubmitHandler=async(e)=>{
        e.preventDefault();
    }
  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping
         <span className='font-semibold text-primary'>Address</span></p>
         <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
    <div className='flex-1 max-w-md'>
<form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>

    <div className='grid grid-cols-2 gap-4'>
          <InputField handleChange={handleChange} address={address.firstname} name="firstname" type="text" placeholder="First Name" />
          <InputField handleChange={handleChange} address={address.lastname} name='lastname'type='text' placeholder='Last Name' />

    </div>
    
      <InputField handleChange={handleChange} address={address.email} name='email'type='email' placeholder='Email' />
  <InputField handleChange={handleChange} address={address.street} name='street'type='text' placeholder='Street' />


    <div className='grid grid-cols-2 gap-4'>
          <InputField handleChange={handleChange} address={address.city} name='city'type='text' placeholder='city' />
            <InputField handleChange={handleChange} address={address.country} name='country'type='text' placeholder='country' />
    </div>

     <div className='grid grid-cols-2 gap-4'>
          <InputField handleChange={handleChange} address={address.zipcode} name='zipcode'type='number' placeholder='zip code' />
            <InputField handleChange={handleChange} address={address.state} name='state'type='text' placeholder='state' />
    </div>
      <InputField handleChange={handleChange} address={address.phone} name='phone'type='text' placeholder='phone' />
<button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>
    Save address
</button>
</form>
    </div>
    <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add address" />
         </div>
    </div>
  )
} 

export default AddAddress
