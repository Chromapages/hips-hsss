export const setAuthCookie = (token: string) => {
  const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
  document.cookie = `hips-auth-token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; ${secure} SameSite=Lax`;
};

export const removeAuthCookie = () => {
  document.cookie = `hips-auth-token=; Path=/; Max-Age=0; SameSite=Lax`;
};
