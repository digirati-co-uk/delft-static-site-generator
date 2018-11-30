import React from 'react';
import Layout from '../../components/Layout/layout';
import CanvasModal from '../../components/CanvasModal/CanvasModal';


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

  render() {
    const manifest = this.props.pageContext;
    return (
      <Layout>
        <h2>This is a exhibit page (WIP)</h2>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {manifest && manifest.items && manifest.items.map(canvas=> (
                <div
                  className={
                    canvas.behaviours && 
                    canvas.behaviours.length > 0 
                      ? canvas.behaviours.join(' ')
                      : 'listing-size-2-1'
                  }
                >
                  <div
                    style={{
                      width: canvas.summary ? '50%' : '100%', 
                      height: '100%', 
                      overflow: 'hidden', 
                      position: 'absolute',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: '0 ' + (
                          canvas.height > canvas.width 
                            ? ((canvas.height - canvas.width )/ 2 / canvas.width * 100) + '%'
                            : 0),
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
                        {!canvas.summary && (
                          <div
                            style={{
                              position: 'absolute',
                              top:0,
                              left:0,
                              bottom: 0,
                              right: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              pointerEvents: 'none',
                                                            }}
                          > <h2>{(canvas.label ? canvas.label.en ||[] : []).join('')}</h2>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {canvas.summary && (
                    <div style={{ position: 'absolute', left: '50%',width: '50%', boxSizing: 'border-box', padding: 32}}>
                      <h2>{(canvas.label ? canvas.label.en ||[] : []).join('')}</h2>
                      <p>{(canvas.summary ? canvas.summary.en ||[] : []).join('')}</p>
                      <a>Read More</a>
                    </div>
                  )}
                </div>
            ))}
        </div>
        <CanvasModal canvas={this.state.selectedCanvas} manifest={manifest} hideCanvasDetails={this.hideCanvasDetails} />
        {/* <p>DEBUG pageContext:</p>
        <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
      </Layout>
    )
  };
} 

export default ExhibitionPage;

