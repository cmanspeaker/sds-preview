const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
    name: 'css/variables',
    formatter: function (dictionary, config) {
      return `${this.selector} {
        ${dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}
      }`
    }
  });  

  StyleDictionaryPackage.registerTransform({
    name: 'shadow/css',
    type: 'value',
    // necessary in case the color is an alias reference, or the shadows themselves are aliased
    transitive: true,
    matcher: (token) => token.type === 'boxShadow',
    transformer: (token) => {
      // allow both single and multi shadow tokens
      const shadow = Array.isArray(token.value) ? token.value : [token.value];
  
      const value = shadow.map((s) => {
        const { x, y, blur, color, type } = s;
        // support inset shadows as well
        return `${type === 'innerShadow' ? 'inset ' : ''}${x}px ${y}px ${blur}px ${color}`;
      });
  
      return value.join(', ');
    },
  });

StyleDictionaryPackage.registerTransform({
    name: 'sizes/px',
    type: 'value',
    matcher: function(prop) {
        // You can be more specific here if you only want 'em' units for font sizes    
        return ["font-size", "letter-spacing", "line-height", "spacer", "br"].includes(prop.attributes.category);
    },
    transformer: function(prop) {
        // You can also modify the value here if you want to convert pixels to ems
        return parseFloat(prop.original.value) + 'px';
    }
    });

function getStyleDictionaryConfig(theme) {
  return {
    "source": [
      `tokens/${theme}.json`,
    ],
    "platforms": {
      "web": {
        "transforms": ["attribute/cti", "name/cti/kebab", "sizes/px","shadow/css"],
        "buildPath": `build/css/`,
        "prefix": `sds`,
        "files": [{
            "destination": `${theme}.css`,
            "format": "css/variables",
            "selector": `.${theme}-theme`
          }]
      },
      "scss": {
        "transforms": ["attribute/cti", "name/cti/kebab", "sizes/px","shadow/css"],
        "buildPath": `build/scss/`,
        "prefix": `sds`,
        "files": [{
          "destination": `${theme}.scss`,
          "format": "scss/variables",
          "selector": `.${theme}-theme`
        }]
      },
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['foundation', 'light', 'brand-citrus'].map(function (theme) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

    StyleDictionary.buildPlatform('web');
    StyleDictionary.buildPlatform('scss');

    console.log('\nEnd processing');
})

console.log('\n==============================================');
console.log('\nBuild completed!');