// src/CheckoutForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { generateUniqueId } from './helper';

export interface ParamProps {
  companyCode?: string;
  productCode?: string;
  status?: string;
}

interface PayOptions {
  successClosePopupDuration?: number;
  onSuccess?: (paramProps: ParamProps) => void;
  onPending?: (paramProps: ParamProps) => void;
  onClose?: (paramProps: ParamProps) => void;
}

declare global {
  interface Window {
    PWFDirectPay: {
      start: () => void;
      pay: (companyCode: string, productCode: string, options?: PayOptions) => void;
    };
  }
}

interface ItemDetail {
  id: string;
  name: string;
  price: number;
  quantity: number;
  desc: string;
  image_url: string;
}

interface FormData {
  title: string;
  type: 'SINGLE' | 'MULTIPLE';
  step: 'checkout' | 'checkout_seamless' | 'direct_api';
  amount: number;
  expired_date: string;
  redirect_url: string;
  is_address_required: boolean;
  is_phone_number_required: boolean;
  sender_name: string;
  sender_email: string;
  sender_phone_number: string;
  sender_address: string;
  charge_fee: boolean;
  reference_id: string;
  item_details: ItemDetail[];
}

const CheckoutForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: 'Cimol Rebus',
    type: 'MULTIPLE',
    step: 'checkout_seamless',
    amount: 0,
    expired_date: '2024-12-30T17:30',
    redirect_url: 'https://flip.id',
    is_address_required: true,
    is_phone_number_required: true,
    sender_name: 'Zora ',
    sender_email: 'user.pwf.flip+@gmail.com',
    sender_phone_number: '080989999',
    sender_address: 'Jalan jalan yuk kita kemana',
    charge_fee: true,
    reference_id: '',
    item_details: [
      {
        id: generateUniqueId(),
        name: 'Baco Bakal',
        price: 15000,
        quantity: 5,
        desc: '',
        image_url: '',
      },
    ],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked; // add type guard here
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleItemChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedItems = formData.item_details.map((item, i) =>
      i === index ? { ...item, [name.split('_')[1]]: value } : item
    );
    setFormData({ ...formData, item_details: updatedItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      item_details: [
        ...formData.item_details,
        { id: generateUniqueId(), name: '', price: 0, quantity: 1, desc: '', image_url: '' },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      item_details: formData.item_details.filter((_, i) => i !== index),
    });
  };

  const calculateTotalAmount = () => {
    return formData.item_details.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = 'https://fm-dev-box.flip.id/big_api/v3/pwf/bill';
      formData.expired_date = formData.expired_date.replace('T', ' ');
      const secretKey =
        'JDJ5JDEzJGVGalQvTlNJTXZTR21obU9yUkhQeHU2N2NxcU43Sm5LSmo4RnhhTWtCSEZDdTg2Lk1nLlBL'; // Replace with your actual secret_key
      const credentials = `${secretKey}:`; // Concatenate secret_key and empty password
      const encodedCredentials = btoa(credentials); // Base64 encode the credentials
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedCredentials}`, // Add the auth token here
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.PWFDirectPay.start();
        const result = await response.json();
        console.log({ result });
        window.PWFDirectPay.pay(result.company_code, result.product_code);
      } else {
        alert('Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-1/2 mx-auto mt-10 p-8 bg-gray-50 shadow-md rounded-lg min-w-96 max-w-2xl'
    >
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-900'>Payment Checkout</h2>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Type</label>
        <div className='flex space-x-4'>
          <label className='flex items-center text-gray-700'>
            <input
              type='radio'
              name='type'
              value='SINGLE'
              checked={formData.type === 'SINGLE'}
              onChange={handleChange}
              className='h-4 w-4 text-indigo-600'
            />
            <span className='ml-2 text-sm'>Single</span>
          </label>
          <label className='flex items-center text-gray-700'>
            <input
              type='radio'
              name='type'
              value='MULTIPLE'
              checked={formData.type === 'MULTIPLE'}
              onChange={handleChange}
              className='h-4 w-4 text-indigo-600'
            />
            <span className='ml-2 text-sm'>Multiple</span>
          </label>
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Step</label>
        <select
          name='step'
          value={formData.step}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        >
          <option value='checkout'>Checkout</option>
          <option value='checkout_seamless'>Checkout Seamless</option>
          <option value='direct_api'>Direct API</option>
        </select>
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Amount</label>
        <input
          type='number'
          name='amount'
          value={formData.amount}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Expired Date</label>
        <input
          type='datetime-local'
          name='expired_date'
          value={formData.expired_date}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Redirect URL</label>
        <input
          type='url'
          name='redirect_url'
          value={formData.redirect_url}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
      </div>

      <div className='mb-4 flex items-center'>
        <input
          type='checkbox'
          name='is_address_required'
          checked={formData.is_address_required}
          onChange={handleChange}
          className='h-4 w-4 text-indigo-600'
        />
        <label className='ml-2 text-sm font-medium text-gray-700'>Is Address Required</label>
      </div>

      <div className='mb-4 flex items-center'>
        <input
          type='checkbox'
          name='is_phone_number_required'
          checked={formData.is_phone_number_required}
          onChange={handleChange}
          className='h-4 w-4 text-indigo-600'
        />
        <label className='ml-2 text-sm font-medium text-gray-700'>Is Phone Number Required</label>
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Sender Name</label>
        <input
          type='text'
          name='sender_name'
          value={formData.sender_name}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Sender Email</label>
        <input
          type='email'
          name='sender_email'
          value={formData.sender_email}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Sender Phone Number</label>
        <input
          type='tel'
          name='sender_phone_number'
          value={formData.sender_phone_number}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Sender Address</label>
        <textarea
          name='sender_address'
          value={formData.sender_address}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        ></textarea>
      </div>

      <div className='mb-4 flex items-center'>
        <input
          type='checkbox'
          name='charge_fee'
          checked={formData.charge_fee}
          onChange={handleChange}
          className='h-4 w-4 text-indigo-600'
        />
        <label className='ml-2 text-sm font-medium text-gray-700'>Charge Fee</label>
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Reference ID</label>
        <input
          type='text'
          name='reference_id'
          value={formData.reference_id}
          onChange={handleChange}
          className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Item Details</h3>
        {formData.item_details.map((item, index) => (
          <div key={index} className='bg-white p-4 mb-4 rounded-lg shadow-sm'>
            <div className='flex justify-between items-center mb-4'>
              <h4 className='text-md font-semibold text-gray-800'>Item {index + 1}</h4>
              <button
                type='button'
                onClick={() => handleRemoveItem(index)}
                className='text-red-600 text-sm hover:text-red-800'
              >
                Remove
              </button>
            </div>
            <div className='mb-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Item ID</label>
              <input
                type='text'
                name='item_id'
                value={item.id}
                onChange={(e) => handleItemChange(e, index)}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>

            <div className='mb-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Item Name</label>
              <input
                type='text'
                name='item_name'
                value={item.name}
                onChange={(e) => handleItemChange(e, index)}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>

            <div className='mb-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Item Price</label>
              <input
                type='number'
                name='item_price'
                value={item.price}
                onChange={(e) => handleItemChange(e, index)}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>

            <div className='mb-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Item Quantity</label>
              <input
                type='number'
                name='item_quantity'
                value={item.quantity}
                onChange={(e) => handleItemChange(e, index)}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>

            <div className='mb-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Item Description
              </label>
              <textarea
                name='item_desc'
                value={item.desc}
                onChange={(e) => handleItemChange(e, index)}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              ></textarea>
            </div>

            <div className='mb-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Item Image URL</label>
              <input
                type='url'
                name='item_image_url'
                value={item.image_url}
                onChange={(e) => handleItemChange(e, index)}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          </div>
        ))}

        <button
          type='button'
          onClick={handleAddItem}
          className='bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 mt-4'
        >
          Add Item
        </button>
      </div>

      <div className='mb-6 p-4 bg-white rounded-lg shadow'>
        <h3 className='text-lg font-bold text-gray-900 mb-2'>Order Preview</h3>
        <p className='text-sm text-gray-700'>
          <strong>Name:</strong> {formData.sender_name}
        </p>
        <p className='text-sm text-gray-700'>
          <strong>Email:</strong> {formData.sender_email}
        </p>
        <p className='text-sm text-gray-700'>
          <strong>Phone:</strong> {formData.sender_phone_number}
        </p>
        <p className='text-sm text-gray-700'>
          <strong>Address:</strong> {formData.sender_address}
        </p>

        <h4 className='text-md font-semibold text-gray-900 mt-4 mb-2'>Order Details</h4>
        <p className='text-sm text-gray-700'>
          <strong>Item Count:</strong> {formData.item_details.length}
        </p>
        <p className='text-sm text-gray-700'>
          <strong>Total Amount:</strong> Rp {calculateTotalAmount()}
        </p>
      </div>

      <button
        type='submit'
        className='bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 w-full'
      >
        Submit
      </button>
    </form>
  );
};

export default CheckoutForm;
