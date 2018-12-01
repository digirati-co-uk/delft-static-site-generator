import React from 'react';
import Layout from '../../components/Layout/layout';
import CanvasModal from '../../components/CanvasModal/CanvasModal';
import { getTranslation } from '../../utils';


const filterToPreferredChoices = choices => {
  return choices.filter(
    choice => 
      !choice.hasOwnProperty('language') || 
      (choice.hasOwnProperty('language') && choice.language === 'en')
  );
}

const IIIFImageAnnotationCover = ({body, position}) => body.service ? (
  <img 
    src={body.service[0].id.replace('info.json','') + '/full/full/0/default.jpg'} 
    style={position}
    alt=""
  />
) : (
  <img 
    src={body.id} style={position} 
    alt=""
  />
);

const IIIFVideoAnnotationCover = ({body, position}) => (
  <div style={position}>
    <video
      src={body.id} 
      width={'100%'/*body.width*/} 
      height={'100%'/*body.height*/} 
      controls 
      style={{
        width: '100%',
        height: '100%'
        //objectFit: 'cover'
    }}
    >
    </video>
  </div>
);

const IIIFTextAnnotationCover = ({body, position}) => (
  <div style={position}>
    {body.value}
  </div>
);

const xywhResolver = (annotation, canvas) => {
  const xywhMatch = annotation.target.match(
    /xywh=(\d+),(\d+),(\d+),(\d+)/
  );
  if (xywhMatch) {
    const [_xywh, _x, _y, _w, _h] = xywhMatch;
    return {
      position: 'absolute',
      left: (parseInt(_x, 10)/canvas.width*100) + '%',
      top: (parseInt(_y, 10)/canvas.height*100) + '%',
      width: (parseInt(_w, 10)/canvas.width*100) + '%',
      height: (parseInt(_h, 10)/canvas.height*100) + '%',
      margin: 0,
      padding: 0,
    }
  } else {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
    }
  }
}

const AnnotationBodyRenderer = ({body, position}) => (
  <>
    {body.type==="Text" && (
      <IIIFTextAnnotationCover style={position} body={body} />
    )}
    {body.type==="Image" && (
      <IIIFImageAnnotationCover body={body} position={position}/>
    )}
    {body.type==="Video" && (
      <IIIFVideoAnnotationCover  body={body} position={position} />
    )}
    {body.type === "Choice" && (
      filterToPreferredChoices(body.items).map(
        choice => <AnnotationBodyRenderer body={choice} position={position}/>
      )
    )}
  </>
);

class ExhibitionPage extends React.Component {
  state = {
    selectedCanvas: null,
  };

  showCanvasDetails = canvas => () => {
    this.setState({
      selectedCanvas: canvas,
    });
  };
  
  hideCanvasDetails = () => {
    this.setState({
      selectedCanvas: null,
    })
  };

  renderAnnotationBody = (canvas) => (
    <>
    {canvas.items &&
      (canvas.items[0].items || []).map(
        annotation=> (
          annotation.motivation === 'painting' 
            ? <AnnotationBodyRenderer body={annotation.body} position={xywhResolver(annotation, canvas)} />
            : <div 
                style={
                  Object.assign(
                    xywhResolver(annotation, canvas),
                    {border: '2px dashed red'}
                  )} 
                title={
                  (annotation.label 
                    ? annotation.label.en || [] : []).join('')
                } />
        ))
    }
    {canvas.annotations &&
      (canvas.annotations[0].items || []).map(
        annotation=> (
          annotation.motivation === 'painting' 
            ? <AnnotationBodyRenderer body={annotation.body} position={xywhResolver(annotation, canvas)} />
            : <div 
                style={
                  Object.assign(
                    xywhResolver(annotation, canvas),
                    {border: '2px dashed red'}
                  )} 
                title={
                  (annotation.label 
                    ? annotation.label.en || [] : []).join('')
                } />
        ))
    }
    </>
  )

  renderMediaHolder = (canvas, content) => (
    <div className="canvas-preview">
      <div
        style={{
          width: '100%',
          height: '100%',
          // This doesn't work
          // padding: '0 ' + (
          //   canvas.height > canvas.width 
          //     ? ((canvas.height - canvas.width )/ 2 / canvas.width * 100) + '%'
          //     : 0),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={this.showCanvasDetails(canvas)}
      >
        <div
          style={{
            width: '100%', 
            height: 0,
            position: 'relative',
            paddingBottom: (canvas.height/canvas.width * 100) + '%', 
            background: 'lightgray',
          }}
        >
          {content}
        </div>
      </div>
    </div>
  )

  getBlockClasses = canvas => 
    canvas.behaviours && 
    canvas.behaviours.length > 0 
      ? 'block cutcorners ' + canvas.behaviours.join(' ') + (canvas.summary ? '' : ' image')
      : 'block cutcorners w-8 h-8 image' + (canvas.summary ? '' : ' image')
  
  getBlockImageClasses = canvas => {
    const blockClasses = this.getBlockClasses(canvas).split(' ');
    return blockClasses.reduce((textClasses, cls) => {
      if (['column', 'block', 'cutcorners', 'caption-left', 'row', 'column'].indexOf(cls) === -1) {
        let newCls = cls;
        if(blockClasses.indexOf('column') !== -1 && cls.indexOf('h-')===0) {
          newCls = 'h-' + (parseInt(cls.substr(2), 10) - (Math.ceil(parseInt(cls.substr(2), 10)/4)));
        } if(blockClasses.indexOf('row') !== -1 && cls.indexOf('w-')===0) {
          newCls = 'w-' + (parseInt(cls.substr(2), 10) - Math.ceil(parseInt(cls.substr(2), 10)/3));
        }
        textClasses.push(newCls);
      }
      return textClasses;
    }, ['block', 'image', 'cutcorners']).join(' ')
  }

  getBlockTextClasses = canvas => {
    const blockClasses = this.getBlockClasses(canvas).split(' ');
    return blockClasses.reduce((textClasses, cls) => {
      if (['column', 'block', 'cutcorners', 'caption-left', 'row', 'column'].indexOf(cls) === -1) {
        let newCls = cls;
        if(blockClasses.indexOf('column') !== -1 && cls.indexOf('h-')===0) {
          newCls = 'h-' + Math.ceil(parseInt(cls.substr(2), 10)/4);
        } if(blockClasses.indexOf('row') !== -1 && cls.indexOf('w-')===0) {
          newCls = 'w-' + Math.ceil(parseInt(cls.substr(2), 10)/3);
        }
        textClasses.push(newCls);
      }
      return textClasses;
    }, ['block', 'info', 'cutcorners']).join(' ')
  };

  getBlockArrowClasses = canvas => {
    const blockClasses = this.getBlockClasses(canvas).split(' ');
    if (blockClasses.indexOf('column') !== -1) {
      return 'arrow up';
    } else if (blockClasses.indexOf('caption-left') !== -1) {
      return 'arrow right';
    } else {
      return 'arrow left';      
    }
  };

  render() {
    const manifest = this.props.pageContext;
    return (
      <Layout>
        <main>
          <div class="blocks">
            <div class="block title cutcorners w-4 h-4 ">
              <div class="boxtitle">EXHIBITION</div>
					    <div class="maintitle">{getTranslation(manifest.label, 'en')}</div>
              <div />
            </div>
            <div class="block cutcorners w-8 h-8 image">
              {this.renderMediaHolder(manifest.items[0], this.renderAnnotationBody(manifest.items[0]))}
              <div class="caption">{(manifest.items[0].label ? manifest.items[0].label.en ||[] : []).join('')}</div>
            </div>
            <div class="block info cutcorners w-4 h-4">
              <div class="boxtitle">ABOUT</div>
              <div class="text">
                { getTranslation(manifest.summary, 'en', '\n')
                    .split('\n')
                    .map(paragraph=><p>{paragraph}</p>)}
                <p><a class="readmore" href="">Read More</a></p>
              </div>
            </div>
            {manifest && manifest.items && manifest.items.map((canvas,index) => index==0 ? '' : (
              <div 
                className={this.getBlockClasses(canvas)}
              >
                {
                  canvas.summary 
                  ? (
                    <>
                      <div className={this.getBlockImageClasses(canvas)}>
                        {this.renderMediaHolder(canvas, this.renderAnnotationBody(canvas))}
                      </div>
                      <div className={this.getBlockTextClasses(canvas)}>
                        <div className={this.getBlockArrowClasses(canvas)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                          </svg>
                        </div>
                        <div className="text">
                          <p>{(canvas.label ? canvas.label.en ||[] : []).join('')}</p>
                          <p>{(canvas.summary ? canvas.summary.en ||[] : []).join('')}</p>
                          <p className="facts">{(canvas.requiredStatement && canvas.requiredStatement.value ? canvas.requiredStatement.value.en ||[] : []).join('')}</p>
                        </div>
                      </div>
                    </>
                  ) 
                  : (
                    <>
                    {this.renderMediaHolder(canvas, this.renderAnnotationBody(canvas))}
                    <div class="caption">{(canvas.label ? canvas.label.en ||[] : []).join('')}</div>
                    </>
                  )
                }
              </div>
            ))}
          </div>
        </main>
        <CanvasModal canvas={this.state.selectedCanvas} manifest={manifest} hideCanvasDetails={this.hideCanvasDetails} />
        {/* <p>DEBUG pageContext:</p>
        <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </Layout>
    )
  };
} 

export default ExhibitionPage;
