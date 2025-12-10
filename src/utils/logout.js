export function logout() {
  sessionStorage.removeItem("user");
  window.location.href = "/login";
}
