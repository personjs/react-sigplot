import React, { Component, PropTypes } from 'react';

export default class SigPlot extends Component {
  static propTypes = {
    height: PropTypes.string,
    width: PropTypes.string,
    file: PropTypes.string,
    websocket: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.number),
    raster: PropTypes.bool,
    settings: PropTypes.object,
    type: PropTypes.number,
    xunits: PropTypes.number,
    yunits: PropTypes.number
  }

  static defaultProps = {
    height: 300,
    width: 300,
    type: 2000,
    xdelta: 1,
    xunits: 3, // Hz
    yunits: 26, // 10*log
    settings: {
      all: true,
      expand: true,
      autol: 100,
      autohide_panbars: true
    }
  }

  componentDidMount() {
    const {
      data,
      file,
      raster,
      settings,
      xdelta,
      xunits,
      yunits,
      type,
      websocket
    } = this.props;
    let subsize = data.length;
    this.plot = new sigplot.Plot(this.element, settings);
    if (file) {
      this.plot.overlay_href(file);
    } else if (websocket) {
      this.plot.overlay_websocket(websocket);
    } else if (data) {
      if (raster) {
        this.pipeLayer = this.plot.overlay_pipe({
          type,
          xdelta,
          xunits,
          subsize
        });
        this.plot.push(this.pipeLayer, data);
      } else {
        this.plotLayer = this.plot.overlay_array(data, {
          xunits,
          yunits
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      data,
      file,
      raster,
      xdelta,
      xunits,
      yunits,
      websocket
    } = nextProps;
    let subsize = data.length;
    if (file) {
      this.plot.overlay_href(file);
    } else if (websocket) {
      this.plot.overlay_websocket(websocket);
    } else if (data) {
      if (raster) {
        this.plot.push(this.pipeLayer, data);
      } else {
        this.plot.reload(this.plotLayer, data);
      }
    }
    return false;
  }
  
  render() {
    const {
      height,
      width
    } = this.props;
    return ( <
      div style = {
        {
          height,
          width,
          display: "inline-block"
        }
      }
      ref = {
        (element) => this.element = element
      } >
      <
      /div>
    );
  }
}
