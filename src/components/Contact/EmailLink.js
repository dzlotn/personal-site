import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Validates the email address format.
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) || email.length === 0;
};

const messages = ['daniel.zlotnick5@gmail.com'];

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay) {
      const id = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }
    return () => {};
  }, [delay]);
};

const EmailLink = ({ loopMessage }) => {
  const hold = 50; // Ticks to wait after message is complete before rendering the next message.
  const delay = 50; // Tick length in milliseconds.

  const [idx, updateIdx] = useState(0); // Points to the current message.
  const [message, updateMessage] = useState(messages[idx]);
  const [char, updateChar] = useState(0); // Points to the current character.
  const [isActive, setIsActive] = useState(true); // Disable when all messages are printed.

  useInterval(
    () => {
      let newIdx = idx;
      let newChar = char;
      if (char - hold >= messages[idx].length) {
        newIdx += 1;
        newChar = 0;
      }
      if (newIdx === messages.length) {
        if (loopMessage) {
          updateIdx(0);
          updateChar(0);
        } else {
          setIsActive(false);
        }
      } else {
        updateMessage(messages[newIdx].slice(0, newChar));
        updateIdx(newIdx);
        updateChar(newChar + 1);
      }
    },
    isActive ? delay : null,
  );

  return (
    <div
      className="inline-container"
      style={validateEmail(message) ? {} : { color: 'red' }}
      onMouseEnter={() => setIsActive(false)}
      onMouseLeave={() => idx < messages.length && setIsActive(true)}
    >
      <a href={validateEmail(message) ? `mailto:${message}` : ''}>
        <span>{message}</span>
      </a>
    </div>
  );
};

EmailLink.defaultProps = {
  loopMessage: false,
};

EmailLink.propTypes = {
  loopMessage: PropTypes.bool,
};

export default EmailLink;
