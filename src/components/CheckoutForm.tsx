// src/CheckoutForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';

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
    expired_date: '2024-12-30T17:30', // Updated to ISO string format for datetime-local input
    redirect_url: 'https://flip.id',
    is_address_required: true,
    is_phone_number_required: true,
    sender_name: 'Zora ',
    sender_email: 'user.pwf.flip+@gmail.com',
    sender_phone_number: '080989999',
    sender_address: '',
    charge_fee: true,
    reference_id: '',
    item_details: [
      {
        id: '',
        name: '',
        price: 0,
        quantity: 1,
        desc: '',
        image_url: '',
      },
    ],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    // Additional form submission logic
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Payment Checkout</h2>
      {/* Render form fields with appropriate handlers */}
      <div>
        <label>Title: </label>
        <input type='text' name='title' value={formData.title} onChange={handleChange} />
      </div>
      <div>
        <label>Type: </label>
        <input
          type='radio'
          name='type'
          value='SINGLE'
          checked={formData.type === 'SINGLE'}
          onChange={handleChange}
        />{' '}
        Single
        <input
          type='radio'
          name='type'
          value='MULTIPLE'
          checked={formData.type === 'MULTIPLE'}
          onChange={handleChange}
        />{' '}
        Multiple
      </div>
      <div>
        <label>Step: </label>
        <select name='step' value={formData.step} onChange={handleChange}>
          <option value='checkout'>Checkout</option>
          <option value='checkout_seamless'>Checkout Seamless</option>
          <option value='direct_api'>Direct API</option>
        </select>
      </div>
      <div>
        <label>Amount: </label>
        <input type='number' name='amount' value={formData.amount} onChange={handleChange} />
      </div>
      <div>
        <label>Expired Date: </label>
        <input
          type='datetime-local'
          name='expired_date'
          value={formData.expired_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Redirect URL: </label>
        <input
          type='url'
          name='redirect_url'
          value={formData.redirect_url}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Is Address Required: </label>
        <input
          type='checkbox'
          name='is_address_required'
          checked={formData.is_address_required}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Is Phone Number Required: </label>
        <input
          type='checkbox'
          name='is_phone_number_required'
          checked={formData.is_phone_number_required}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Sender Name: </label>
        <input
          type='text'
          name='sender_name'
          value={formData.sender_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Sender Email: </label>
        <input
          type='email'
          name='sender_email'
          value={formData.sender_email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Sender Phone Number: </label>
        <input
          type='tel'
          name='sender_phone_number'
          value={formData.sender_phone_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Sender Address: </label>
        <textarea
          name='sender_address'
          value={formData.sender_address}
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <label>Charge Fee: </label>
        <input
          type='checkbox'
          name='charge_fee'
          checked={formData.charge_fee}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Reference ID: </label>
        <input
          type='text'
          name='reference_id'
          value={formData.reference_id}
          onChange={handleChange}
        />
      </div>
      <h3>Item Details</h3>
      {formData.item_details.map((item, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <div>
            <label>Item ID: </label>
            <input
              type='text'
              name='item_id'
              value={item.id}
              onChange={(e) => handleItemChange(e, index)}
            />
          </div>
          <div>
            <label>Item Name: </label>
            <input
              type='text'
              name='item_name'
              value={item.name}
              onChange={(e) => handleItemChange(e, index)}
            />
          </div>
          <div>
            <label>Item Price: </label>
            <input
              type='number'
              name='item_price'
              value={item.price}
              onChange={(e) => handleItemChange(e, index)}
            />
          </div>
          <div>
            <label>Item Quantity: </label>
            <input
              type='number'
              name='item_quantity'
              value={item.quantity}
              onChange={(e) => handleItemChange(e, index)}
            />
          </div>
          <div>
            <label>Item Description: </label>
            <textarea
              name='item_desc'
              value={item.desc}
              onChange={(e) => handleItemChange(e, index)}
            ></textarea>
          </div>
          <div>
            <label>Item Image URL: </label>
            <input
              type='url'
              name='item_image_url'
              value={item.image_url}
              onChange={(e) => handleItemChange(e, index)}
            />
          </div>
        </div>
      ))}
      <button type='submit'>Submit</button>
    </form>
  );
};

export default CheckoutForm;
