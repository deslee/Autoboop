export function calculateImageDimensions(params: {
  containerWidth: number; containerHeight: number;
  catWidth: number; catHeight: number; catX: number; catY: number;
  cursorX: number; cursorY: number; zoom: number; fileName: string;
}): { width: number; height: number; top: number; left: number; calculated_zoom: number; cat_id: string; } {
  // mouse position in pixels
  const mouseX = params.containerWidth * params.cursorX / 100;
  const mouseY = params.containerHeight * params.cursorY / 100;

  // image width, height in pixels
  let imageWidth, imageHeight;

  if (params.containerWidth > params.containerHeight) {
    // landscape
    imageWidth = params.containerWidth * params.zoom;
    imageHeight = params.catHeight / params.catWidth * params.containerWidth * params.zoom;
  }
  else {
    // portrait
    imageWidth = params.catWidth / params.catHeight * params.containerHeight * params.zoom;
    imageHeight = params.containerHeight * params.zoom;

  }

  // delta in pixels
  const xDelta = mouseX - imageWidth * params.catX;
  const yDelta = mouseY - imageHeight * params.catY;

  const fillThreshold = .5;
  const shouldZoom = yDelta > fillThreshold || params.containerHeight - (imageHeight + yDelta) > fillThreshold ||
    xDelta > fillThreshold || params.containerWidth - (imageWidth - xDelta) > fillThreshold;

  if (shouldZoom && params.zoom < 2) {
    const dimensions: any = calculateImageDimensions({
      ...params,
      zoom: params.zoom * 1.1
    });
    return dimensions;
  }

  return {
    width: imageWidth,
    height: imageHeight,
    top: yDelta,
    left: xDelta,
    calculated_zoom: params.zoom,
    cat_id: params.fileName
  };
}
