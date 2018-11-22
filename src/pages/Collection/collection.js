import React from 'react';
import Layout from '../../components/Layout/layout';

const CollectionPage = (props) => (
  <Layout>
      <h2>This is a collection page</h2>
      <pre>{JSON.stringify(props, null, 2)}</pre>
  </Layout>
);

export default CollectionPage;

