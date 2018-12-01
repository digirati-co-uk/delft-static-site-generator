import React from 'react';
import Layout from '../../components/Layout/layout';
import SlideShow from '../../components/SlideShow/slideshow';

class ObjectPage extends React.Component {
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
        <div id="slideshow" style={{ width: '100vw', height: '80vh' }}>
          { renderSlideShow }
        </div>
        <main>
          <h1>{pageContext && pageContext.metadata && pageContext.metadata.filter(item=>item.label==='Title').map(item=>item.value).join(' ')}</h1>
          {
            pageContext && 
            pageContext.metadata && 
            pageContext.metadata.filter(
              item=>item.label==='Description'
            ).map(
              item=>item.value
            )
            .join('\n')
            .split('\n')
            .map(
              paragraph=>(<p>{paragraph}</p>)
            )}
          <h2>Part of Collections</h2>
          <ul>
            <li>Test collection</li>
          </ul>
          <h2>Part of Exhibitions</h2>
          <ul>
            <li>Test Exhibition</li>
          </ul>
        </main>
        {/* debug: <pre>{JSON.stringify(props, null, 2)}</pre> */}
      </Layout>
    )
  }
}

export default ObjectPage;
