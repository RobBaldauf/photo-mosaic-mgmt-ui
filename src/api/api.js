"use strict";

import {
  getMosaicListEndpoint,
  postMosaicEndpoint,
  postSegmentSampleEndpoint,
  getMosaicEndpoint,
  getMosaicMetadataEndpoint,
  resetMosaicEndpoint,
  deleteMosaicEndpoint,
  postSegmentEndpoint,
} from "../config/endpoints.js";

import { API_KEY } from "../config/config.js"

export const getMosaics = (success, error) => {
  //fetch a list of mosaics from the API
  fetch(getMosaicListEndpoint(), {
    method: "GET",
    withCredentials: true,
    headers: {
      accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      success(data);
    })
    .catch((err) => {
      error(err);
    });
};

export const postMosaic = (
  mosaicFile,
  numSegments,
  mosaicBgBrightness,
  mosaicBlendValue,
  segmentBlendValue,
  segmentBlurLow,
  segmentBlurMedium,
  segmentBlurHigh,
  success,
  error
) => {
  //POST the selected mosaicFile to the API and refresh the page on success
  const formData = new FormData();
  formData.append("file", mosaicFile);
  formData.append("num_segments", numSegments);
  formData.append("mosaic_bg_brightness", mosaicBgBrightness);
  formData.append("mosaic_blend_value", mosaicBlendValue);
  formData.append("segment_blend_value", segmentBlendValue);
  formData.append("segment_blur_low", segmentBlurLow);
  formData.append("segment_blur_medium", segmentBlurMedium);
  formData.append("segment_blur_high", segmentBlurHigh);

  var req = {
    method: "POST",
    withCredentials: true,
    headers: {
      accept: "application/json",
    },
    body: formData
  };
  if (API_KEY !== "") {
    req.headers.api_key = API_KEY
  }

  fetch(postMosaicEndpoint(), req)
    .then((response) => response.json())
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

export const postSample = (sampleFile, sampleMosaicId, success, error) => {
  // Upload the selected image to the api and display the returned filtered version of it
  const formData = new FormData();
  formData.append("file", sampleFile);
  fetch(postSegmentSampleEndpoint(sampleMosaicId), {
    method: "POST",
    withCredentials: true,
    headers: {
      accept: "application/json",
    },
    body: formData,
  })
    .then((res) => {
      const segmentId = res.headers.get("segment_id");
      res.blob().then((blob) => {
        success(URL.createObjectURL(blob), segmentId);
      });
    })
    .catch((err) => {
      error(err);
    });
};

export const getImage = (mosaicId, success, error) => {
  // Fetch a single mosaic image from the API
  fetch(getMosaicEndpoint(mosaicId), {
    method: "GET",
    withCredentials: true,
    headers: {
      accept: "image/jpeg",
    },
  })
    .then((res) => res.blob())
    .then((data) => {
      success(URL.createObjectURL(data));
    })
    .catch((err) => {
      error(err);
    });
};

export const getMetadata = (mosaicId, success, error) => {
  // Fetch a single mosaic image from the API
  fetch(getMosaicMetadataEndpoint(mosaicId), {
    method: "GET",
    withCredentials: true,
    headers: {
      accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((m) => {
      success({
        active: m.active,
        filled: m.filled,
        original: m.original,
        darkSegmentsLeft: m.dark_segments_left,
        mediumSegmentsLeft: m.medium_segments_left,
        brightSegmentsLeft: m.bright_segments_left,
        numSegments: m.num_segments,
        mosaicBackgroundBrightness:
          m.mosaic_config.mosaic_background_brightness,
        mosaicBlendValue: m.mosaic_config.mosaic_blend_value,
        segmentBlendValue: m.mosaic_config.segment_blend_value,
        segmentBlurLow: m.mosaic_config.segment_blur_low,
        segmentBlurMedium: m.mosaic_config.segment_blur_medium,
        segmentBlurHigh: m.mosaic_config.segment_blur_high,
      });
    })
    .catch((err) => {
      error(err);
    });
};

export const resetMosaic = (mosaicId, success, error) => {
  var req = {
    method: "POST",
    withCredentials: true,
    headers: {
      accept: "application/json",
    }
  };
  if (API_KEY !== "") {
    req.headers.api_key = API_KEY
  }
  fetch(resetMosaicEndpoint(mosaicId), req)
    .then((res) => res.json())
    .then((data) => {
      success(data);
    })
    .catch((err) => {
      error(err);
    });
};

export const deleteMosaic = (mosaicId, success, error) => {
  var req = {
    method: "DELETE",
    withCredentials: true,
    headers: {
      accept: "application/json",
    }
  };
  if (API_KEY !== "") {
    req.headers.api_key = API_KEY
  }
  // delete a mosaic from the db
  fetch(deleteMosaicEndpoint(mosaicId), req)
    .then((res) => res.json())
    .then((data) => {
      success(data);
    })
    .catch((err) => {
      error(err);
    });
};

export const postSegments = (
  mosaicId,
  segmentFiles,
  quickFill,
  success,
  error
) => {
  // Upload a list of images as mosaic segments to the API
  var uploadedFiles = 1;
  for (let i = 0; i < segmentFiles.length; i++) {
    const formData = new FormData();
    formData.append("file", segmentFiles[i]);
    formData.append("quick_fill", quickFill);
    var req = {
      method: "POST",
      withCredentials: true,
      headers: {
        accept: "application/json",
      },
      body: formData,
    };
    if (API_KEY !== "") {
      req.headers.api_key = API_KEY
    }

    fetch(postSegmentEndpoint(mosaicId), req)
      .then((response) => response.json())
      .then(() => {
        if (uploadedFiles == segmentFiles.length) {
          success();
        } else {
          uploadedFiles++;
        }
      })
      .catch((err) => {
        error(err);
      });
  }
};
