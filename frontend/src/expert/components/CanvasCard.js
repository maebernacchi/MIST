// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * CanvasCard.js
 *
 * Here we export the CanvasCard React Component which corresponds to the rightmost
 * panel of the MIST Expert GUI. On this panel, the user renders the MIST Image
 * written in the central panel.
 */

import expand_macros from '../macros';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import {
    Card,
    Button,
} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';


class CanvasCard extends Component {
    constructor(props) {
        super(props);
        this.animator = null;
        this.canvas = createRef("canvas");
        this.state = { resolution: 400 };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.resolution !== this.state.resolution)
    }

    /**
     * Sets the resolution of the MIST Image render via the animator object.
     * @param {number} resolution 
     */
    setResolution(resolution) {
        if (this.state.resolution !== resolution) {
            this.setState({ resolution: resolution });
            if (this.animator) {
                this.animator.setResolution(resolution, resolution);
                this.animator.frame();
            }
        }
    } // setResolution(resolution)

    /**
     * Starts rendering the MIST Image onto the canvas element.
     */
    startAnimator() {
        const MIST = window.MIST;
        if (this.animator) { this.animator.stop(); }
        try {
            const expand_code = expand_macros(this.props.code, this.props.getStateFunctions());
            this.animator = new MIST.ui.Animator(expand_code, "", {}, this.canvas.current, (txt) => {
                this.props.setMessage(txt);
            });
            this.animator.setResolution(this.state.resolution, this.state.resolution);
            this.animator.start();
        } catch (error) {
            this.props.setMessage(error);
        }
    } // startAnimator()

    /**
     * Stops animating the MIST Image in the canvas element. 
     */
    stopAnimator() {
        if (this.animator) {
            this.animator.stop();
        }
    } // stopAnimator()

    /**
     * Saves the MIST Image into the authenticated user's account
     */
    saveImage() {
        //STUB
    } // saveImage()

    /**
     * Downloads the image seen in the canvas element.
     */
    downloadImage() {
        let link = document.createElement('a');
        link.download = (this.props.getFormState().name || 'untitled') + '.png';
        link.href = this.canvas.current.toDataURL();
        link.click();
    } // downloadImage()

    render() {

        return (
            <Card
                id='expert-canvas'
                className={(this.props.size ? 'col-' + this.props.size : ' ') + ' scroll panel'}>
                {console.log('rendering canvascard')}
                
                <Card.Img
                    as="canvas"
                    id="expert-canvas-image"
                    ref={this.canvas}
                    width="400"
                    height="400" />
                <CanvasSlider
                    min={1}
                    max={400}
                    step={1}
                    setResolution={(res) => this.setResolution(res)}
                    resolution={this.state.resolution}
                />
                <Button
                    className='canvasButton'
                    onClick={() => this.startAnimator()}
                >
                    Start
                </Button>
                <Button
                    className='canvasButton'
                    onClick={() => this.stopAnimator()}
                >
                    Stop
                </Button>
                <Button
                    className='canvasButton'
                    onClick={() => this.saveImage()}
                >
                    Save Image
                </Button>
                <Button
                    className='canvasButton'
                    onClick={() => this.downloadImage()}
                >
                    Download Image
                </Button>
            </Card>
        )
    }
}

CanvasCard.propTypes = {
    code: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
    getFormState: PropTypes.func.isRequired,
    getStateFunctions: PropTypes.func.isRequired,
}

function CanvasSlider(props) {
    return (
        <RangeSlider
            value={props.resolution}
            min={props.min}
            max={props.max}
            step={props.step}
            onChange={(e) => props.setResolution(parseInt(e.target.value, 10))}
        />
    );

}

CanvasSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    setResolution: PropTypes.func.isRequired,
}

export default CanvasCard;