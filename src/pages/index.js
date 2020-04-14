import Redirect from 'umi/redirect';
import Authorized from '../utils/Authorized';
const { AuthorizedRoute } = Authorized;

export default () => (
  <AuthorizedRoute
    path="/"
    render={() => <Redirect to='/workplace'/>}
    authority={['ROLE_ADMIN', 'ROLE_USER']}
    redirectPath="/passport/sign-in"
  />
)

