import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/shared/lib/auth";

export const Route = createFileRoute("/")({
  component: () => <></>,
  beforeLoad: async () => {
    const session = await authClient.getSession({});

    if (session.error) {
      throw redirect({ to: '/auth/sign-in', replace: true });
    }

    throw redirect({ to: '/app', replace: true });
  },
});

