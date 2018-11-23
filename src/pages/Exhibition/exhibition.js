import React from 'react';
import Layout from '../../components/Layout/layout';

const ExhibitionPage = (props) => (
  <Layout>
      <h2>This is a exhibit page (WIP)</h2>
      <p>DEBUG pageContext:</p>
      <pre>{JSON.stringify(props, null, 2)}</pre>
  </Layout>
);

export default ExhibitionPage;

