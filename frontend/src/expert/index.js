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
import WorkspaceCard from './components/WorkspaceCard';
import SidePanelCard from './components/SidePanelCard';
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
        this.state = {
            form: {
                name: "",
                params: "",
                description: "",
                code: "",
                message: "",
            },
            functions: {
                order: [],
            },
        };
    }

    getFormState() {
        return this.state.form;
    }

    getFormValue(key) {
        return this.state.form[key];
    }

    setFormValue(key, to) {
        this.setState((state) => {
            const form = state.form;
            form[key] = to;
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
                order: state.functions.order.filter((name) => name != fun_name)
            };
            delete new_functions[fun_name];
            return { functions: new_functions };
        })
    }

    loadFunction(functionToLoad) {
        const fun = functionToLoad;
        this.setState({
            form: {
                name: fun.name,
                params: fun.params,
                description: fun.about,
                code: fun.code,
                message: "",
            },
        })
    }

    resetWorkspace() {
        this.setState({
            form: {
                name: "",
                params: "",
                description: "",
                code: "",
                message: "",
            },
            functions: {
                order: [],
            }
        });
    }

    clearFunction() {
        this.setState({
            form: {
                name: "",
                params: "",
                description: "",
                code: "",
                message: "",
            },
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
                params = funct.params.split(",");
            else
                params = [];
            try {
                //check if code can be expanded
                const expanded_code = expand_macros(code, this.state.functions);
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
            alert('We need both name and code filled out!!!')
        }
    } //addUserDefinedFunction

    render() {
        return (
            <div id='expert' >
                {console.log('rendering expert')}
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
                />
                <ResizablePanels
                    bkcolor="#353b48"
                    displayDirection="row"
                    width="100%"
                    height="100vh"
                    panelsSize={[15, 43, 42]}
                    sizeUnitMeasure="%"
                    resizerColor="#353b48"
                    resizerSize="10px"
                >
                    <SidePanelCard
                        codeRef={this.codeRef}
                        deleteFunction={this.deleteFunction.bind(this)}
                        getFormState={() => this.getFormState()}
                        getStateFunctions={() => this.getStateFunctions()}
                        getFunctions={() => this.getFunctions()}
                        setCode={(txt) => { this.setFormValue('code', txt) }}
                        setFunctionsOrder={(_order) => this.setFunctionsOrder(_order)}
                    />
                    <WorkspaceCard
                        code={this.getFormValue('code')}
                        codeRef={this.codeRef}
                        description={this.getFormValue('description')}
                        name={this.getFormValue('name')}
                        nameRef={this.nameRef}
                        message={this.getFormValue('message')}
                        params={this.getFormValue('params')}
                        setCode={(code) => this.setFormValue("code", code)}
                        setDescription={(description) => this.setFormValue("description", description)}
                        setName={(name) => this.setFormValue("name", name)}
                        setParams={(params) => this.setFormValue("params", params)}
                    />
                    <CanvasCard
                        code={this.getFormValue('code')}
                        getFormState={() => this.getFormState()}
                        getStateFunctions={() => this.getStateFunctions()}
                        setMessage={(message) => this.setFormValue("message", message)}
                    />
                </ResizablePanels>
            </div>
        );
    }
}

export default Expert;
