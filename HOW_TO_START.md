# Setup and Start Project

Follow these steps to get your project up and running:

1. **Start Docker services**

   ```sh
   docker compose up -d
   ```

2. **Install dependencies**

   ```sh
   pnpm i
   ```

3. **Push database schema**

   ```sh
   pnpm db:push
   ```

4. **Start development server**

   ```sh
   pnpm dev
   ```

All commands should be run from the root of the repository.
