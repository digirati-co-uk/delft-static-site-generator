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

  renderCanvasBody = (canvas, pageLanguage) => (
    <React.Fragment>
      {canvas.thumbnail && canvas.thumbnail.length > 0 ? (
        <AnnotationBodyRenderer
          body={canvas.thumbnail[0]}
          pageLanguage={pageLanguage}
        />
      ) : (
        canvas.items &&
        (canvas.items[0].items || []).map((annotation, idx) =>
          this.renderAnnotation(
            annotation,
            `canvas_items__${idx}`,
            pageLanguage,
            canvas
          )
        )
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

  getBlockClasses = canvas =>
    canvas.behavior && canvas.behavior.length > 0
      ? `block cutcorners ${canvas.behavior.join(' ')}${
          canvas.summary ? '' : ' image'
        }`
      : `block cutcorners w-8 h-8 image${canvas.summary ? '' : ' image'}`;

  getBlockImageClasses = canvas => {
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
              newCls = `h-${parseInt(cls.substr(2), 10) -
                Math.ceil(parseInt(cls.substr(2), 10) / 4)}`;
            }
            if (blockClasses.indexOf('row') !== -1 && cls.indexOf('w-') === 0) {
              newCls = `w-${parseInt(cls.substr(2), 10) -
                Math.ceil(parseInt(cls.substr(2), 10) / 3)}`;
            }
            textClasses.push(newCls);
          }
          return textClasses;
        },
        ['block', 'image', 'cutcorners']
      )
      .join(' ');
  };

  getCanvasPhysicalSize = canvas =>
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

  getBlockTextClasses = canvas => {
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
              newCls = `h-${Math.ceil(parseInt(cls.substr(2), 10) / 4)}`;
            }
            if (blockClasses.indexOf('row') !== -1 && cls.indexOf('w-') === 0) {
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

  getBlockArrowClasses = canvas => {
    const blockClasses = this.getBlockClasses(canvas).split(' ');
    if (blockClasses.indexOf('column') !== -1) {
      return 'arrow up';
    }
    if (blockClasses.indexOf('caption-left') !== -1) {
      return 'arrow right';
    }
    return 'arrow left';
  };

  render() {
    const { pageContext: manifest, path } = this.props;
    const pageLanguage = getPageLanguage(path);
    const { renderCanvasModal } = this.state;
    return (
      <Layout language={pageLanguage} path={path}>
        <main>
          <div className="blocks">
            <div className="block title cutcorners w-4 h-4 ">
              <div className="boxtitle">EXHIBITION</div>
              <div className="maintitle">
                {translate(manifest.label, pageLanguage)}
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
                        .map(paragraph => (
                          <p key={`about__${idx}`}>{paragraph}</p>
                        ))}
                      <p>
                        <button
                          className="readmore"
                          onClick={this.showCanvasDetails(canvas)}
                        >
                          Read More
                        </button>
                      </p>
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
                            this.renderCanvasBody(canvas, pageLanguage)
                          )}
                        </div>
                        <div className={this.getBlockTextClasses(canvas)}>
                          <div className={this.getBlockArrowClasses(canvas)}>
                            <Arrow />
                          </div>
                          <div className="text">
                            <p>{translate(canvas.label, pageLanguage)}</p>
                            <p>{translate(canvas.summary, pageLanguage)}</p>
                            {canvas.requiredStatement && (
                              <p className="facts">
                                {translate(
                                  canvas.requiredStatement.value,
                                  pageLanguage
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {this.renderMediaHolder(
                          canvas,
                          this.renderCanvasBody(canvas, pageLanguage)
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
        {/* <p>DEBUG pageContext:</p>
        <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </Layout>
    );
  }
}

ExhibitionPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default ExhibitionPage;
