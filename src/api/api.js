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
  getSegmentList,
  postResetSegment,
  postUpdateMosaicStates
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
  mosaicTitle,
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
  formData.append("title", mosaicTitle);
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

export const postSample = (sampleFile, sampleMosaicId, sampleIndex, success, error) => {
  // Upload the selected image to the api and display the returned filtered version of it
  const formData = new FormData();
  formData.append("file", sampleFile);
  fetch(postSegmentSampleEndpoint(sampleMosaicId, sampleIndex), {
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
        mosaicTitle: m.mosaic_config.title,
        numSegments: m.num_segments,
        numRows: m.n_rows,
        numCols: m.n_cols,
        spaceTop: m.space_top,
        spaceLeft: m.space_left,
        segmentWidth:m.segment_width,
        segmentHeight:m.segment_height,
        mosaicBackgroundBrightness:
          m.mosaic_config.mosaic_bg_brightness,
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

export const getSegments = (mosaicId, success, error) => {
  var req = {
    method: "GET",
    withCredentials: true,
    headers: {
      accept: "application/json",
    }
  }
  if (API_KEY !== "") {
    req.headers.api_key = API_KEY
  }
  //fetch a list of segments from the API
  fetch(getSegmentList(mosaicId), req)
    .then((res) => res.json())
    .then((data) => {
      var segments={};
      data.segment_list.forEach(seg=>{
        segments[seg.idx]=seg;
      })
      success(segments);
    })
    .catch((err) => {
      error(err);
    });
};

export const resetSegment = (mosaicId, segmentId, success, error) => {
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
  fetch(postResetSegment(mosaicId, segmentId), req)
    .then((res) => res.json())
    .then((data) => {
      success(data);
    })
    .catch((err) => {
      error(err);
    });
};

export const updateMosaicStates = (mosaicId, active, filled, original, success, error) => {
  const formData = new FormData();
  formData.append("active", active);
  formData.append("filled", filled);
  formData.append("original", original);
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
  fetch(postUpdateMosaicStates(mosaicId), req)
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
