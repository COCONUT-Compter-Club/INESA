export const createObserver = (animationFuncs) => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
  
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.id;
          if (animationFuncs[elementId]) {
            animationFuncs[elementId](true);
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  };
  
  export const observeElements = (selector, observer) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      observer.observe(element);
    });
  };