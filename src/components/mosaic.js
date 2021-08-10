"use strict";

import SampleDialog from "./sample_dialog.js";
import EditMosaicDialog from "./edit_mosaic_dialog.js";
import { MosaicBody } from "./mosaic_body.js";
import { SpinnerButton } from "./utils.js";
import {
  getMetadata,
  postSample,
  getImage,
  resetMosaic,
  deleteMosaic,
  postSegments,
} from "../api/api.js";

const c = React.createElement;

const MosaicImage = (props) => {
  // The mosaic image
  return c("img", { className: "card-img-top", src: props.src });
};

class Mosaic extends React.Component {
  //A component for showing/interacting with a single mosaic
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      idx: props.idx,
      image: null,
      metadata: {
        active: "",
        filled: "",
        original: "",
        darkSegmentsLeft: -1,
        mediumSegmentsLeft: -1,
        brightSegmentsLeft: -1,
        numSegments: -1,
        mosaicBackgroundBrightness: -1,
        mosaicBlendValue: -1,
        segmentBlendValue: -1,
        segmentBlurLow: -1,
        segmentBlurMedium: -1,
        segmentBlurHigh: -1,
      },
      alert: props.alert,
      refresh: props.refresh,
      addingImage: false,
      sampleFileName: "",
      sampleFile: null,
      sampleImage: null,
      sampleSegmentId: "",
      sampleIndex:-1,
      sampleModalVisible: false,
      editMosaicModalVisible: false,
      segmentFileName: "",
      segmentFiles: [],
      quickFill: true,
    };
  }

  fetchImage() {
    getImage(
      this.state.id,
      (data) => {
        this.setState({ image: data });
      },
      (err) => {
        this.state.alert(
          "Error while fetching mosaic image (Check connection to backend): " +
            err
        );
      }
    );
  }

  fetchMetadata() {
    getMetadata(
      this.state.id,
      (data) => {
        this.setState({
          metadata: data,
        });
      },
      (err) => {
        this.state.alert(
          "Error while fetching mosaic metadata (Check connection to backend): " +
            err
        );
      }
    );
  }

  reset = (event) => {
    resetMosaic(
      this.state.id,
      () => {
        this.state.refresh();
        this.closeEditMosaicModal();
      },
      (err) => {
        this.state.alert(
          "Error while resetting mosaic (Check connection to backend): " + err
        );
        this.closeEditMosaicModal();
      }
    );
  };

  delete = (event) => {
    deleteMosaic(
      this.state.id,
      () => {
        this.state.refresh();
        this.closeEditMosaicModal();
      },
      (err) => {
        this.state.alert(
          "Error while deleting mosaic (Check connection to backend): " + err
        );
        this.closeEditMosaicModal();
      }
    );
  };

  getSample = () => {
    // Upload the selected image to the api and display the returned filtered version of it
    postSample(
      this.state.sampleFile,
      this.state.id,
      this.state.sampleIndex,
      (image, segmentId) => {
        this.setState({ sampleImage: image, sampleSegmentId: segmentId });
      },
      (err) => {
        this.state.alert(
          "Error while getting filter sample (Check connection to backend): " +
            err
        );
        this.closeSampleModal();
      }
    );
  };

  previousSample = () =>{
    this.setState({ sampleIndex:this.state.sampleIndex-1 }, this.getSample);
  }

  nextSample = () =>{
    this.setState({ sampleIndex:this.state.sampleIndex+1 }, this.getSample);
  }

  fillSegments = (event) => {
    // Upload a list of images as mosaic segments to the API
    this.setState(
      {
        addingImage: true,
      },
      () => {
        postSegments(
          this.state.id,
          this.state.segmentFiles,
          this.state.quickFill,
          () => {
            this.state.refresh();
            this.setState({
              addingImage: false,
            });
          },
          (err) => {
            this.state.alert(
              "Error while filling segments (Check connection to backend): " +
                err
            );
            this.closeEditMosaicModal();
          }
        );
      }
    );
  };

  updateSegmentFile = (event) => {
    // Update the list of images selected for upload
    this.setState({
      segmentFiles: event.target.files,
      segmentFileName: event.target.value,
    });
  };

  updateSampleFile = (event) => {
    //Update the sample filename parameter that is used for getting mosaic samples
    this.setState({
      sampleFile: event.target.files[0],
      sampleFileName: event.target.value,
    });
  };

  toggleQuickFill = (event) => {
    //Update the quick fill parameter that enables faster mosaic filling
    this.setState({
      quickFill: !this.state.quickFill,
    });
  };

  showSampleModal = () => {
    this.setState({
      sampleModalVisible: true,
    });
  };

  closeSampleModal = () => {
    this.setState({
      sampleModalVisible: false,
    });
  };

  showEditMosaicModal = () => {
    this.setState({
      editMosaicModalVisible: true,
    });
  };

  closeEditMosaicModal = () => {
    this.setState({
      editMosaicModalVisible: false,
    });
  };

  componentDidMount() {
    //ensure fetching  of the mosaic image on load
    this.fetchMetadata();
    this.fetchImage();
  }

  render() {
    // render a mosaic including its image+detailled info
    return c(
      "div",
      { className: "col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12" },
      c(
        "div",
        { className: "card" },
        c(MosaicImage, { src: this.state.image }),
        c(MosaicBody, {
          id: this.state.id,
          brightSegments: this.state.metadata.brightSegmentsLeft,
          mediumSegments: this.state.metadata.mediumSegmentsLeft,
          darkSegments: this.state.metadata.darkSegmentsLeft,
          isActive: this.state.metadata.active ? "yes" : "no",
          isFilled: this.state.metadata.filled ? "yes" : "no",
          isOriginal: this.state.metadata.original ? "yes" : "no",
          mosaicBackgroundBrightness: this.state.metadata
            .mosaicBackgroundBrightness,
          mosaicBlendValue: this.state.metadata.mosaicBlendValue,
          segmentBlendValue: this.state.metadata.segmentBlendValue,
          segmentBlurLow: this.state.metadata.segmentBlurLow,
          segmentBlurMedium: this.state.metadata.segmentBlurMedium,
          segmentBlurHigh: this.state.metadata.segmentBlurMedium,
          reset: this.reset,
          delete: this.delete,
          editMosaic: this.showEditMosaicModal,
          addingImage: this.state.addingImage,
          segmentFileName: this.state.segmentFileName,
          updateSegmentFile: this.updateSegmentFile,
          getSample: this.showSampleModal,
        })
      ),
      //Filter sample modal
      c(
        ReactBootstrap.Modal,
        {
          show: this.state.sampleModalVisible,
          size: "lg",
        },
        c(
          ReactBootstrap.Modal.Header,
          {},
          c(ReactBootstrap.Modal.Title, {}, "Get filter samples...")
        ),
        c(
          ReactBootstrap.Modal.Body,
          {},
          c(SampleDialog, {
            sampleMosaicId: this.state.id,
            sampleFileName: this.state.sampleFileName,
            sampleSegmentId: this.state.sampleSegmentId,
            sampleImage: this.state.sampleImage,
            updateSampleFile: this.updateSampleFile,
          })
        ),
        c(
          ReactBootstrap.Modal.Footer,
          {},
          c(
            ReactBootstrap.Button,
            { variant: "dark", onClick: this.closeSampleModal },
            "Close"
          ),
          c(
            ReactBootstrap.Button,
            {
              variant: "dark",
              onClick: this.previousSample,
              disabled: this.state.sampleFileName === "" || this.state.sampleIndex<1,
            },
            "Previous sample"
          ),
          c(
            ReactBootstrap.Button,
            {
              variant: "dark",
              onClick: this.nextSample,
              disabled: this.state.sampleFileName === "",
            },
            "Next sample"
          )
        )
      ),
      //Edit mosaic modal
      c(
        ReactBootstrap.Modal,
        {
          show: this.state.editMosaicModalVisible,
          size: "lg",
        },
        c(
          ReactBootstrap.Modal.Header,
          {},
          c(ReactBootstrap.Modal.Title, {}, "Edit mosaic...")
        ),
        c(
          ReactBootstrap.Modal.Body,
          {},
          c(EditMosaicDialog, {
            segmentFileName: this.state.segmentFileName,
            updateSegmentFile: this.updateSegmentFile,
            quickFill: this.state.quickFill,
            toggleQuickFill: this.toggleQuickFill,
          })
        ),
        c(
          ReactBootstrap.Modal.Footer,
          {},
          c(
            ReactBootstrap.Button,
            {
              variant: "danger",
              onClick: this.delete,
              disabled: this.state.addingImage,
            },
            "Delete"
          ),
          c(
            ReactBootstrap.Button,
            {
              variant: "danger",
              onClick: this.reset,
              disabled: this.state.addingImage,
            },
            "Reset"
          ),
          c(
            ReactBootstrap.Button,
            {
              variant: "dark",
              onClick: this.closeEditMosaicModal,
              disabled: this.state.addingImage,
            },
            "Close"
          ),
          c(SpinnerButton, {
            variant: "dark",
            onClick: this.fillSegments,
            disabled: this.state.segmentFileName === "",
            text: "Fill segments",
            showSpinner: this.state.addingImage,
          })
        )
      )
    );
  }
}

export default Mosaic;
