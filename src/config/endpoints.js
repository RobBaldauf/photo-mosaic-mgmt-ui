"use strict";

import { API_SERVER } from "./config.js";

// API endpoint definitions
export const getMosaicListEndpoint = () => {
  return API_SERVER + "/mosaic/list";
};

export const getActiveMosaicListEndpoint = () => {
  return API_SERVER + "/mosaic/list/active";
};

export const getOriginalMosaicListEndpoint = () => {
  return API_SERVER + "/mosaic/list/original";
};

export const getFilledMosaicListEndpoint = () => {
  return API_SERVER + "/mosaic/list/filled";
};

export const getMosaicEndpoint = (id) => {
  return API_SERVER + "/mosaic/" + id;
};

export const getMosaicMetadataEndpoint = (id) => {
  return API_SERVER + "/mosaic/" + id + "/metadata";
};

export const getMosaicGifEndpoint = (id) => {
  return API_SERVER + "/mosaic/" + id + "/gif";
};

export const postMosaicEndpoint = () => {
  return API_SERVER + "/mosaic/";
};

export const resetMosaicEndpoint = (id) => {
  return API_SERVER + "/mosaic/" + id + "/reset";
};

export const deleteMosaicEndpoint = (id) => {
  return API_SERVER + "/mosaic/" + id;
};

export const getSegmentList = (id) => {
  return API_SERVER + "/mosaic/" + id + "/segment/list";
};

export const postResetSegment = (mosaicId, segmentId) => {
  return API_SERVER + "/mosaic/" + mosaicId + "/segment/" + segmentId + "/reset";
};

export const postSegmentEndpoint = (id) => {
  return API_SERVER + "/mosaic/" + id + "/segment/";
};

export const postSegmentSampleEndpoint = (id, sampleIndex) => {
  return API_SERVER + "/mosaic/" + id + "/segment/sample/" + sampleIndex;
};
