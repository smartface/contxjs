[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
![npm version](https://img.shields.io/npm/v/@smartface/contx.svg?style=flat)

# Contxjs

## Styling

### Style Objects
A style object is similar to a CSS definition. We create style objects with selectors then we can use whenever we want to assign them to components. For example:

### Selectors
Styling selectors are also similar to the CSS selectors. There are 2 kinds of selectors.

- "." ClassName selector
- "#" Element ID selector (Just a convention, in fact it's completely same with the classname selector)

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
}
```


## Styling Directives and Rules

#### Nested Selectors
```js

 const styleObject = {
   //base classname
   ".calendar":{
     // sub classname of .calendar, it interits all styles from base-className .calendar. Usage: .calendar.size
     ".size":{
       right:0,
       left:0,
       top:0,
       height:360,
       paddingLeft:0,
       paddingRight:0
       // sub classname of .size, it interits all styles from base-className .calendar.size. Usage: .calendar.size.big
       ".big": {
	    height: 600
       }
     }
   };

```

Different from CSS, nested selectors inherit properties from parents and override them if they contain same properties.

#### "&" Parent Selector

Parent selector is a useful tool. For instance you want to use naming conventions like BEM(Block, Element, Modifier) then parent selector helps you to create well documented selectors. For example:

I have a component that name is header and it contains other components that are named **navbar**, **yearLabel** and **arrow**. In the BEM convention, **header** component is our block and these nested components are its elements. Then we can create style object as below. 

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
Build-time directives are run once style-objects are compiled by Styler.

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
  ".childComponent":{
    "@extend": ".baseComponent,.anotherBaseComponent"
  }
}
```

### Run-time Directives
Run-time directives are run for each style request by @smartface/styler, when making request to Styler, parent selector's properties are overriden if necessary.

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

## Styling Conventions and Best Practices
We assume that you know what [BEM](http://getbem.com/) convention is. As a summary, according to [BEM](http://getbem.com/), pages are built with blocks, blocks are built with elements and another blocks. Elements and blocks have modifiers that are used to manipulate their display properties. 

For the blocks we can use "\__" or "\_" and for the elements we can use "\__" or "\_" and for the modifiers we can use "\--" or "\-".

For example:
In the CSS 
```css
.parentBlock {
...
}
.parentBlock_element {
...
}

.parentBlock_element-modifier {
...
}

.parentBlock_childBlock--modifier {
...
}

/* or with modifiers*/

.searchBlock_searchInputE{
}
.searchBlock_searchInput-activated{
}
.searchBlock_searchInput-deactivated{
}

/* or with modifiers as variable */
.searchBlock_searchInput-isActivated--true{
...
}
.searchBlock_searchInput-isActivated--false{
...
}
.searchBlock_searchInput-color{
...
}
.searchBlock_searchInput-color--red{
...
}

```

This method makes styles more readable, maintainable and easier to understand.

## Context Management
Each context encapsulates behaviors and applies theme to decorated components which are came from outside of the context via Context's actors and reducers.

### Contx/Smartface/pageContext
PageContext creates stylable Smartface pages and components so that we can manipulate them using style-objects and selectors. Smartface UI-Editor Transpiler connects Pages and PageContext. To add components dynamically in runtime, (For instance there might be images that should be created after an api call) PageContext's actions must be used.

#### Contx/Smartface/pageContext API
##### FlexLayout::children: object
When PageContext is initialized for the first time then it creates component view-tree recursively using FlexLayout's children property.

##### Component::dispatch(action:object)
To manipulate Context's states and behaviors, explicitly defined or custom actions must be used so that Context's reducers are triggered.

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
	- *Action::userStyle:object*
Update component userStyle.
- **Action.type => removeChild** : 
Removes target component and it's children from context.
- **Action.type => removeChildren** : 
Removes target component's children from context.
- **Action.type => pushClassNames** : 
Pushes new className selectors to the target component in order to manipulate component properties.
	- *Action::classNames:string* for one classname
	- *Action::classNames:Array* for multiple classnames
- **Action.type => removeClassName** :
Removes className selector from specified component.
	- *Action::className:string* 
- **Action.type => invalidate** : 
Forces to update Context's actors and applies styles if they are changed.
- **Action.type => updateContext** : 
Adds new components to Context or removes ones that doesn't exist in the updated FlexLayout::children.

##### FlexLayout::addChild(childComponent:*, ?contextName: string, ?className: string, ?userStyle:StyleObject=null)

Adds specified component to the FlexLayout instance and if contextName is specified then dispatches addPageContextChild action to the Context.

#####  FlexLayout::removeChild(childComponent:object)

Removes specified component from FlexLayout instance then dispatches removeChild action to the Context.

##### FlexLayout::removeAll()

Removes specified component's children then dispatches removeChildren action to the Context.

#### Life-Cycle Events
##### Component::componentDidLeave

When a component is removed from the Context and if the component has componentDidLeave method then it's triggered.

##### Component::componentDidEnter(dispatch:function)

When a component initialized in the Context and if the component has componentDidEnter method and then it's triggered by passing it's dispatch method. If not, dispatch method will be assigned to component directly.

##### Component::onError(error:Error)

If an error occcurs while an operation is being performed for a component, for example assignment of new properties, and the component has onError method then the error is passed to onError method of the component. If not and then the context throws the error.
