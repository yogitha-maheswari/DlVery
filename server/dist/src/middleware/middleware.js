"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
const cookies_1 = require("better-auth/cookies");
function middleware(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionCookie = (0, cookies_1.getSessionCookie)(request);
        // THIS IS NOT SECURE!
        // This is the recommended approach to optimistically redirect users
        // We recommend handling auth checks in each page/route
        if (!sessionCookie) {
            return server_1.NextResponse.redirect(new URL("/", request.url));
        }
        return server_1.NextResponse.next();
    });
}
exports.config = {
    matcher: ["/dashboard"], // Specify the routes the middleware applies to
};
