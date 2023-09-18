import React from 'react';

export function InfoPanel(props) {
  const canvas = props.canvas;
  const bodies = canvas.items[0].items[0].body;

  const body =
    bodies.find((body) => body.language === props.language) || bodies[0];

  if (body && body.format === 'text/html') {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: body.value }} />
      </>
    );
  }

  return null;
}
