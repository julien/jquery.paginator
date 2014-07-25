jQuery paginator
----------------

A very basic jQuery "pagination" plugin.

Don't expect too much, work in progress.

**Example usage:**

```
<div id="container">
  <ul class="inline noitem">
    <li><button data-js="prev">Prev</button></li>
    <li><button data-js="next">Next</button></li>
  </ul>
  <div class="sep"></div>

  <ul id="items"></ul>

  <p data-js="pagination"></p>
</div>

<script type="text/template" id="tpl-item">
  <li><span class="item-name">{{name}}</span>
    <span class="item-price">{{price}}&euro;</span></li>
</script>
```


```
var $container = $('#container')
  , $placeholder = $container.find('#items')
  , tpl = Handlebars.compile($('#tpl-item').html());

$container.pagination({
  items:        [],            // List of items to render (optional)
  placeholder:  $placeholder,  // If specified will be used to render the collection items  (optional)
  itemsPerPage: 5,             // Number of items to display per page (default 5),
  template:     tpl,           // The template function to be used for rendering items
  change: function (data) {}   // A handler which will be invoked on update (optional)
});
```

An example is provided in a static html file as well as in the test directory.

Installation etc...
--------------------

+ Make sure you have [Node.js](http://nodejs.org) installed

+ Install required [npm](http://npmjs.org) and [Bower](http://bower.io) dependencies
  `npm install`

  (`npm postinstall` calls `bower install`)

+ Run the tests with
  `npm test`

+ Lint the source with 
  `npm run lint`

+ Generate a minified version with 
  `npm run uglify`


License
-------

MIT



