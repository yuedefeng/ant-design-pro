export function getToken() {
  return localStorage.getItem('authenticationToken') || sessionStorage.getItem('authenticationToken');
}

export function storeAuthenticationToken(jwt, rememberMe) {
  if (rememberMe) {
    localStorage.setItem('authenticationToken', jwt);
  } else {
    sessionStorage.setItem('authenticationToken', jwt);
  }
}

export function clearAuthenticationToken() {
  localStorage.removeItem('authenticationToken');
  sessionStorage.removeItem('authenticationToken');
}

export function getAccountFromJwt() {
  const jwt = getToken();
  if (jwt == null || jwt === undefined) {
    return null;
  } else {
    const encoded = jwt.split('.')[1];
    const payloads = JSON.parse(urlBase64Decode(encoded));
    payloads.authorities = payloads.auth.split(',');
    return payloads;
  }
}

export function urlBase64Decode(str) {
  let output = str.replace('-', '+').replace('_', '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default: {
      const error = new Error('非法Base64字符');
      throw error;
    }
  }
  return window.atob(output);
}
