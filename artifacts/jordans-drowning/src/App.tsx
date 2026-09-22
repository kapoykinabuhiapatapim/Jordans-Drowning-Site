import { useMemo, useState } from 'react';

import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

import NotFound from '@/pages/not-found';

type ImportedPage = 'index.html' | 'finaljordan(1).html';

function staticRoot() {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}imported/`;
}

function ImportedPageFrame({ page }: { page: ImportedPage }) {
  const [loaded, setLoaded] = useState(false);
  const src = useMemo(() => `${staticRoot()}${page}`, [page]);

  return (
    <main className="imported-site-shell">
      {!loaded && (
        <div className="imported-site-loading" role="status" data-testid="status-loading-imported-site">
          Loading Jordan&apos;s Drowning…
        </div>
      )}
      <iframe
        className="imported-site-frame"
        title={page === 'index.html' ? "Jordan's Drowning Story" : "Jordan's Drowning interactive deep dive"}
        src={src}
        onLoad={() => setLoaded(true)}
        loading="eager"
        referrerPolicy="no-referrer"
        data-testid={`iframe-${page.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
      />
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ImportedPageFrame page="index.html" />} />
      <Route path="/index.html" component={() => <ImportedPageFrame page="index.html" />} />
      <Route component={LiteralPageRouter} />
    </Switch>
  );
}

function LiteralPageRouter() {
  const [location] = useLocation();
  const normalizedLocation = decodeURIComponent(location);

  if (normalizedLocation.endsWith('/finaljordan(1).html')) {
    return <ImportedPageFrame page="finaljordan(1).html" />;
  }

  return <NotFound />;
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
