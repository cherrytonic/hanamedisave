import { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

function ReactPortal({ children, wrapperId = "portal-root" }) {
  const [wrapperElement, setWrapperElement] = useState(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    if (!element) {
      element = document.createElement('div');
      element.setAttribute('id', wrapperId);
      document.body.appendChild(element);
    }
    setWrapperElement(element);

    return () => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
}
export default ReactPortal;