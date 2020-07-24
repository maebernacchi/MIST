const initialForm = {
    code: "",
    default_params: "",
    description: "",
    message: "",
    name: "",
    params: "",
};

const initialPopup = {
    isOpen: false,
    message: 'STUB',
    onConfirm: ()=>{console.log('STUB')},
}

export function getInitialForm() {
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
        popup: {
            ...initialPopup,
        }
    }
}