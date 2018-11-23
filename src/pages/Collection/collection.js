import React from 'react';
import Layout from '../../components/Layout/layout';
import SlideShow from '../../components/SlideShow/slideshow';

class CollectionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderSlideShow: 'Loading...',
    };
  }

  componentDidMount() {
    // Client only hack
    this.setState({
      renderSlideShow: (<SlideShow jsonld={this.props.pageContext}/>) 
    });
  }
  render() {
    const { pageContext } = this.props;
    const { renderSlideShow } = this.state;
    return (
      <Layout>
        <h2>{pageContext && pageContext.metadata && pageContext.metadata.filter(item=>item.label=='Title').map(item=>item.value).join(' ')}</h2>
        <div id="slideshow" style={{ width: '100vw', height: '80vh' }}>
          { renderSlideShow }
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
    )
  }
}


export default CollectionPage;

