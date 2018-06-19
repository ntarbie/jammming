import React from 'react';

class Component extends React.Component {
  _bind(...methods) {
    methods.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }
}

export default Component;
