import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Edit <code>src/frontend/routes/page.tsx</code> to get started.</p>
    </div>
  );
}
