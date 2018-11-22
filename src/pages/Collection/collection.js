import React from 'react';
import Layout from '../../components/Layout/layout';
import SlideShow from '../../components/SlideShow/slideshow';

const CollectionPage = ({pageContext, ...props}) => (
  <Layout>
    <h2>{pageContext.metadata.filter(item=>item.label=='Title').map(item=>item.value).join(' ')}</h2>
    <div style={{ width: '100vw', height: '80vh' }}>
      <SlideShow jsonld={pageContext}/>
    </div>
    <section>
      <h3>Part of Collections</h3>
      <ul>
        <li>Test collection</li>
      </ul>
    </section>
    <section>
      <h3>Part of Exhibitions</h3>
      <ul>
        <li>Test Exhibition</li>
      </ul>
    </section>
    {/* debug: <pre>{JSON.stringify(props, null, 2)}</pre> */}
  </Layout>
);

export default CollectionPage;

