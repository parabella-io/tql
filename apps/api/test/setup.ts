import { auth } from '../src/auth';

export let authToken: string | null = null;

export let authUserId: string | null = null;

(async () => {
  const response = await auth.api.signInEmail({
    body: {
      email: 'john@gmail.com',
      password: 'password',
    },
    returnHeaders: true,
  });

  const jwtToken = response.headers.get('set-auth-token') as string;

  authToken = jwtToken;

  authUserId = response.response.user.id;
})();
