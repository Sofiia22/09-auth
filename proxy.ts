import { NextRequest, NextResponse } from "next/server";

import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

const applySetCookie = (
  response: NextResponse,
  setCookie?: string | string[],
) => {
  if (!setCookie) {
    return;
  }

  const cookieHeaders = Array.isArray(setCookie) ? setCookie : [setCookie];

  cookieHeaders.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });
};

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (accessToken) {
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const sessionResponse = await checkSession();

      const response = isPublicRoute
        ? NextResponse.redirect(new URL("/", request.url))
        : NextResponse.next();

      applySetCookie(response, sessionResponse.headers["set-cookie"]);

      return response;
    } catch {
      const response = isPrivateRoute
        ? NextResponse.redirect(new URL("/sign-in", request.url))
        : NextResponse.next();

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    }
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
