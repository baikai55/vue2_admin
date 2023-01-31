import Cookies from "js-cookie";

function getCookie(cookie) {
  return Cookies.get(cookie);
}

function setCookie(name, cookie) {
  return Cookies.set(name, cookie);
}

function removeCookie(name) {
  return Cookies.remove(name);
}
export { getCookie, setCookie, removeCookie };
