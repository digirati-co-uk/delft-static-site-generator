import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout/layout';
import DynamicCanvasModal from '../../components/CanvasModal/DynamicCanvasModal';
import GithubLink from '../../components/GithubLink/GithubLink';
import { IIIFLink } from '../../components/IIIFLink/IIIFLink';
import { Arrow } from '../../components/Arrow/Arrow';
import { getTranslation as translate, getPageLanguage } from '../../utils';
import { AnnotationBodyRenderer } from '../../components/AnnotationBodyRenderer/AnnotationBodyRenderer';

const xywhResolver = (annotation, canvas) => {
  if (annotation.target) {
    const xywhMatch = annotation.target.match(/xywh=(\d+),(\d+),(\d+),(\d+)/);
    if (xywhMatch) {
      const _x = parseInt(xywhMatch[1], 10);
      const _y = parseInt(xywhMatch[2], 10);
      const _w = parseInt(xywhMatch[3], 10);
      const _h = parseInt(xywhMatch[4], 10);
      return {
        position: 'absolute',
        left: `${(_x / canvas.width) * 100}%`,
        top: `${(_y / canvas.height) * 100}%`,
        width: `${(_w / canvas.width) * 100}%`,
        height: `${(_h / canvas.height) * 100}%`,
        margin: 0,
        padding: 0,
      };
    }
  }

  return {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  };
};

const EXHIBITION_BEHAVIOURS = [
  'column',
  'block',
  'cutcorners',
  'caption-left',
  'left',
  'bottom',
  'row',
  'column',
];

class ExhibitionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderCanvasModal: '',
    };
  }

  showCanvasDetails = (canvas, annotationDetails) => () => {
    const { pageContext: manifest, path } = this.props;
    const pageLanguage = getPageLanguage(path);
    this.setState({
      renderCanvasModal: (
        <DynamicCanvasModal
          selectedCanvas={canvas}
          manifest={manifest}
          hideCanvasDetails={this.hideCanvasDetails}
          pageLanguage={pageLanguage}
          annotationDetails={annotationDetails}
        />
      ),
    });
  };

  hideCanvasDetails = () => {
    this.setState({
      renderCanvasModal: '',
    });
  };

  renderAnnotation = (annotation, key, pageLanguage, canvas) =>
    annotation.motivation === 'painting' ? (
      <AnnotationBodyRenderer
        key={key}
        body={annotation.body}
        annotation={annotation}
        canvas={canvas}
        position={xywhResolver(annotation, canvas)}
        pageLanguage={pageLanguage}
        canvasSize={this.getCanvasPhysicalSize(canvas)}
      />
    ) : (
      <div
        key={key}
        style={Object.assign(xywhResolver(annotation, canvas), {
          border: '2px dashed red',
        })}
        title={translate(annotation.label, pageLanguage)}
      />
    );

  renderCanvasBody = (canvas, pageLanguage, firstCanvas) => (
    <React.Fragment>
      {canvas.thumbnail && canvas.thumbnail.length > 0 ? (
        <>
          <div style={{ display: 'none' }} data-typesense-field="image">
            {canvas.thumbnail[0].id}
          </div>
          <AnnotationBodyRenderer
            body={canvas.thumbnail[0]}
            pageLanguage={pageLanguage}
          />
        </>
      ) : (
        canvas.items &&
        (canvas.items[0].items || []).map((annotation, idx) => (
          <>
            {idx === 0 && firstCanvas && (
              <div style={{ display: 'none' }} data-typesense-field="image">
                {annotation.body.id}
              </div>
            )}
            {this.renderAnnotation(
              annotation,
              `canvas_items__${idx}`,
              pageLanguage,
              canvas
            )}
          </>
        ))
      )}
      {canvas.annotations &&
        (canvas.annotations[0].items || []).map((annotation, idx) =>
          this.renderAnnotation(
            annotation,
            `canvas_annotation__${idx}`,
            pageLanguage,
            canvas
          )
        )}
    </React.Fragment>
  );

  renderMediaHolder = (canvas, content) => (
    <div className="canvas-preview">
      <button
        className="canvas-preview__flex"
        onClick={this.showCanvasDetails(
          canvas,
          this.props.pageContext.annotationDetails
        )}
        style={{
          display: 'block',
        }}
        role="link"
        type="button"
      >
        <div
          style={{
            paddingBottom: `${(canvas.height / canvas.width) * 100}%`,
          }}
          className="canvas-preview__center"
        >
          {content}
        </div>
      </button>
    </div>
  );

  getBlockClasses = (canvas) =>
    canvas.behavior && canvas.behavior.length > 0
      ? `block cutcorners ${canvas.behavior.join(' ')}${
          canvas.summary ? '' : ' image'
        }`
      : `block cutcorners w-8 h-8 image${canvas.summary ? '' : ' image'}`;

  getBlockImageClasses = (canvas) => {
    const blockClasses = this.getBlockClasses(canvas).split(' ');
    return blockClasses
      .reduce(
        (textClasses, cls) => {
          if (EXHIBITION_BEHAVIOURS.indexOf(cls) === -1) {
            let newCls = cls;
            if (
              blockClasses.indexOf('column') !== -1 &&
              cls.indexOf('h-') === 0
            ) {
              newCls = `h-${
                parseInt(cls.substr(2), 10) -
                Math.ceil(parseInt(cls.substr(2), 10) / 4)
              }`;
            }
            if (blockClasses.indexOf('row') !== -1 && cls.indexOf('w-') === 0) {
              newCls = `w-${
                parseInt(cls.substr(2), 10) -
                Math.ceil(parseInt(cls.substr(2), 10) / 3)
              }`;
            }
            if (
              blockClasses.indexOf('left') !== -1 &&
              cls.indexOf('w-') === 0
            ) {
              newCls = `w-${
                parseInt(cls.substr(2), 10) -
                Math.ceil(parseInt(cls.substr(2), 10) / 3)
              }`;
            }
            if (
              blockClasses.indexOf('right') !== -1 &&
              cls.indexOf('w-') === 0
            ) {
              newCls = `w-${
                parseInt(cls.substr(2), 10) -
                Math.ceil(parseInt(cls.substr(2), 10) / 3)
              }`;
            }
            if (
              blockClasses.indexOf('bottom') !== -1 &&
              cls.indexOf('h-') === 0
            ) {
              newCls = `h-${
                parseInt(cls.substr(2), 10) -
                Math.ceil(parseInt(cls.substr(2), 10) / 4)
              }`;
            }
            textClasses.push(newCls);
          }
          return textClasses;
        },
        ['block', 'image', 'cutcorners']
      )
      .join(' ');
  };

  getCanvasPhysicalSize = (canvas) =>
    this.getBlockImageClasses(canvas)
      .split(' ')
      .reduce(
        (_canvasSize, className) => {
          if (className.startsWith('w-')) {
            _canvasSize.width = parseInt(className.substr(2), 10) * 100;
          } else if (className.startsWith('h-')) {
            _canvasSize.height = parseInt(className.substr(2), 10) * 100;
          }
          return _canvasSize;
        },
        {
          width: 1200,
          height: 1200,
        }
      );

  getBlockTextClasses = (canvas) => {
    const blockClasses = this.getBlockClasses(canvas).split(' ');
    return blockClasses
      .reduce(
        (textClasses, cls) => {
          if (EXHIBITION_BEHAVIOURS.indexOf(cls) === -1) {
            let newCls = cls;
            if (
              (blockClasses.indexOf('bottom') !== -1 ||
                blockClasses.indexOf('column') !== -1) &&
              cls.indexOf('h-') === 0
            ) {
              newCls = `h-${Math.ceil(parseInt(cls.substr(2), 10) / 4)}`;
            }
            if (
              (blockClasses.indexOf('left') !== -1 ||
                blockClasses.indexOf('row') !== -1 ||
                blockClasses.indexOf('right') !== -1) &&
              cls.indexOf('w-') === 0
            ) {
              newCls = `w-${Math.ceil(parseInt(cls.substr(2), 10) / 3)}`;
            }
            textClasses.push(newCls);
          }
          return textClasses;
        },
        ['block', 'info', 'cutcorners']
      )
      .join(' ');
  };

  getBlockArrowClasses = (canvas) => {
    const blockClasses = this.getBlockClasses(canvas).split(' ');
    if (blockClasses.includes('bottom') || blockClasses.includes('column')) {
      return 'arrow up';
    }
    if (
      blockClasses.includes('caption-left') ||
      blockClasses.includes('left')
    ) {
      return 'arrow right';
    }
    return 'arrow left';
  };

  getPageMetaData = () => {
    const summary = this.props.pageContext.label;
    const language = this.props.path.split('/')[1];
    const items = this.props.pageContext.items;
    let image =
      items &&
      items[0] &&
      items[0].items &&
      items[0].items[0] &&
      items[0].items[0].items &&
      items[0].items[0].items[0] &&
      items[0].items[0].items[0].thumbnail &&
      items[0].items[0].items[0].thumbnail[0] &&
      items[0].items[0].items[0].thumbnail[0].id
        ? items[0].items[0].items[0].thumbnail[0].id
        : null;

    // if no image, eg. first block sometimes an about block
    if (!image) {
      image =
        items &&
        items[1] &&
        items[1].items &&
        items[1].items[0] &&
        items[1].items[0].items &&
        items[1].items[0].items[0] &&
        items[1].items[0].items[0].thumbnail &&
        items[1].items[0].items[0].thumbnail[0] &&
        items[1].items[0].items[0].thumbnail[0].id
          ? items[1].items[0].items[0].thumbnail[0].id
          : null;
    }

    const meta = {
      image: image,
      description: summary && summary[language] ? summary[language][0] : null,
    };

    return meta;
  };

  render() {
    const { pageContext: manifest, path } = this.props;
    const pageLanguage = getPageLanguage(path);
    const { renderCanvasModal } = this.state;
    return (
      <Layout language={pageLanguage} path={path} meta={this.getPageMetaData()}>
        <main>
          <div style={{ display: 'none' }} data-typesense-field="type">
            exhibition
          </div>
          <div className="blocks">
            <div className="block title cutcorners w-4 h-4 ">
              <div className="boxtitle">
                {translate(
                  {
                    en: ['Exhibition'],
                    nl: ['Tentoonstelling'],
                  },
                  pageLanguage
                )}
              </div>
              <div className="maintitle">
                <div data-typesense-field="title">
                  {translate(manifest.label, pageLanguage)}
                </div>
                <GithubLink href={path} />
                <IIIFLink href={path} />
              </div>
              <div />
            </div>

            {manifest &&
              manifest.items &&
              manifest.items.map((canvas, idx) =>
                (canvas.behavior || []).indexOf('info') !== -1 ? (
                  <div className={this.getBlockClasses(canvas)}>
                    <div className="boxtitle">
                      {translate(
                        canvas.label || { en: ['About'], nl: ['Over'] },
                        pageLanguage,
                        '\n'
                      ).toUpperCase()}
                    </div>
                    <div className="text">
                      {translate(canvas.summary, pageLanguage, '\n')
                        .split('\n')
                        .map((paragraph) => (
                          <p
                            data-typesense-field="about"
                            key={`about__${paragraph}`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      {
                        <p>
                          <button
                            className="readmore"
                            onClick={this.showCanvasDetails(canvas)}
                          >
                            {translate(
                              {
                                en: ['Read more'],
                                nl: ['Verder lezen'],
                              },
                              pageLanguage
                            )}
                          </button>
                        </p>
                      }
                    </div>
                  </div>
                ) : (
                  <div
                    key={`manifest_item_${idx}`}
                    className={this.getBlockClasses(canvas)}
                  >
                    {canvas.summary ? (
                      <React.Fragment>
                        <div className={this.getBlockImageClasses(canvas)}>
                          {this.renderMediaHolder(
                            canvas,
                            this.renderCanvasBody(
                              canvas,
                              pageLanguage,
                              idx === 0
                            )
                          )}
                        </div>
                        <div className={this.getBlockTextClasses(canvas)}>
                          <div className={this.getBlockArrowClasses(canvas)}>
                            <Arrow />
                          </div>
                          <div className="heading">
                            <p>{translate(canvas.label, pageLanguage)}</p>
                          </div>
                          <div className="text">
                            <p data-typesense-field="content">
                              {translate(canvas.summary, pageLanguage, '\n')
                                .split('\n')
                                .map((paragraph) => (
                                  <p key={`about__${idx}`}>{paragraph}</p>
                                ))}
                            </p>
                            {canvas.requiredStatement && (
                              <div
                                className="facts"
                                data-typesense-field="content"
                              >
                                {translate(
                                  canvas.requiredStatement.value,
                                  pageLanguage
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {this.renderMediaHolder(
                          canvas,
                          this.renderCanvasBody(canvas, pageLanguage, idx === 0)
                        )}
                        <div className="caption">
                          {translate(canvas.label, pageLanguage)}
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                )
              )}
          </div>
        </main>
        {renderCanvasModal}
      </Layout>
    );
  }
}

ExhibitionPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default ExhibitionPage;
