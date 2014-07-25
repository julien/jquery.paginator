;(function ( $, window, document, undefined ) {

  var pluginName = 'paginator'
    , defaults = {
        items: [],
        itemsPerPage: 5,
        placeholder: null,
        template: null,
        useDom: false
      };

  function Paginator (element, options) {
    this.element = element;

    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    
    this.$el = $(this.element);
    this.$placeholder = this.settings.placeholder || $(this.element);
    this.template = this.settings.template;

    this.items = [];
    this.totalItems = 0;
    this.itemsPerPage = this.settings.itemsPerPage;
    this.itemIdxStart = 0;
    this.itemIdxEnd = 0;
    this.page = 0;
    this.totalPages = 0;

    this.changeHandler = $.isFunction(this.settings.change) ? this.settings.change : $.noop; 

    this.init();
  }

  $.extend(Paginator.prototype, {

    init: function () {
      var tmp;

      if (this.settings.items) {
        this.items = this.settings.items;
      }
      
      if (this.settings.useDom) {
        this.items = this.$placeholder.children().clone();
        this.$placeholder.empty();
      }

      this.totalItems = this.items.length;
      this._update();

      if (this.items.length) {
        this.render(this.currentItems());

        this.changeHandler({ 
          start: 1, // Since this is the first render
          end:   this.itemIdxEnd,
          total: this.totalItems
        });
      }
    },

    empty: function () {
      if (this.currentChildren().length) {
        this.$placeholder.empty();
      }
    },

    _notify: function () {
      this.changeHandler({ 
        start: this.itemIdxStart + 1,
        end:   this.itemIdxStart + this.itemsPerPage,
        total: this.totalItems
      });
    },

    _update: function () {

      var perPage = this.itemsPerPage
        , total = this.totalItems
        , numPages = 0
        , end;

      if (total && perPage) {
        numPages = Math.floor(total / perPage);

        if (total % perPage > 0) {
          numPages++;
        }
        this.totalPages = numPages;

        if (this.page < 1) {
          this.page = 1;
        }

        this.itemIdxStart = (this.page - 1) * this.itemsPerPage;

        end = this.itemIdxStart + this.itemsPerPage;
        this.itemIdxEnd = end > this.totalItems ? this.totalItems : end;
      }
    },

    currentChildren: function () {
      return this.$placeholder.children();
    },

    currentItems: function () {
      return this.items.slice(this.itemIdxStart, this.itemIdxEnd);
    },

    render: function (data) {
      var i, l, tpl;

      if (!this.settings.useDom && this.template) {
        if ($.isArray(data)) {
          this.empty();
          
          tpl = [];
          
          l = this.currentItems().length;
          for (i = 0; i < l; i++) {
            tpl[i] = this.template(data[i]);
          }
          this.$placeholder.append(tpl.join(''));
        } else if ($.isPlainObject(data)) {
          tpl = this.template(data);
          this.$placeholder.append(tpl);  
        }

      } else if (this.settings.useDom) {
        this.empty(); 
        this.$placeholder.append(this.currentItems());
      }
    },

    add: function (item) {
      var current;
      if (!this.useDom) {
        current = this.currentChildren().length;

        this.items.push(item);
        this.totalItems = this.items.length;
        this._update();

        this.itemIdxEnd++;
        this._notify();

        if (current < this.itemsPerPage) {
          this.render(item);
        }
      }
    },

    remove: function (index) {
      var start, end;

      index = index < 0 ? 0 : index;
      index = index > this.items.length ? this.items.length : index;
      
      if (!this.items[index]) {
        index = this.items.length - 1;
      }

      if (!this.useDom) {

        start = this.itemIdxStart;
        end =   this.itemIdxEnd;

        if (index >= start && index <= end) {
          this.$placeholder.children().eq(index).remove();
        }

        if (this.items[index]) {
          this.items.splice(index, 1);
        
          this.totalItems = this.items.length;
          this._update();
          this._notify();
        }

      }
    },

    next: function () {
      var current = this.currentChildren().length
        , update = this.page < this.totalPages && current >= this.itemsPerPage;

      if (update) {
        this.page++;
        this._update();
        this.render(this.currentItems());
        this._notify();
      }
    },

    prev: function () {
      if (this.page > 1) {
        this.page--;
        this._update();
        this.render(this.currentItems());
        this._notify();
      }
    }
  });

  // Plugin wrapper 
  $.fn[pluginName] = function (options) {
    this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new Paginator(this, options));
      }
    });
    return this;
  };

})(jQuery, window, document);
