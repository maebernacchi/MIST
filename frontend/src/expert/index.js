// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * index.js
 * This is the main file used to create the MIST expert page located at the /expert
 * route. 
 * 
 * Here we build the Expert component which manages the state of the form on
 * the expert page as well as the function-macros defined by the user. We divide the
 * page into four React Components: Menu, SidePanelCard, WorkspaceCard, CanvasCard;
 * whose corresponding files are located in './components'.
 * 
 * We handle macros using the expand_macros function from the './macros' module.
 */

import '../styleSheets/expert.css';
import CanvasCard from './components/CanvasCard';
import Menu from './components/Menu';
import Popup from './components/Popup';
import WorkspaceCard from './components/WorkspaceCard';
import SidePanelCard from './components/SidePanelCard';
import { getInitialForm, getInitialState } from './initial-state';
import expand_macros from './macros';
import React, { Component, createRef } from 'react';
import ResizablePanels from "resizable-panels-react";

import { Button } from 'react-bootstrap';

// +---------------------------------
// | Expert |
// +--------+

class Expert extends Component {
    constructor(props) {
        super(props);
        this.codeRef = createRef("code");
        this.expertRef = createRef("expert");
        this.state = getInitialState();
    }

    getFormState() {
        return this.state.form;
    }

    getFormValue(key) {
        return this.state.form[key];
    }

    setFormValue(key, to) {
        this.setState((state) => {
            const form = {
                form: {
                    ...state.form,
                    [key]: to,
                }
            }
            return form;
        });
    }

    loadWorkspace(workspaceToLoad) {
        const fun = workspaceToLoad.fun;
        this.setState({
            form: {
                name: fun.name,
                params: fun.params,
                description: fun.about,
                code: fun.code,
                message: "",
            },
            functions: workspaceToLoad.userFuns,
        });
    }

    deleteFunction(fun_name) {
        this.setState((state) => {
            const new_functions = {
                ...state.functions,
                order: state.functions.order.filter((name) => name !== fun_name)
            };
            delete new_functions[fun_name];
            return { functions: new_functions };
        })
    }

    loadFunction(functionToLoad) {
        const fun = { ...functionToLoad };
        if (Array.isArray(fun.params)) {
            fun.params = fun.params.toString();
        }
        this.setState({
            form: {
                ...fun
            },
        })
    }

    resetWorkspace() {
        this.setState({
            ...getInitialState()
        });
    }

    clearFunction() {
        this.setState({
            form: { ...getInitialForm() }
        });
    }

    getStateFunctions() {
        return this.state.functions;
    }

    getFunctions() {
        return this.getStateFunctions().order;
    }

    setFunctionsOrder(_order) {
        this.setState(state => ({
            functions: {
                ...state.functions,
                order: _order,
            },
        }))
    }

    addFunctionToState(new_function) {
        const new_function_name = Object.keys(new_function)[0];
        const new_order = [...this.getStateFunctions().order.filter(name => name !== new_function_name), new_function_name];
        const new_state_functions = Object.assign({}, this.getStateFunctions(), { order: new_order }, new_function);
        this.setState({ functions: new_state_functions });
    }

    addUserDefinedFunction = () => {
        const funct = this.getFormState();
        const name = funct.name;
        const code = funct.code;

        if (name && code) {
            let params;
            if (funct.params)
                params = funct.params.replace(/\s/g, "").split(",");
            else
                params = [];
            try {
                // try expanding the code
                expand_macros(code, this.state.functions);
                // if no error then...
                const about = funct.description;
                const new_function =
                {
                    name: name,
                    about: about,
                    params: params,
                    code: code,
                };

                this.addFunctionToState({ [name]: new_function });
            }
            catch (error) {
                this.setFormValue('message', error);
            }

        } else {
            alert('We need both name and code filled out!')
        }
    } //addUserDefinedFunction

    togglePopup() {
        this.setState((state) => ({
            popup: {
                ...state.popup,
                isOpen: !(state.popup.isOpen),
            }
        }))
    }

    triggerPopup({ message, onConfirm }) {
        this.setState((state) => ({
            popup: {
                ...state.popup,
                isOpen: !(state.popup.isOpen),
                message: message,
                onConfirm: onConfirm,
            }
        }))
    }

    render() {
        return (
            <div id='expert' ref={this.expertRef} >
                {console.log('rendering expert')}
                <Button onClick={this.triggerPopup.bind(this)}>
                    Here
                </Button>
                <Popup
                    isOpen={this.state.popup.isOpen}
                    message={this.state.popup.message}
                    onConfirm={this.state.popup.onConfirm}
                    onClose={this.togglePopup.bind(this)}
                />
                <Menu
                    addUserDefinedFunction={() => this.addUserDefinedFunction()}
                    clearFunction={this.clearFunction.bind(this)}
                    getCurrentWorkspace={() => this.state}
                    deleteFunction={this.deleteFunction.bind(this)}
                    loadFunction={this.loadFunction.bind(this)}
                    loadWorkspace={this.loadWorkspace.bind(this)}
                    resetWorkspace={() => this.resetWorkspace()}

                    getFormState={() => this.getFormState()}
                    getStateFunctions={() => this.getStateFunctions()}
                    setMessage={(message) => this.setFormValue("message", message)}

                    requestFullscreen={() => {
                        console.log(this.expertRef);
                        this.expertRef.current.requestFullscreen()
                    }}
                    exitFullscreen={() => document.exitFullscreen()}
                />
                <ResizablePanels
                    bkcolor="#353b48"
                    displayDirection="row"
                    width="100%"
                    height="100vh"
                    panelsSize={[15, 43, 42]}
                    sizeUnitMeasure="%"
                    resizerSize="10px"
                >
                    <SidePanelCard
                        codeRef={this.codeRef}
                        deleteFunction={this.deleteFunction.bind(this)}
                        expertRef={this.expertRef}
                        getFormState={() => this.getFormState()}
                        getStateFunctions={() => this.getStateFunctions()}
                        getFunctions={() => this.getFunctions()}
                        loadFunction={this.loadFunction.bind(this)}
                        setCode={(txt) => { this.setFormValue('code', txt) }}
                        setFunctionsOrder={(_order) => this.setFunctionsOrder(_order)}

                        triggerPopup={this.triggerPopup.bind(this)}
                    />
                    <WorkspaceCard
                        addUserDefinedFunction={() => this.addUserDefinedFunction()}
                        clearFunction={this.clearFunction.bind(this)}
                        getCurrentWorkspace={() => this.state}
                        loadFunction={this.loadFunction.bind(this)}
                        functions={this.state.functions.order}
                        doesFunctionExist={(fun_name) => (Boolean(this.state.functions[fun_name]))}

                        code={this.getFormValue('code')}
                        codeRef={this.codeRef}
                        description={this.getFormValue('description')}
                        expertRef={this.expertRef}
                        name={this.getFormValue('name')}
                        nameRef={this.nameRef}
                        message={this.getFormValue('message')}
                        params={this.getFormValue('params')}
                        default_params={this.getFormValue('default_params')}
                        setCode={(code) => this.setFormValue("code", code)}
                        setDescription={(description) => this.setFormValue("description", description)}
                        setDefaultParams={(default_params) => this.setFormValue("default_params", default_params)}

                        setName={(name) => this.setFormValue("name", name)}
                        setParams={(params) => this.setFormValue("params", params)}
                    />
                    <CanvasCard
                        code={this.getFormValue('code')}
                        default_params={this.getFormValue('default_params')}
                        expertRef={this.expertRef}
                        getFormState={() => this.getFormState()}
                        getStateFunctions={() => this.getStateFunctions()}
                        params={this.getFormValue('params')}
                        setMessage={(message) => this.setFormValue("message", message)}
                    />
                </ResizablePanels>
            </div>
        );
    }
}

export default Expert;
