// export { default } from "next-auth/middleware"
import {withAuth} from "next-auth/middleware"
// export const config = { matcher: ["/","/accounts","/contact","/stats"] }
export default withAuth({
    callbacks: {
      authorized: ({ req, token }) =>
        req.nextUrl.pathname?.slice(0, 5) === '/api/' ||
        req.nextUrl.pathname === '/login' ||
        !!token,
    }
  });