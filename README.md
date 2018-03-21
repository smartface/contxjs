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

-  **Action::type = addPageContextChild**
Adds specified component and their children to the PageContext and applies styles by class-name selectors.
	- *Action::contextName: string* - Unique context name to use as Component ID. It must be unique only in it's own layout.
	- *Action::childComponent: object* - Component instance to be added to context, 
	- *Action::classNames: string* - Class-name of component.
	- *initialProps: object* - Initial properties of component. (User properties)

- **Action.type => changeUserStyle** : 
Sets component userStyle.
	- *Action::userStyle:object*
- **Action.type => updateUserStyle** : 
Update component userStyle.
	- *Action::userStyle:object*
	-   ```js
        button.dispatch({
            type: "updateUserStyle",
            userStyle: {
                backgroundColor: "#AABBCC"
            }
        });
        ```
- **Action.type => removeChild** : 
Removes target component and it's children from context.
- **Action.type => removeChildren** : 
Removes target component's children from context.
- **Action.type => pushClassNames** : 
Pushes new className selectors to the target component.
	- *Action::classNames:string* for one classname
	- *Action::classNames:Array* for multiple classnames
	-   ```js
        button.dispatch({
            type: "pushClassNames",
            classNames: [".foo", ".bar"]
        });
        ```
	-   ```js
        button.dispatch({
            type: "pushClassNames",
            classNames: ".foo"
        });
        ```
- **Action.type => removeClassName** :
Removes className selector from specified component.
	- *Action::classNames:string* for one classname
	- *Action::classNames:Array* for multiple classnames
- **Action.type => invalidate** : 
Forces to update Context's actors and applies styles if they are changed.
- **Action.type => updateContext** : 
Adds new components to Context or removes ones that doesn't exist in the updated FlexLayout::children.

##### FlexLayout::addChild(childComponent:*, ?contextName: string, ?className: string, ?userStyle:StyleObject=null)

Adds specified component to target layout and if contextName is specified then 
dispatches addPageContextChild action to the Context.

```js
var button = new Button();
page.layout.addChild(button, "myButton", ".button", {
  width: 250,
  height: 250
});
```
or
```js
page.layout.addChild(button, "myButton", ".button", function(userProps) {
  userProps.width = 250;
  userProps.height = 250;
  return userProps;
});
```

#####  FlexLayout::removeChild(childComponent:object)

Removes specified component from target layout then dispatches removeChild action 
to the Context.

```js
// button component will be removed from both context and page layout
page.layout.removeChild(button);
```

##### FlexLayout::removeAll()

Removes target component's children then dispatches removeChildren action to 
the Context.

```js
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
