var handlebars = require("handlebars");

handlebars.registerHelper('limit', function (arr: any, limit: any) {  
    if (!Array.isArray(arr)) { return []; }
    return arr.slice(0, limit);
  });

  handlebars.registerHelper('ifEquals', function(arg1: any, arg2: any, options: any) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });

  handlebars.registerHelper('ifNotEquals', function(arg1: any, arg2: any, options: any) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
  });

  handlebars.registerHelper ('truncate', function (str: string, len: number) {
    if (str.length > len) {
        var new_str = str.substr (0, len+1);

        while (new_str.length) {
            var ch = new_str.substr ( -1 );
            new_str = new_str.substr ( 0, -1 );

            if (ch == ' ') {
                break;
            }
        }

        if ( new_str == '' ) {
            new_str = str.substr ( 0, len );
        }

        return new handlebars.SafeString ( new_str +'...' ); 
    }
    return str;
});

  
  handlebars.registerHelper({
    eq: (v1: any, v2: any) => v1 === v2,
    ne: (v1: any, v2: any) => v1 !== v2,
    lt: (v1: any, v2: any) => v1 < v2,
    gt: (v1: any, v2: any) => v1 > v2,
    lte: (v1: any, v2: any) => v1 <= v2,
    gte: (v1: any, v2: any) => v1 >= v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    listlt: (v1: any, v2: any) => v1 + 1 < v2,
  });

  handlebars.registerHelper('escape', function(variable: any) {
    return variable.replace(/(['"])/g, '\\$1');
  });

  handlebars.registerHelper('getcover', function(images: any) {
    for (let image of images) {
      if (image.cover) {
        return image.uri
      }
    }

    return "8e7eae32b1607415be4f31babe3668a2"
  });

  export default handlebars;