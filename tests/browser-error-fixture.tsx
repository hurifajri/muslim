import { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import PageError from '@/app/error';
import GlobalError from '@/app/global-error';

let shouldFail = true;

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  retry = () => {
    shouldFail = false;
    this.setState({ failed: false });
  };
  render() {
    if (!this.state.failed) return this.props.children;
    if (location.search.includes('global'))
      return <GlobalError retry={this.retry} />;
    return (
      <html lang="id">
        <body>
          <PageError retry={this.retry} />
        </body>
      </html>
    );
  }
}

function FailingRoot() {
  if (shouldFail) throw new Error('Private fixture failure');
  return (
    <html lang="id">
      <body>
        <main>Halaman pulih.</main>
      </body>
    </html>
  );
}

createRoot(document).render(
  <Boundary>
    <FailingRoot />
  </Boundary>
);
