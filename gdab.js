window.onbeforeunload = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  setTimeout(function() {
    window.stop();
  }, 1);
};

const originalWindowOpen = window.open;
window.open = function() {
  return null;
};

window.confirm = function() {
  return false;
};

window.alert = function(message) {
};

const currentDomain = window.location.hostname;

function isSameDomain(url) {
  if (!url) return true;
  try {
    if (url.startsWith('/') || !url.includes('://')) {
      return true;
    }
    
    const urlObj = new URL(url);
    return urlObj.hostname === currentDomain;
  } catch (e) {
    return false;
  }
}

const originalFetch = window.fetch;
window.fetch = function(resource, options) {
  const url = typeof resource === 'string' ? resource : resource.url;
  
  if (isSameDomain(url)) {
    return originalFetch.apply(this, arguments);
  } else {
    console.log("Blocked external fetch request to:", url);
    return new Promise((resolve, reject) => {
      reject(new Error("External network request blocked"));
    });
  }
};

const originalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
  const xhr = new originalXHR();
  const originalOpen = xhr.open;
  
  xhr.open = function(method, url, ...rest) {
    xhr._blockedUrl = !isSameDomain(url) ? url : null;
    return originalOpen.apply(this, [method, url, ...rest]);
  };
  
  const originalSend = xhr.send;
  xhr.send = function(body) {
    if (xhr._blockedUrl) {
      console.log("Blocked external XHR request to:", xhr._blockedUrl);
      Object.defineProperty(this, 'status', { value: 0 });
      Object.defineProperty(this, 'statusText', { value: 'Error' });
      
      setTimeout(() => {
        const errorEvent = new Event('error');
        this.dispatchEvent(errorEvent);
      }, 0);
      
      return;
    }
    return originalSend.apply(this, arguments);
  };
  
  return xhr;
};

const originalImage = window.Image;
window.Image = function() {
  const img = new originalImage();
  const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  
  Object.defineProperty(img, 'src', {
    set: function(value) {
      if (isSameDomain(value)) {
        originalSrcDescriptor.set.call(this, value);
      } else {
        console.log("Blocked external image loading:", value);
      }
    },
    get: function() {
      return originalSrcDescriptor.get.call(this);
    }
  });
  
  return img;
};

const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
  const element = originalCreateElement.call(document, tagName);
  
  if (tagName.toLowerCase() === 'script') {
    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
    
    Object.defineProperty(element, 'src', {
      set: function(value) {
        if (isSameDomain(value)) {
          originalSrcDescriptor.set.call(this, value);
        } else {
          console.log("Blocked external script loading:", value);
        }
      },
      get: function() {
        return originalSrcDescriptor.get.call(this);
      }
    });
  }
  
  if (tagName.toLowerCase() === 'iframe') {
    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
    
    Object.defineProperty(element, 'src', {
      set: function(value) {
        if (isSameDomain(value)) {
          originalSrcDescriptor.set.call(this, value);
        } else {
          console.log("Blocked external iframe loading:", value);
        }
      },
      get: function() {
        return originalSrcDescriptor.get.call(this);
      }
    });
  }
  
  return element;
};

const originalSendBeacon = navigator.sendBeacon;
navigator.sendBeacon = function(url, data) {
  if (isSameDomain(url)) {
    return originalSendBeacon.call(this, url, data);
  } else {
    console.log("Blocked external beacon request to:", url);
    return false;
  }
};

const originalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {
  if (isSameDomain(url)) {
    return new originalWebSocket(url, protocols);
  } else {
    console.log("Blocked external WebSocket connection to:", url);
    return {
      send: function() {},
      close: function() {},
      addEventListener: function() {}
    };
  }
};

console.log(
  "%cGDAB is running!", 
  "color: white; " +
  "background-color: black; " +
  "font-size: 22px; " +
  "text-align: center; " +
  "display: block; " +
  "padding: 10px"
);

console.log(
  "%cGameDistribution-AntiBlock BETA, by syncintellect @ github, and forked/improved by endlessguyin on github", 
  "color: white; " +
  "background-color: black; " +
  "font-size: 12px; " +
  "text-align: center; " +
  "display: block; " + 
  "padding: 10px"
);
