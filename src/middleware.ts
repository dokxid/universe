import {authkitMiddleware} from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();

// Match against pages that require authentication
export const config = {matcher: ['/', '/account']};
