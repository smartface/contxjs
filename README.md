# Contxjs

## Styling

### Style Objects
A style object is similar to the CSS definitions. We create style-objects with selectors then we can use whenever we want to assign them to components. For example:

### Selectors
Styling Selectors are also similar to the CSS selectors. There are 2 kinds of selectors in the StylingObject.

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
Run-time directives are ran at every style request by @smartface/styler, when making request to style by Styler and override the owner selector's properties.

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

TODO: Add example
TODO: Describe Directive rule

#### Creating Runtime Rules
TODO: Creating Run-time Rules

## Styling Conventions and Best Practices
We assumes you know that what The [BEM](http://getbem.com/) convention is. As a summary, according to the [BEM](http://getbem.com/), pages are built with Blocks, Blocks are built with Elements and another Blocks. And Elements and Blocks have Modifiers that are using to manipulate their display properties. 

In order to imply which one is for the blocks we can use "\__" or "\_" and for the elements we can use "\__" or "\_" and for the modifiers we can use "\--" or "\-".

For example:
In the CSS 
```css
parentBlock {
...
}
parentBlock_element {
...
}

parentBlock_element-modifier {
...
}

parentBlock_childBlock--modifier {
...
}

/* or with modifiers*/

searchBlock_searchInputE{
}
searchBlock_searchInput-activated{
}
searchBlock_searchInput-deactivated{
}

/* or with modifiers as variable */
searchBlock_searchInput-isActivated--true{
...
}
searchBlock_searchInput-isActivated--false{
...
}
searchBlock_searchInput-color{
...
}
searchBlock_searchInput-color--red{
...
}

```

This method make styles more readable, maintainable and easier understanding 

## Context Management
Each context encapsulates behaviors and apply theme to decorated components that come from outside of the context via Context's Actors and Reducers.

### Contx/Smartface/pageContext
PageContext create style-able Smartface pages and components so that we can manipulate them using style-objects and selectors. Smartface UIEditor Transpiler generates connection between Pages and PageContext and automatically adds components that they are created via Smartface UIEditor. To add Components dynamically, for instance they might be images that should be created after an api, you must use PageContext's actions.

#### Contx/Smartface/pageContext API
##### FlexLayout::children: object
When PageContext is initialized for the first time then it creates component view-tree recursively using FlexLayout's children property.

##### Component::dispatch(action:object)
To manipulate Context's states and behaviors using explicitly defined built-in or custom actions that trigger Context's reducers in order to run behaviors. It's same all pages and components only in a PageContext.

##### Contx/Smartface/Actions/

-  **Action::type = addPageContextChild**
Adds the specified Component and their children to the PageContext and applies styles by class-name selectors.
	- *Action::contextName: string* - Unique context name to use as Component ID. It must be unique only for same container components.
	- *Action::childComponent: object* - Component instance that will be added to context, 
	- *Action::classNames: string* - Class-name selectors of the specified component.
	- *initialProps: object* - Initial properties of the specified component.

- **Action::type = changeUserStyle** : 
Sets component userStyle.
	- *Action::userStyle:object*
- **Action::type = updateUserStyle** : 
	- *Action::userStyle:object*
Update component userStyle.
- **Action::type = removeChild** : 
Removes target component and it's children from context.
- **Action::type = removeChildren** : 
Removes target component's children from context.
- **Action::type = pushClassNames** : 
Pushes new className selectors to the target component in order to manipulate component properties.
	- *Action::classNames:string*
- **Action::type = removeClassName** :
Removes className selector from the specified component's actor in the Context.
	- *Action::className:string* 
- **Action::type = invalidate** : 
Forces to update Context's Actors and applies styles if they are changed.
- **Action::type = updateContext** : 
Adds new components to Context or removes ones that doesn't exists in the updated FlexLayout::children.

##### FlexLayout::addChild( childComponent:*, ?contextName: string, ?className: string, ?userStyle:StyleObject=null )

Adds specified component to the FlexLayout instance and if contextName is specified then dispatches addPageContextChild action to the Context.

#####  FlexLayout::removeChild(childComponent:object)

Removes specified component from FlexLayout instance then dispatches removeChild action to the Context.

##### FlexLayout::removeAll()

Removes specified component's children then dispatches removeChildren action to the Context.

#### Life-Cycle Events
##### Component::didComponentLeave

When a component is removed from the Context and If the component has didComponentLeave method then it's triggered.

##### Component::didComponentEnter(dispatch:function)

When a component initialized in the Context and If the component has didComponentEnter method and then it's triggered by passing its dispatch method. If not, dispatch method will be assigned to component directly.

##### Component::onError(error:Error)

If an error is occcured while an operation is running for a component, for example new properties assignment, and the component has onError method then the error is passed to onError method of the component. If not and then the context throws the error.
 
