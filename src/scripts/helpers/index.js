

exports.jsEnabled = () => {
  const html = document.querySelector('html');
  const enabled = () => {
    const c = html.className.split(' ').map((klass) => {
      return (klass === 'no-js' ? 'js' : klass); 
    });
    return c.join(' ');
  };  
  html.className = enabled();
  return true;
};

// via: http://stackoverflow.com/a/1714899
function serialize(obj, prefix) {
  var str = [];
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      let k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
      str.push(typeof v === 'object' ? serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }
  return str.join('&');
};

exports.serialize = serialize;