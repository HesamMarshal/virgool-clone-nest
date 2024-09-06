export function CookieOptions() {
  return {
    httpOnly: true,
    expires: new Date(Date.now() + 120000),
  };
}
