[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/smartface/contxjs/blob/master/LICENSE)
![npm version](https://img.shields.io/npm/v/@smartface/contx.svg?style=flat)

# Contxjs

## Styling
You may want to take a look at styler [documentation](https://github.com/smartface/styler/blob/master/README.md) 
to have a better understanding of how Context works.

## Context Management
Each context encapsulates some behaviors and applies theme to decorated components 
which are came from outside of the context using Context's actors and reducers.

### Contx/Smartface/pageContext
PageContext creates stylable Smartface pages and components so that we can manipulate 
them using style-objects and selectors. Smartface UI-Editor Transpiler connects 
Pages and PageContext. To add components dynamically in runtime, (For instance 
there might be images that should be created after an api call) PageContext's 
actions must be used.

#### Contx/Smartface/pageContext API
##### FlexLayout::children: object
When PageContext is initialized for the first time then it creates component 
view-tree recursively using FlexLayout's children property.

##### Component::dispatch(action:object)
To manipulate Context's states and behaviors, explicitly defined or custom actions 
must be used so that Context's reducers are triggered.

##### Contx/Smartface/

-  **Action::type = addChild**
Adds specified component and their children to the PageContext and applies styles 
by class-name selectors.
	- *Action::name: string* - Component's name is to use like an unique id. It must be unique only in it's belonging layout.
	- *Action::component: object* - Component instance to be added to context.
	- *Action::classNames: string* - Class-name of component.
	- *Action::userStyle: object* - Initial style of component. (User properties)

- **Action.type => changeUserStyle** : 
Overwrites component userStyle.
	- *Action::userStyle:object*
	- :warning: This will change component's current user-style (User properties).
 	```js
        myButton.dispatch({
            type: "changeUserStyle",
            userStyle: {
                backgroundColor: "#AABBCC"
            }
        });
	//or
        myButton.dispatch({
            type: "changeUserStyle",
            userStyle: (style) => {
	      style.backgroundColor = "#AABBCC";
	      return style
	    }
        });
        ```

- **Action.type => updateUserStyle** : 
Updates component userStyle.
	- *Action::userStyle:object*
	-   ```js
        myButton.dispatch({
            type: "updateUserStyle",
            userStyle: {
                backgroundColor: "#AABBCC"
            }
        });
        ```

- **Action.type => removeChild** : 
Removes target component and it's children from context.
    - :warning: This won't remove target component from layout.
	-   ```js
        myLayout.dispatch({
            type: "removeChild"
        });
        ```

- **Action.type => removeChildren** : 
Removes target component's children from context.
    - :warning: This won't remove target component's children from layout.
	-   ```js
        myLayout.dispatch({
            type: "removeChildren"
        });
        ```

- **Action.type => pushClassNames** : 
Pushes new className selectors to the target component.
	- *Action::classNames:string* for one classname
	- *Action::classNames:Array* for multiple classnames
	- :warning: This action won't work if target component has the class name to 
	be added.
	-   ```js
        myButton.dispatch({
            type: "pushClassNames",
            classNames: [".foo", ".bar"]
        });
        ```
	-   ```js
        myButton.dispatch({
            type: "pushClassNames",
            classNames: ".foo"
        });
        ```

- **Action.type => removeClassName** :
Removes className selector from specified component.
	- *Action::className:string* for one classname
	- *Action::className:Array* for multiple classnames
	-   ```js
        myButton.dispatch({
            type: "removeClassName",
            className: [".foo", ".bar"]
        });
        ```
	-   ```js
        myButton.dispatch({
            type: "removeClassName",
            className: ".foo"
        });
        ```

- **Action.type => invalidate** : 
Forces to update Context's actors and applies styles if they are changed.
	-   ```js
        myButton.dispatch({
            type: "invalidate"
        });
        ```

- **Action.type => updateContext** : 
Adds new components to Context or removes ones that doesn't exist in the updated FlexLayout::children.

##### FlexLayout::addChild(childComponent:*, ?contextName: string, ?className: string, ?userStyle:StyleObject=null)

Adds specified component to target layout and if contextName is specified then 
dispatches addPageContextChild action to the Context.
-   ```js
    var myButton = new Button();
    page.layout.addChild(myButton, "myButton", ".button", {
      width: 250,
      height: 250
    });
    ```
or
-   ```js
    page.layout.addChild(myButton, "myButton", ".button", function(userProps) {
      userProps.width = 250;
      userProps.height = 250;
      return userProps;
    });
    ```

#####  FlexLayout::removeChild(childComponent:object)

Removes specified component from target layout then dispatches removeChild action 
to the Context.

-   ```js
    // myButton component will be removed from both context and page layout
    page.layout.removeChild(myButton);
    ```

##### FlexLayout::removeAll()

Removes target component's children then dispatches removeChildren action to 
the Context.

-   ```js
    // Children of page will be removed from both context and page layout
    page.layout.removeAll();
    ```

#### Life-Cycle Events

##### Component::componentDidLeave

When a component is removed from the Context and if the component has componentDidLeave 
method then it's triggered.

##### Component::componentDidEnter(dispatch:function)

When a component initialized in the Context and if the component has componentDidEnter 
method and then it's triggered by passing it's dispatch method. If not, dispatch 
method will be assigned to component directly.

##### Component::onError(error:Error)

If an error occcurs while an operation is being performed for a component, for 
example assignment of new properties, and the component has onError method then 
the error is passed to onError method of the component. If not and then the 
context throws the error.

### Tricks

##### Attributes

Some properties are called [attributes](https://github.com/smartface/contxjs/blob/master/attributes.md).
Context **does not** handle attribute properties.

If you want to set an attribute, just set it directly like below:

```js
button.text = "Text";
```
