// This file is required to prevent a 404 on the /dashboard route
// when using parallel routes. It renders null for the @main slot.
export default function Default() {
  return null;
}
