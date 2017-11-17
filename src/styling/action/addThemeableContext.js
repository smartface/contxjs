/**
 * Creates an action that add a context to ThemeContext as a Context element.
 * 
 * @params {function} - Context wrapper function
 */
export default function addThemeableContext(context){
    return {
        type: "addThemeableContext",
        context
    };
}
