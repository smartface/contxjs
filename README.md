# contxjs

#Context Management


##Styling

**Style Objects**
A style object is similar to the CSS definitions. We create style-objects with selectors then we can use whenever we want to assign them to components. For example:

**Selectors**
Styling Selectors are also similar to the CSS selectors. There are 2 kind of selectors in the StylingObjects.

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


##Directives and Rules
**Nested Rules**

Nested rules allows selector rules to be nested within one another. 

**Nested Selectors**

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

Differently from CSS, The Nested Selectors inherit properties from parents and override them if they contain same properties.

**"&" Parent Selector**
Parent Selector is an useful tool. For instance you want to use naming conventions like BEM then parent selector helps you to create well documented selectors. For example:

I have a component that name is header and it contains other components that are named **navbar**, **yearLabel** and **arrow**. In the BEM convention, **header** component is our block These nested components are its elements. Then we can create style-object as below. 


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


