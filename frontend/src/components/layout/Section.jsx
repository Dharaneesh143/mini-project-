import React from 'react'

const Section = ({ 
  children, 
  className = '', 
  id = '',
  background = 'bg-white',
  padding = 'py-12 sm:py-16 lg:py-20'
}) => {
  return (
    <section 
      id={id}
      className={`${background} ${padding} ${className}`}
    >
      {children}
    </section>
  )
}

export default Section
