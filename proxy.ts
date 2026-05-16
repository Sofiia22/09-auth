import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

const applySetCookie = (
  response: NextResponse,
  setCookie?: string | string[],
) => {
  if (!setCookie) return;

  const cookieHeaders = Array.isArray(setCookie) ? setCookie : [setCookie];

  cookieHeaders.forEach((cookieHeader) => {
    const parsed = parse(cookieHeader);

    const options = {
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      path: parsed.Path || "/",
      maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
    };

    if (parsed.accessToken) {
      response.cookies.set("accessToken", parsed.accessToken, options);
    }

    if (parsed.refreshToken) {
      response.cookies.set("refreshToken", parsed.refreshToken, options);
    }
  });
};

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set("accessToken", "", {
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set("refreshToken", "", {
    path: "/",
    expires: new Date(0),
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

      clearAuthCookies(response);

      return response;
    }
  }

  if (isPrivateRoute) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));

    clearAuthCookies(response);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
