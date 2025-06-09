// frontend/src/Page/MainPage/Contact.jsx
import React from 'react';

const Contact = () => {
  return (
    <div className='bg-white py-48'>
      <div className='container mx-auto px-4 max-w-6xl'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl lg:text-5xl font-bold text-gray-800 mb-4'>
            문의하기
          </h2>
          <p className='text-gray-600 text-lg'>
            궁금한점이 있으신가요? 있다면 찾아와서 문의해주세요.
          </p>

          <div className='mb-12 max-w-4xl mx-auto'>
            <div className='bg-white shadow rounded-xl overflow-hidden'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3371.390685770062!2d127.14855491145235!3d36.851185364708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b28c12a18e90f%3A0x95df92b0331c5c65!2z6rWt66a96rO17KO864yA7ZWZ6rWQIOyynOyViOy6oO2NvOyKpA!5e1!3m2!1sen!2skr!4v1749132582554!5m2!1sen!2skr'
                width='100%'
                height='450'
                allowFullScreen=''
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                className='w-full h-[600px]'
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
