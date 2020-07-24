const initialForm = {
    code: "",
    default_params: "",
    description: "",
    message: "",
    name: "",
    params: "",
};

export function getInitialForm(){
    return {
        ...initialForm
    }
}

export function getInitialState() {
    return {
        form: {
            ...initialForm,
        },
        functions: {
            order: [],
        },
    }
}