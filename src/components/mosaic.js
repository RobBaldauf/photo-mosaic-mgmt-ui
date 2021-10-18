"use strict";

import SampleDialog from "./sample_dialog.js";
import EditMosaicDialog from "./edit_mosaic_dialog.js";
import { MosaicBody } from "./mosaic_body.js";
import {
  getMetadata,
  postSample,
  getImage,
  resetMosaic,
  deleteMosaic,
  postSegments,
  getSegments, 
  resetSegment,
  updateMosaicStates
} from "../api/api.js";


const BRIGHTNESS_LEVELS = { 0: "low", 1: "medium", 2: "high" }
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
        active: false,
        filled: false,
        original: false,
        darkSegmentsLeft: -1,
        mediumSegmentsLeft: -1,
        brightSegmentsLeft: -1,
        mosaicTitle: "",
        numSegments: -1,
        numRows: -1,
        numCols: -1,
        spaceTop: -1,
        spaceLeft: -1,
        segmentWidth: -1,
        segmentHeight: -1,
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
      sampleIndex: -1,
      sampleModalVisible: false,
      editMosaicModalVisible: false,
      segmentFileName: "",
      segmentFiles: [],
      quickFill: true,
      segments: [],
      selectedSegmentId: "",
      selectedSegmentBrightness: "",
      selectedSegmentFilled:"",
      selectedSegmentFillable: ""
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

  previousSample = () => {
    this.setState({ sampleIndex: this.state.sampleIndex - 1 }, this.getSample);
  }

  nextSample = () => {
    this.setState({ sampleIndex: this.state.sampleIndex + 1 }, this.getSample);
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

  toggleActive = (event) => {
    //Update the active state
    var metadata=this.state.metadata
    metadata.active=!metadata.active
    this.setState({
      metadata: metadata,
    });
  };

  toggleFilled = (event) => {
    //Update the filled state
    var metadata=this.state.metadata
    metadata.filled=!metadata.filled
    this.setState({
      metadata: metadata,
    });
  };

  toggleOriginal = (event) => {
    //Update the original state
    var metadata=this.state.metadata
    metadata.original=!metadata.original
    this.setState({
      metadata: metadata,
    });
  };

  updateMosaicStates=()=>{
    // reset the selected segment
    updateMosaicStates(
      this.state.id,
      this.state.metadata.active,
      this.state.metadata.filled,
      this.state.metadata.original,
      () => {
        this.state.refresh();
      },
      (err) => {
        this.state.alert(
          "Error while updating mosaic states (Check connection to backend): " +
          err
        );
        this.closeEditMosaicModal;
      }
    );
  }


  resetSegment= () => {
    // reset the selected segment
    resetSegment(
      this.state.id,
      this.state.selectedSegmentId,
      () => {
        this.state.refresh();
      },
      (err) => {
        this.state.alert(
          "Error while resetting segment (Check connection to backend): " +
          err
        );
        this.closeSampleModal();
      }
    );
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
    }, () => {
      getSegments(this.state.id,
        (data) => {
          this.setState({
            segments: data,
          });
        },
        (err) => {
          this.state.alert(
            "Error while filling segments (Check connection to backend): " +
            err
          );
          this.closeEditMosaicModal();
        });
      $("#edit-img").areaSelectable({
        x: this.state.metadata.numCols,
        y: this.state.metadata.numRows,
        width: (700 / (this.state.metadata.numRows * this.state.metadata.segmentHeight)) * this.state.metadata.numCols * this.state.metadata.segmentWidth,
        height: 700,
        onSelected: this.showSegmentDetails,
        onDeselected: this.hideSegmentDetails,
      })
    });
  };

  showSegmentDetails = (id) => {
    this.setState({
      selectedSegmentId: this.state.segments[id - 1].id,
      selectedSegmentBrightness: BRIGHTNESS_LEVELS[this.state.segments[id - 1].bri],
      selectedSegmentFilled: this.state.segments[id - 1].filled === 1 ? "yes" : "no",
      selectedSegmentFillable: this.state.segments[id - 1].fillable === 1 ? "yes" : "no"
    });
  }

  hideSegmentDetails = (id) => {
    this.setState({
      selectedSegmentId: "",
      selectedSegmentBrightness: "",
      selectedSegmentFilled: "",
      selectedSegmentFillable: ""
    });
  }

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
          title: this.state.metadata.mosaicTitle,
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
          onHide: this.closeSampleModal
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
              disabled: this.state.sampleFileName === "" || this.state.sampleIndex < 1,
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
          size: "xl",
          onHide: this.closeEditMosaicModal
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
            mosaicImgSrc: this.state.image,
            numRows: this.state.numRows,
            numCols: this.state.numCols,
            spaceTop: this.state.spaceTop,
            spaceLeft: this.state.spaceLeft,
            segmentWidth: this.state.segmentWidth,
            segmentHeight: this.state.segmentHeight,
            fillSegments: this.fillSegments,
            deleteMosaic: this.delete,
            resetMosaic: this.reset,
            segmentFileName: this.state.segmentFileName,
            addingImage: this.state.addingImage,
            selectedSegmentId: this.state.selectedSegmentId,
            selectedSegmentBrightness: this.state.selectedSegmentBrightness,
            selectedSegmentFilled:this.state.selectedSegmentFilled,
            selectedSegmentFillable: this.state.selectedSegmentFillable,
            resetSegment: this.resetSegment,
            active: this.state.metadata.active,
            setActive:this.toggleActive,
            filled: this.state.metadata.filled,
            setFilled:this.toggleFilled,
            original: this.state.metadata.original,
            setOriginal:this.toggleOriginal,
            updateMosaicStates:this.updateMosaicStates
          })
        ),

        c(
          ReactBootstrap.Modal.Footer,
          {},
          c(
            ReactBootstrap.Button,
            {
              variant: "dark",
              onClick: this.closeEditMosaicModal,
              disabled: this.state.addingImage,
            },
            "Close"
          )
        )
      )
    );
  }
}

export default Mosaic;
