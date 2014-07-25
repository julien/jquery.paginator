describe('jquery.paginator test suite', function () {
  'use strict';

  var $fixtures
    , $items
    , $next
    , $prev
    , $nav
    , tplItem
    , tplPagination;

  beforeEach(function () {
    var id = 'js-fixtures';

    if (!document.getElementById(id)) {
      $fixtures = $('<div>').attr('id', id);
      document.body.appendChild($fixtures[0]);
    }

    $fixtures.html(window.__html__['test/fixture.html']);
    $items = $fixtures.find('#items');
    $next = $fixtures.find('[data-js="next"]');
    $prev = $fixtures.find('[data-js="prev"]');
    $nav = $fixtures.find('[data-js="pagination"]');

    if (!tplItem) {
      tplItem = Handlebars.compile($fixtures.find('#item-template').html());
    }

    if (!tplPagination) {
      tplPagination = Handlebars.compile($fixtures.find('#pagination-template').html());
    }
  });

  afterEach(function () {
    if ($fixtures) {
      $fixtures.remove();
    }
  });
  
  it('should be defined and should be a function', function () {
    expect($fixtures.paginator).toBeDefined();
    expect($.isFunction($fixtures.paginator)).toBeTruthy();
  });

  
  it('should have 0 children when not using DOM and initialized', function () {
    var paginator;
    $fixtures.paginator({ placeholder: $items });
    
    paginator = $fixtures.data('paginator');
    expect(paginator.totalItems).toEqual(0);
    expect(paginator.page).toEqual(0);
    expect(paginator.totalPages).toEqual(0);
    expect(paginator.itemsPerPage).toEqual(5);
    expect(paginator.change).toBeUndefined();
    expect(paginator.$el.is($fixtures)).toBeTruthy();
  });

  it('initialization', function () {
    var items = []
      , i = 0
      , l = 100
      , paginator;

    for (; i < l; i++) {
      items.push({name: 'item' + i, price: Math.round(10 + Math.random() * 100 - 50)});
    }

    $fixtures.paginator({ 
      items: items,
      placeholder: $items,
      template: tplItem 
    });
    paginator = $fixtures.data('paginator');
   
    expect(paginator.items.length).toEqual(100);
    expect(paginator.totalItems).toEqual(100);
    expect(paginator.page).toEqual(1);
    expect(paginator.totalPages).toEqual(20);
    expect(paginator.currentChildren().length).toEqual(5);
  });

  it('adding an element', function () {
    var item = {name: 'item' + 1, price: Math.round(10 + Math.random() * 100 - 50)}
      , paginator;

    $fixtures.paginator({ 
      items: [],
      placeholder: $items,
      template: tplItem 
    });
    paginator = $fixtures.data('paginator');

    expect(paginator.items.length).toEqual(0);
    expect(paginator.totalItems).toEqual(0);
    expect($.isArray(paginator.items)).toBeTruthy();

    paginator.add(item);

    expect(paginator.items.length).toEqual(1);
    expect(paginator.page).toEqual(1);
    expect(paginator.totalPages).toEqual(1);
    expect(paginator.currentChildren().length).toEqual(1);
  });


  it('removing an element', function () {
    var paginator;
    $fixtures.paginator({ 
      items: [],
      placeholder: $items,
      template: tplItem 
    });
    paginator = $fixtures.data('paginator');
   
    paginator.add({name: 'item1', price: Math.round(10 + Math.random() * 100 - 50)});
    paginator.add({name: 'item2', price: Math.round(10 + Math.random() * 100 - 50)});
    paginator.add({name: 'item3', price: Math.round(10 + Math.random() * 100 - 50)});

    expect(paginator.currentChildren().length).toEqual(3);

    paginator.remove(2);
    expect(paginator.currentChildren().length).toEqual(2);
    expect(paginator.totalItems).toEqual(2);


    // try to remove an element with wrong index
    paginator.remove(7);
    expect(paginator.currentChildren().length).toEqual(1);
    expect(paginator.totalItems).toEqual(1);

    paginator.remove(-1);
    expect(paginator.currentChildren().length).toEqual(0);
    expect(paginator.totalItems).toEqual(0);
  });


  it('navigate next', function () {
    var paginator, i, l, item, items = [];

    for (i = 0, l = 11; i < l; i++) {
      items.push({name: 'item' + i, price: Math.round(10 + Math.random() * 100 - 50)});
    }

    $fixtures.paginator({ 
      items: items,
      placeholder: $items,
      template: tplItem 
    });

    paginator = $fixtures.data('paginator');
   
    expect(paginator.currentChildren().length).toEqual(5);
    expect(paginator.totalPages).toEqual(3);

    paginator.next();
    expect(paginator.page).toEqual(2);
    expect(paginator.currentChildren().length).toEqual(5);

    paginator.next();
    expect(paginator.page).toEqual(3);
    expect(paginator.currentChildren().length).toEqual(1);
  });

  
  it('navigate prev', function () {
    var paginator, i, l, item, items = [];

    for (i = 0, l = 11; i < l; i++) {
      items.push({name: 'item' + i, price: Math.round(10 + Math.random() * 100 - 50)});
    }

    $fixtures.paginator({ 
      items: items,
      placeholder: $items,
      template: tplItem 
    });

    paginator = $fixtures.data('paginator');
   
    expect(paginator.currentChildren().length).toEqual(5);
    expect(paginator.totalPages).toEqual(3);

    paginator.next();
    paginator.next();
    paginator.next();

    expect(paginator.page).toEqual(3);
    expect(paginator.currentChildren().length).toEqual(1);

    paginator.prev();
    
    expect(paginator.page).toEqual(2);
    expect(paginator.currentChildren().length).toEqual(5);

    paginator.prev();

    expect(paginator.page).toEqual(1);
    expect(paginator.currentChildren().length).toEqual(5);

    paginator.prev();
    expect(paginator.page).toEqual(1);
  });

});
