# contxjs

## Styling

**Style Objects**
A style object is similar to the CSS definitions. We create style-objects with selectors then we can use whenever we want to assign them to components. For example:

**Selectors**
Styling Selectors are also similar to the CSS selectors. There are 2 kind of selectors in the StylingObject.

- "." ClassName selector
- "#" Element ID selectors (Just as a convention, in fact it's completely same with the classname selector)

```js

 const styleObject = {
   ".calendar":{
     "right":0,
     "left":0,
     "top":0,
     "height":360,
     "paddingLeft":0,
     "paddingRight":0
   },
   "#articleHeader":{
     "textColor":"#1775D0"
   }
```


## Styling Directives and Rules
### Nested Rules
Nested rules allows selector rules to be nested within one another. 

#### Nested Selectors
```js

 const styleObject = {
   ".calendar":{
     ".size":{
       right:0,
       left:0,
       top:0,
       height:360,
       paddingLeft:0,
       paddingRight:0
       ".big": {
	    height: 600
       }
     }
   };

```

Different from CSS, The Nested Selectors inherit properties from parents and override them if they contain same properties.

#### "&" Parent Selector

Parent Selector is an useful tool. For instance you want to use naming conventions like BEM(Block, Element, Modifier) then parent selector helps you to create well documented selectors. For example:

I have a component that name is header and it contains other components that are named **navbar**, **yearLabel** and **arrow**. In the BEM convention, **header** component is our block and these nested components are its elements. Then we can create style-object as below. 

```js
const styleObject = {
	"#header":{
		"&_monthLabel":{
			"textColor":"#1775D0"
		},
		"&_yearLabel":{
			"textColor":"#B1B1B4"
		},
		"&_arrow":{
			"flexProps":{
				"flexGrow":1,
				"textColor":"#B1B1B4"
			  }
		}  
	}
```

### Build-time Directives
Build-time directives are run once while style-objects are compiled by Styler.

#### @extend Rule

Extend rule provides inheritance between selectors so that selectors can inherit properties from another selectors.  **@extend** rule affects all nested-selectors of a selector but not with parent-selector rule(&). For example:

```js
const styles = {
  ".baseComponent":{
    width: 100,
    height: 200,
  },
  ".anotherBaseComponent":{
    width: 100,
    height: 200,
  },
  "childComponent":{
    "@extend": ".baseComponent,.anotherBaseComponent"
  }
}
```
#### Creating Build-time Rules
TODO: Extending Build-time Rules

### Run-time Directives
Run-time directives are run every time when making request to style by Styler and override the owner selector's properties.

```js
const styles = {
  ".baseComponent":{
    width: 100,
    height: 200
    "+anyRuleCreatedByUser:rule-params":{
	    "width": 400
	},
    "+anotherRuleCreatedByUser:rule-params":{
	    "width": 400,
	    "height": 500
	}
  }
}
```

#### Creating Runtime Rules
TODO: Creating Run-time Rules


## Context Management
Each context encapsulates behaviors and apply theme to decorated components that come from outside of the context via Context's Actors and Reducers.

### Page Context
Page context create style-able Smartface pages and components so that we can manipulate them using style-objects and selectors. Smartface UIEditor Transpiler generates connection between Pages and PageContext and automatically add static components via Smartface UIEditor. Dynamic Components for instance they might be images that should be created after an api call are able to only manually added. 

#### Page Context API
**FlexLayout::children: object**
When PageContext is initialized for the first time then it creates component view-tree recursively using FlexLayout's children property.

**Component::dispatch(action:object)**
To manipulate Context's states and behaviors using explicitly defined built-in or custom actions that trigger Context's reducers in order to run behaviors. It's same all pages and components only in a PageContext.

**Actions:**

-  **Action::type = addPageContextChild**
Adds the specified Component and their children to the PageContext and applies styles by class-name selectors.
	- *Action::contextName: string* - Unique context name to use as Component ID. It must be unique only for same container components.
	- *Action::childComponent: object* - Component instance that will be added to context, 
	- *Action::classNames: string* - Class-name selectors of the specified component.
	- *initialProps: object* - Initial properties of the specified component.

- **Action::type = removeChild** : 
Removes target component and it's children from context.
- **Action::type = removeChildren** : 
Removes target component's children from context.
- **Action::type = pushClassNames** : 
Pushes new className selectors to the target component in order to manipulate component properties.
	- *Action::classNames:string*
- **Action::type = removeClassName** :
Removes classNames selectors from the specified component.
	- *Action::classNames:string* 
- **Action::type = invalidate** : 
Force update for all components
- **Action::type = updateContext** : 
Adds new components to Context or removes ones that doesn't exists in the updated FlexLayout::children.

**FlexLayout::addChild(childComponent:*, ?contextName: string, ?className: string, ?initialProps:StyleObject)**

Adds specified component to the FlexLayout instance and if contextName is specified then dispatches **addPageContextChild** action to the Context.

**FlexLayout::removeChild(childComponent:object)**

Removes specified component from FlexLayout instance then dispatches **removeChild** action to the Context.

**FlexLayout::removeAll()**

Removes specified component's children then dispatches **removeChildren** action to the Context.


