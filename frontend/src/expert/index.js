// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/**
 * 2020-07-24 Version 1.0
 *
 * index.js
 * This is the main file used to create the MIST expert page located at the /expert
 * route. 
 * 
 * Basic Layout: 
 * 
 * Working Definitions: 
 * 1. Function
 * 
 * 2. Workspace
 * 
 * Here we build the Expert component which manages the state of the form on
 * the expert page as well as the function-macros defined by the user. We divide the
 * page into four React Components: Menu, SidePanelCard, WorkspaceCard, CanvasCard;
 * whose corresponding files are located in './components'. We go into more detail
 * of each Component in the list below as well as in the Notes Headers of the respective
 * files.
 * 
 * 1. Menu
 * 
 * 2. SidePanelCard
 * 
 * 3. WorkspaceCard
 * 
 * 4. CanvasCard
 * 
 * We also rely on a Popup Component, whose contents will be modified at
 * shown whenever a popup is needed via the triggerPopup() function.
 * 
 * The initialState of th Expert Component is stored under './initial-state.js
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

    /**
     * Gets the state of the Function Form.
     */
    getFormState() {
        return this.state.form;
    } // getFormState()

    /**
     * Gets the names of functions that has currently been saved and returns them in an array.
     */
    getFunctions() {
        return this.getStateFunctions()._order;
    } // getFunctions()

    /**
     * Gets the functions field of the state.
     */
    getStateFunctions() {
        return this.state.functions;
    } // getStateFunctions()


    /**
     * Gets the value of field on the Function Form, where 'key' is one of the valid
     * Form fields which can be found in the WorkspaceCard Component definition, the
     * Expert UI page, as well as the initialForm object in './initial-state.js'.
     * 
     * @param {String} key 
     */
    getFormValue(key) {
        return this.state.form[key];
    } // getFormValue(String)

    /**
     * Sets the value of 'key' field of the form object in the state to 'to'. 
     * We should avoid directly modifying the actual object, so we return a newly
     * created object to the setState function as per React recommendations to 
     * never directly mutate the state and treat the state as an immutable object. 
     * 
     * @param {String} key 
     * @param {String} to 
     */
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
    } // setFormValue(String, String)

    /**
     * Loads the given 'functionToLoad' into the Expert UI's Form.
     * 
     * @param {Object} functionToLoad, whose keys matches the initialForm object found in
     * './initial-state.js'
     */
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
    } // loadFunction(Object)

        /**
     * Loads the saved function into the Expert UI's Form.
     * 
     * @param {String} function_name, whose keys matches the initialForm object found in
     * './initial-state.js'
     */
    loadSavedFunction(function_name) {
        const fun = { ...this.state.functions[function_name] };
        if (Array.isArray(fun.params)) {
            fun.params = fun.params.toString();
        }
        this.setState({
            form: {
                ...fun
            },
        })
    } // loadSavedFunction(String)

    /**
     * Loads the stored user-saved functions (while preserving order) and the stored form
     * values stored in workspaceToLoad.
     * 
     * @param {Object} workspaceToLoad, whose keys matches the initialState object found in
     * './initial-state.js' 
     */
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
    } // loadWorkspace(Object)

    /**
     * Clears the Function Form in the Expert UI.
     */
    clearFunction() {
        this.setState({
            form: { ...getInitialForm() }
        });
    } // clearFunction()

    /**
     * Clears the entire Expert UI Workspace.
     */
    resetWorkspace() {
        this.setState({
            ...getInitialState()
        });
    } // resetWorkspace()


    deleteFunction(fun_name) {
        this.setState((state) => {
            const new_functions = {
                ...state.functions,
                _order: state.functions._order.filter((name) => name !== fun_name)
            };
            delete new_functions[fun_name];
            return { functions: new_functions };
        })
    }

    setFunctionsOrder(order) {
        this.setState(state => ({
            functions: {
                ...state.functions,
                _order: order,
            },
        }))
    }

    addFunctionToState(new_function) {
        const new_function_name = Object.keys(new_function)[0];
        const new_order = [...this.getStateFunctions()._order.filter(name => name !== new_function_name), new_function_name];
        const new_state_functions = Object.assign({}, this.getStateFunctions(), { _order: new_order }, new_function);
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

    componentDidMount(){
        const {code} = this.props.match.params;
        if(code){
            this.setState(state=>({
                form: {
                    ...state.form,
                    code: code,
                }
            }))
        }
    }
  
    render() {
        return (
            <div id='expert' ref={this.expertRef} >
                {console.log('rendering expert')}
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
                    loadSavedFunction={this.loadSavedFunction.bind(this)}
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
                        setFunctionsOrder={order => this.setFunctionsOrder(order)}

                        triggerPopup={this.triggerPopup.bind(this)}
                    />
                    <WorkspaceCard
                        addUserDefinedFunction={() => this.addUserDefinedFunction()}
                        clearFunction={this.clearFunction.bind(this)}
                        getCurrentWorkspace={() => this.state}
                        loadFunction={this.loadFunction.bind(this)}
                        functions={this.state.functions._order}
                        doesFunctionExist={(fun_name) => (fun_name in this.state.functions)}

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

                        triggerPopup={this.triggerPopup.bind(this)}
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
