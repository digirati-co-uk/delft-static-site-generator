import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout/layout';
import { getPageLanguage } from '../../utils';

class CanvasPage extends React.Component {
  getPageMetaData = () => {
    let description = '';
    if (this.props.location.pathname.includes('/en/')) {
      this.props.pageContext.metadata.map(property => {
        if (property.label.en[0] === 'Title') {
          description = property.value.en[0];
        }
      });
    } else if (this.props.location.pathname.includes('/nl/')) {
      this.props.pageContext.metadata.map(property => {
        if (property.label.nl[0] === 'Titel') {
          description = property.value.nl[0];
        }
      });
    }

    const meta = {
      image: this.props.pageContext.image,
      description: description,
    };
    return meta;
  };

  render() {
    const { path } = this.props;
    const pageLanguage = getPageLanguage(path);

    return (
      <Layout
        language={pageLanguage}
        path={path}
        meta={this.getPageMetaData()}
      ></Layout>
    );
  }
}

CanvasPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default CanvasPage;
