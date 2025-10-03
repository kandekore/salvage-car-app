import React, { useState } from 'react';

const UserDetailsForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      alert("Emails don't match!");
      return;
    }
    onSubmit({ name, phone, email, additionalInfo });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Enter Your Details</h3>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="email" placeholder="Confirm Email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required />
      <textarea placeholder="Additional Information" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserDetailsForm;