import React from 'react';
import PropTypes from 'prop-types';
import checkMarkImg from '../assets/checkmark.png';

function MessageCard({
  message,
  name,
  date,
  isMyMessage,
}) {
  const dateObject = new Date(date);
  const timeString = `${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;
  const dateString = `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;
  const datetimeString = `${timeString} ${dateString}`;
  return (
    <li className={`row single-message-container ${isMyMessage ? 'justify-end' : ''}`}>
      <div className="col-7 black-border single-message">
        <section className="row">
          <img src={checkMarkImg} alt="" className="col-1" />
          <p className="col-6 my-0 px-1">{name}</p>
          <p className="col-3 my-0 time-text">{datetimeString}</p>
        </section>
        <section className="row single-message-text">
          {message}
        </section>
      </div>
    </li>
  );
}

MessageCard.propTypes = {
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  isMyMessage: PropTypes.bool.isRequired,
};

export default MessageCard;
