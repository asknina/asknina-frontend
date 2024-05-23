import type { NextRequest } from 'next/server'
import firebase from "firebase-admin"

// export function middleware(request: NextRequest) {
//     // firebase.initializeApp(config);

//     const currentUser = request.cookies.get('currentUser')?.value
//     // const currentUser = getAdditionalUserInfo()

//     if (currentUser && !request.nextUrl.pathname.startsWith('/login')) {
//         return Response.redirect(new URL('/', request.url))
//     }

//     if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
//         return Response.redirect(new URL('/login', request.url))
//     }
// }

// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }