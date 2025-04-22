<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class VerifyJwtToken
{
    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $token = substr($authHeader, 7); // Remove "Bearer "

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

            // Optionally attach user data to request
            $request->merge(['auth_user' => (array) $decoded]);

            return $next($request);
        } catch (Exception $e) {
            return response()->json(['message' => 'Invalid token', 'error' => $e->getMessage()], 401);
        }
    }
}


// namespace App\Http\Middleware;

// use Closure;
// use Illuminate\Http\Request;
// use Symfony\Component\HttpFoundation\Response;

// class VerifyJwtToken
// {
//     /**
//      * Handle an incoming request.
//      *
//      * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
//      */
//     public function handle(Request $request, Closure $next): Response
//     {
//         return $next($request);
//     }
// }