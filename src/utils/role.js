import { getAccountFromJwt } from './token';

export function getRole() {
  const login = getAccountFromJwt();
  if (login) {
    if (login.authorities && login.authorities[0].length > 0) {
      return login.authorities;
    } else {
      return 'ROLE_GUEST';
    }
  } else {
    return 'ROLE_GUEST';
  }
}
