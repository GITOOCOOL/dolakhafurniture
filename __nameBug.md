# The `__name` Reference Error (Cloudflare/OpenNext)

## Incident Report: 2026-04-22

### Symptoms
- Production Storefront crashes or shows `ReferenceError: name is not defined` (or `__name is not defined`) in the browser console.
- Inlined scripts (like `next-themes`) are mangled with calls to a helper function `__name(fn, "name")`.
- Site works perfectly on `localhost` but fails only in the Cloudflare Pages environment.

### Root Cause
This is a **Build Pipeline Regression**. 
1. The project uses `@opennextjs/cloudflare` to bridge Next.js and Cloudflare Workers.
2. Under the hood, this tool uses `esbuild` to bundle the application code.
3. Newer versions of `esbuild` (0.20+) and certain configurations of `opennext` (specifically patches `1.19.2` and `1.19.3`) inject a helper function called `__name` to preserve function names for debugging/minification.
4. When `next-themes` or other libraries generate inline scripts for the browser, this helper `__name` is injected into the script tag, but the helper itself is NOT defined in the browser global scope.
5. Result: The browser hits `__name(...)` and dies.

### The Fix
**Pinning the Build Tooling.** 
We changed `@opennextjs/cloudflare` from `^1.19.1` to exactly `1.19.1`. 

> [!IMPORTANT]
> **NEVER use carets (^) for `@opennextjs/cloudflare` in this repository.** This project is highly sensitive to the exact bundling behavior of the Cloudflare/OpenNext pipeline. Any "silent" update to the build tool can break the storefront without any code changes being made to the source.

### Prevention
1. Always use exact versions for build-critical dependencies.
2. If this happens again, the first step is to check if a new version of the builder tool was released since the last successful build.
3. Check the page source for `__name` calls in inline scripts.
