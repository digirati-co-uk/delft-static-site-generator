import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout/layout';
import { Link } from 'gatsby';

import { getPageLanguage } from '../../utils';

const Publications = ({ data, path: pagePath, annos }) => {
  const pageLanguage = getPageLanguage(pagePath);
  return (
    <Layout
      language={pageLanguage}
      path={pagePath}
      meta={{ desciption: 'Publications' }}
    >
      <main>
        <div className="blocks">
          {data.allMarkdownRemark &&
            (data.allMarkdownRemark.edges || []).map((article) => {
              const { title, date, path, author } = article.node.frontmatter;
              return (
                <div className="block cutcorners w-4 h-4 article">
                  <Link to={path}>
                    <div className="boxtitle">{date || '[Date]'}</div>
                    <div className="maintitle">{title || '[Title]'}</div>
                    <div className="caption">{author || '[Author]'}</div>
                  </Link>
                </div>
              );
            })}
        </div>
      </main>
    </Layout>
  );
};

Publications.propTypes = {
  data: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default Publications;

export const pageQuery = graphql`
  query ($path: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { path: { regex: $path } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            path
            date
            author
          }
        }
      }
    }
    allSitePage {
      edges {
        node {
          id
          path
        }
      }
    }
  }
`;
