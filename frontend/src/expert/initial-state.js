// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/**
 * 2020-07-24 Version 1.0
 * 
 * Here we have two constants where we store the initial state of the function form
 * and the initial state of the Popup Modal. These objects should be readOnly. Thus,
 * we only export getter functions which return objects with the same key-value
 * assignments.
 */

/**
 * The initial state of the function form
 */
const initialForm = {
    code: "",
    default_params: "",
    description: "",
    message: "",
    name: "",
    params: "",
}

/** 
 * The initial state of the Popup
 */
const initialPopup = {
    isOpen: false,
    message: 'STUB',
    onConfirm: () => { console.log('STUB') },
}

/**
 * The returns an object identical to initialForm
 */
export function getInitialForm() {
    return {
        ...initialForm
    }
} // getInitialForm()


/**
 * The returns an object identical that represents the intended initial state of
 * the Expert Component.
 */
export function getInitialState() {
    return {
        form: {
            ...initialForm,
        },
        functions: {
            _order: [],
        },
        popup: {
            ...initialPopup,
        }
    }
} // getInitialState()
