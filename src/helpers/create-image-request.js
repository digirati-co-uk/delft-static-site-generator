import {
  createImageServiceRequest,
  imageServiceRequestToString,
} from '@iiif/parser/image-3';

export function createImageRequest(service, size, region, quality = 'default') {
  const request = createImageServiceRequest(service);
  return imageServiceRequestToString({
    identifier: request.identifier,
    server: request.server,
    scheme: request.scheme,
    type: 'image',
    size: {
      max: !size?.width && !size?.height,
      confined: false,
      upscaled: false,
      ...(size || {}),
    },
    format: 'jpg',
    // This isn't how it should be modelled, always full,
    // region: data.selector ? data.selector : { full: true },
    region: region ? { full: false, ...region } : { full: true },
    rotation: { angle: 0 },
    quality,
    prefix: request.prefix,
    originalPath: request.originalPath,
  });
}
