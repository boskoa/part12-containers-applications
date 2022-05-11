import React from 'react'

const Notification = ({ message }) => {
  return (
    <div>
      <p className={message.style}>
        {message.text}
      </p>
    </div>
  )
}

export default Notification