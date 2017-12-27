import { getAccountFromJwt } from './token';

export function getRole() {
  const login = getAccountFromJwt();
  if (login) {
    return login.authorities;
  } else {
    return ['ROLE_GUEST'];
  }
}
