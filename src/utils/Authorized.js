import RenderAuthorized from '../components/Authorized';
import { getRole } from './role';

const Authorized = RenderAuthorized(getRole());
export default Authorized;
