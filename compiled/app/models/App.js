// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var addNodeView, checkKey, collectionNodes, menuView, nodeCollectionView, pasteHandler, vent;
    window.App = {
      Models: {},
      Collections: {},
      Views: {}
    };
    window.selectedNode = {
      modelView: null,
      offsetX: 0,
      offsetY: 0
    };
    window.Transform = {
      deltaX: 0,
      deltaY: 0,
      zoom: 1.0,
      centerX: 0,
      centerY: 0
    };
    window.mouse = {
      down: false,
      x: 0,
      y: 0
    };
    window.button = {
      selected: 'explore'
    };
    vent = _.extend({}, Backbone.Events);
    window.template = function(id) {
      return _.template($("#" + id).html());
    };
    $(document.body).mousemove(function(event) {
      var panX, panY, selectedNodeView;
      event.preventDefault();
      if (event.which === 1) {
        if (window.selectedNode.modelView) {
          selectedNodeView = window.selectedNode.modelView;
          return selectedNodeView.setAbsCoordinates(event.pageX - window.selectedNode.offsetX, event.pageY - window.selectedNode.offsetY);
        } else if (window.mouse.down) {
          panX = window.mouse.x - event.pageX;
          panY = window.mouse.y - event.pageY;
          window.Transform.deltaX -= panX * 1 / window.Transform.zoom;
          window.Transform.deltaY -= panY * 1 / window.Transform.zoom;
          window.mouse.x = event.pageX;
          window.mouse.y = event.pageY;
          return vent.trigger('pan');
        } else {
          window.selectedNode.modelView = null;
          return window.mouse.down = false;
        }
      }
    });
    $(document.body).on("DOMMouseScroll mousewheel wheel", function(e) {
      e.preventDefault();
      if (e.originalEvent.deltaY > 0) {
        window.Transform.centerX = $('body').width() / 2;
        window.Transform.centerY = $('body').height() / 2;
        window.Transform.zoom *= 1.2;
        vent.trigger('zoom');
        return console.log("Zoom in " + window.Transform.zoom);
      } else if (e.originalEvent.deltaY < 0) {
        window.Transform.centerX = $('body').width() / 2;
        window.Transform.centerY = $('body').height() / 2;
        window.Transform.zoom *= .8;
        vent.trigger('zoom');
        return console.log("Zoom out " + window.Transform.zoom);
      }
    });
    $(document.body).on("mouseup", function(e) {
      e.preventDefault;
      window.selectedNode.modelView = null;
      return window.mouse.down = false;
    });
    $(document.body).on("mousedown", function(e) {
      if (e.target.tagName === "BODY") {
        e.preventDefault();
        if (!window.selectedNode.modelView) {
          window.mouse.down = true;
          window.mouse.x = e.pageX;
          return window.mouse.y = e.pageY;
        }
      }
    });
    $(document.body).on("dblclick", function(e) {
      if (e.target.tagName === "BODY") {
        e.preventDefault();
        return vent.trigger('zoomToFit');
      }
    });
    $(document.body).on('click', function(e) {
      if (e.target.tagName === 'BODY' || e.target.tagName === 'li') {
        e.preventDefault();
        return vent.trigger(window.button.selected, e);
      }
    });
    checkKey = function(e) {
      e || e.preventDefault();
      e = e || window.event;
      console.log("Event is: " + e.keyCode);
      console.log("Active element is: " + document.activeElement.tagName);
      if (document.activeElement.parentNode.tagName !== "FORM") {
        if (e.keyCode === 38) {
          window.Transform.deltaY += 10 * 1 / window.Transform.zoom;
          vent.trigger('pan');
          return console.log("up arrow " + window.Transform.deltaY);
        } else if (e.keyCode === 40) {
          window.Transform.deltaY -= 10 * 1 / window.Transform.zoom;
          vent.trigger('pan');
          return console.log("down arrow " + window.Transform.deltaY);
        } else if (e.keyCode === 37) {
          window.Transform.deltaX += 10 * 1 / window.Transform.zoom;
          vent.trigger('pan');
          return console.log("left arrow " + window.Transform.deltaX);
        } else if (e.keyCode === 39) {
          window.Transform.deltaX -= 10 * 1 / window.Transform.zoom;
          vent.trigger('pan');
          return console.log("right arrow " + window.Transform.deltaX);
        } else if (e.keyCode === 73) {
          window.Transform.centerX = $('body').width() / 2;
          window.Transform.centerY = $('body').height() / 2;
          window.Transform.zoom *= 1.5;
          vent.trigger('zoom');
          return console.log(window.Transform.zoom);
        } else if (e.keyCode === 79) {
          window.Transform.centerX = $('body').width() / 2;
          window.Transform.centerY = $('body').height() / 2;
          window.Transform.zoom *= 0.67;
          vent.trigger('zoom');
          return console.log(window.Transform.zoom);
        }
      } else {

      }
    };
    document.onkeydown = checkKey;
    pasteHandler = function(e) {
      return vent.trigger('pasteImage', e);
    };
    window.addEventListener("paste", pasteHandler);
    App.Models.Node = (function(_super) {
      __extends(Node, _super);

      function Node() {
        return Node.__super__.constructor.apply(this, arguments);
      }

      Node.prototype.defaults = {
        username: "Mikey Testing T",
        text: 'Hack Reactor',
        top: null,
        left: null,
        imageData: null,
        imageSize: null,
        imageSizeValue: null
      };

      Node.prototype.validate = function(attrs) {
        if (attrs.text === null) {
          return "Text requires a valid string";
        }
      };

      Node.prototype.setAbsCoordinates = function(x, y) {
        var distFromCenterX, distFromCenterY, transX, transY, zoom;
        zoom = window.Transform.zoom;
        distFromCenterX = x - window.Transform.centerX;
        distFromCenterY = y - window.Transform.centerY;
        transX = window.Transform.centerX + (x - window.Transform.centerX) * 1 / zoom;
        transY = window.Transform.centerY + (y - window.Transform.centerY) * 1 / zoom;
        this.set({
          "left": transX - window.Transform.deltaX
        });
        return this.set({
          "top": transY - window.Transform.deltaY
        });
      };

      return Node;

    })(Backbone.Model);
    App.Views.Node = (function(_super) {
      __extends(Node, _super);

      function Node() {
        return Node.__super__.constructor.apply(this, arguments);
      }

      Node.prototype.tagName = 'li';

      Node.prototype.template = template('nodeTemplate');

      Node.prototype.initialize = function() {
        this.model.on('change', this.update, this);
        this.model.on('destroy', this.remove, this);
        vent.on('pan', this.zoom, this);
        return vent.on('zoom', this.zoom, this);
      };

      Node.prototype.events = {
        'click .edit': 'editNode',
        'click .delete': 'deleteNode',
        'mousedown': 'mouseDownSelectNode',
        'mouseenter': 'mouseenter',
        'mouseleave': 'mouseleave',
        'change .imageSizeSelector': 'changeImageSize',
        'dblclick': 'zoomToNode'
      };

      Node.prototype.zoomToNode = function() {
        var zoom;
        window.Transform.zoom = 1;
        zoom = 1;
        if (this.model.attributes.imageSize) {
          window.Transform.deltaX = $('body').width() / 2 - this.model.get('left') - this.$el.find('img').width() / zoom / 2;
          window.Transform.deltaY = $('body').height() / 2 - this.model.get('top') - this.$el.find('img').height() / zoom / 2;
          vent.trigger('zoom');
          return;
        }
        window.Transform.deltaX = $('body').width() / 2 - this.model.get('left') - this.$el.find('.text').width() / zoom / 2;
        window.Transform.deltaY = $('body').height() / 2 - this.model.get('top') - this.$el.find('.text').height() / zoom / 2;
        return vent.trigger('zoom');
      };

      Node.prototype.changeImageSize = function(e) {
        var $image, height, newSize, width;
        $image = this.$el.find('img');
        if ($image) {
          newSize = parseInt(e.target.value);
          width = '';
          height = '';
          if (newSize === 100) {
            $image.css('width', "");
            $image.css('height', "");
          } else {
            $image.css('width', "");
            $image.css('height', "");
            width = Math.round($image.width() * Math.sqrt(newSize) / 10);
            height = Math.round($image.height() * Math.sqrt(newSize) / 10);
            $image.css('width', width);
            $image.css('height', height);
          }
          return this.model.set({
            imageSize: {
              'width': width,
              'height': 'height',
              height: height
            },
            imageSizeValue: newSize
          });
        }
      };

      Node.prototype.mouseenter = function() {
        this.$el.find('.nodeMenu').css('visibility', 'visible');
        if (this.$el.find('img').length) {
          return this.$el.find('.imageSizeContainer').css('visibility', 'visible');
        }
      };

      Node.prototype.mouseleave = function() {
        this.$el.find('.nodeMenu').css('visibility', 'hidden');
        return this.$el.find('.imageSizeContainer').css('visibility', 'hidden');
      };

      Node.prototype.mouseDownSelectNode = function(e) {
        var nodePositionX, nodePositionY, offsetX, offsetY;
        nodePositionX = this.$el.position().left;
        nodePositionY = this.$el.position().top;
        offsetX = event.pageX - nodePositionX;
        offsetY = event.pageY - nodePositionY;
        return window.selectedNode = {
          modelView: this,
          offsetX: offsetX,
          offsetY: offsetY
        };
      };

      Node.prototype.editNode = function() {
        var currentNode, newText;
        newText = prompt("Edit the text:", this.model.get('text'));
        if (newText === null) {
          return;
        }
        currentNode = this.model;
        return currentNode.set({
          'text': newText
        });
      };

      Node.prototype.deleteNode = function() {
        if (confirm("Confirm delete")) {
          return this.model.collection.remove(this.model);
        }
      };

      Node.prototype.remove = function() {
        return this.$el.remove();
      };

      Node.prototype.zoom = function() {
        var distFromCenterX, distFromCenterY, transX, transY, x, y, zoom;
        x = this.model.get("left") + this.$el.width() / 2 + window.Transform.deltaX;
        y = this.model.get('top') + this.$el.height() / 2 + window.Transform.deltaY;
        zoom = window.Transform.zoom;
        distFromCenterX = x - window.Transform.centerX;
        distFromCenterY = y - window.Transform.centerY;
        transX = window.Transform.centerX + distFromCenterX * zoom;
        transY = window.Transform.centerY + distFromCenterY * zoom;
        this.$el.css({
          'transform': "scale(" + zoom + ")"
        });
        this.$el.css({
          'left': transX - this.$el.width() / 2
        });
        return this.$el.css({
          'top': transY - this.$el.height() / 2
        });
      };

      Node.prototype.setAbsCoordinates = function(x, y) {
        var distFromCenterX, distFromCenterY, transX, transY, zoom;
        zoom = window.Transform.zoom;
        distFromCenterX = x - window.Transform.centerX;
        distFromCenterY = y - window.Transform.centerY;
        transX = window.Transform.centerX + (x - window.Transform.centerX) * 1 / zoom;
        transY = window.Transform.centerY + (y - window.Transform.centerY) * 1 / zoom;
        this.model.set({
          "left": transX - window.Transform.deltaX
        });
        return this.model.set({
          "top": transY - window.Transform.deltaY
        });
      };

      Node.prototype.update = function() {
        var newPromptText;
        if ((this.model.changedAttributes().text)) {
          newPromptText = this.model.get('text');
          this.$el.find('.text').text(newPromptText);
          debugger;
        } else {
          return this.zoom();
        }
      };

      Node.prototype.render = function() {
        var $image, imageTag, template, x, y;
        template = this.template(this.model.toJSON());
        this.$el.html(template);
        this.$el.css('position', 'absolute');
        x = this.model.get("left");
        y = this.model.get('top');
        this.$el.css('left', x);
        this.$el.css('top', y);
        if (this.model.get('imageData') !== null) {
          imageTag = '<img class="pastedImage"/>';
          $image = $(imageTag).attr('src', this.model.get('imageData'));
          this.$el.append($image);
          if (this.model.get('imageSize')) {
            $image.css(this.model.get('imageSize'));
          }
          if (this.model.get('imageSizeValue')) {
            this.$el.find(".imageSizeSelector").val(this.model.get('imageSizeValue'));
          }
        }
        this.zoom();
        return this;
      };

      return Node;

    })(Backbone.View);
    App.Collections.Nodes = (function(_super) {
      __extends(Nodes, _super);

      function Nodes() {
        return Nodes.__super__.constructor.apply(this, arguments);
      }

      Nodes.prototype.model = App.Models.Node;

      Nodes.prototype.firebase = new Firebase('https://resplendent-fire-9007.firebaseio.com/');

      return Nodes;

    })(Backbone.Firebase.Collection);
    App.Views.NodesCollection = (function(_super) {
      __extends(NodesCollection, _super);

      function NodesCollection() {
        return NodesCollection.__super__.constructor.apply(this, arguments);
      }

      NodesCollection.prototype.tagName = 'div';

      NodesCollection.prototype.initialize = function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('remove', this.removeOne, this);
        return vent.on('zoomToFit', this.zoomToFit, this);
      };

      NodesCollection.prototype.zoomToFit = function() {
        var height, heightZoom, maxX, maxY, minX, minY, width, widthZoom;
        minX = null;
        maxX = null;
        minY = null;
        maxY = null;
        this.collection.each(function(model) {
          var x, y;
          x = Math.round(model.get('left'));
          y = Math.round(model.get('top'));
          if (!minX || x < minX) {
            minX = x;
          }
          if (!maxX || x > maxX) {
            maxX = x;
          }
          if (!minY || y < minY) {
            minY = y;
          }
          if (!maxY || y > maxY) {
            return maxY = y;
          }
        });
        width = maxX - minX;
        height = maxY - minY;
        widthZoom = $('body').width() / width;
        heightZoom = $('body').height() / height;
        if (widthZoom < heightZoom) {
          window.Transform.zoom = widthZoom;
        } else {
          window.Transform.zoom = heightZoom;
        }
        window.Transform.deltaX = $('body').width() / 2;
        window.Transform.deltaY = $('body').height() / 2;
        return vent.trigger('zoom');
      };

      NodesCollection.prototype.rerender = function() {
        return this.collection.each(function(node) {
          return node.render();
        }, this);
      };

      NodesCollection.prototype.render = function() {
        this.collection.each(this.addOne, this);
        return this;
      };

      NodesCollection.prototype.addOne = function(node) {
        var nodeView;
        nodeView = new App.Views.Node({
          model: node
        });
        nodeView.$el.attr("id", node.id);
        this.$el.prepend(nodeView.render().el);
        return nodeView.render();
      };

      NodesCollection.prototype.removeOne = function(model, coll, opt) {
        return $("#" + model.id).detach();
      };

      return NodesCollection;

    })(Backbone.View);
    App.Views.AddNode = (function(_super) {
      __extends(AddNode, _super);

      function AddNode() {
        return AddNode.__super__.constructor.apply(this, arguments);
      }

      AddNode.prototype.el = '.inputContainer';

      AddNode.prototype.template = template('newNoteTemplate');

      AddNode.prototype.events = {
        'submit': 'submit',
        'change #file-upload': 'fileUpload'
      };

      AddNode.prototype.initialize = function() {
        vent.on('pasteImage', this.pasteImage, this);
        return vent.on('newNote', this.showNoteInputField, this);
      };

      AddNode.prototype.fileUpload = function(evt) {
        var f, reader, that;
        that = this;
        f = evt.target.files[0];
        reader = new FileReader();
        reader.onload = (function(theFile) {
          return function(e) {
            var filePayload, node;
            filePayload = e.target.result;
            node = new App.Models.Node({
              text: "no text yet",
              username: 'me of course',
              imageData: filePayload
            });
            return that.collection.add(node);
          };
        })(f);
        return reader.readAsDataURL(f);
      };

      AddNode.prototype.showNoteInputField = function(e) {
        var $textarea, temp, x, y;
        x = e.pageX;
        y = e.pageY;
        temp = this.template();
        console.log(typeof temp);
        this.$el.html(this.template());
        $('body').append(this.$el);
        $textarea = this.$el.find('textarea');
        $textarea.focus();
        return $textarea.on('focusout', function(e) {
          if (this.value === "") {
            return $(e.target).parent().css({
              visibility: 'hidden'
            });
          }
        });
      };

      AddNode.prototype.submit = function(e) {
        var node, text, username;
        e.preventDefault();
        text = $(e.currentTarget).find('textarea[name=text]').val();
        text = text.replace(/\n/g, '<br>');
        username = $(e.currentTarget).find('input[name=username]').val();
        node = new App.Models.Node({
          text: text || "empty",
          username: username || 'anonymous'
        });
        return this.collection.add(node);
      };

      AddNode.prototype.pasteImage = function(event) {
        var blob, clipboardData, i, items, reader, that;
        that = this;
        clipboardData = event.clipboardData || event.originalEvent.clipboardData;
        items = clipboardData.items;
        i = 0;
        while (i < items.length) {
          console.log(i);
          if (items[i].type.indexOf("image") === 0) {
            blob = items[i].getAsFile();
            i = items.length;
          }
          i++;
        }
        if (blob !== null) {
          reader = new FileReader();
          reader.onloadend = function(e) {
            var filePayload, node;
            filePayload = e.target.result;
            node = new App.Models.Node({
              text: "Title goes here",
              username: 'me of course',
              imageData: filePayload
            });
            node.setAbsCoordinates($('body').width() / 2, $('body').height() / 2);
            return that.collection.add(node);
          };
          return reader.readAsDataURL(blob);
        }
      };

      return AddNode;

    })(Backbone.View);
    App.Views.MenuView = (function(_super) {
      __extends(MenuView, _super);

      function MenuView() {
        return MenuView.__super__.constructor.apply(this, arguments);
      }

      MenuView.prototype.el = '#menuContainer';

      MenuView.prototype.events = {
        'click .menuButton': 'menuButtonClicked'
      };

      MenuView.prototype.menuButtonClicked = function(e) {
        window.button.selected = e.target.id;
        return console.log(window.button.selected);
      };

      return MenuView;

    })(Backbone.View);
    collectionNodes = new App.Collections.Nodes();
    addNodeView = new App.Views.AddNode({
      collection: collectionNodes
    });
    menuView = new App.Views.MenuView({
      collection: collectionNodes
    });
    nodeCollectionView = new App.Views.NodesCollection({
      collection: collectionNodes
    });
    return $(".nodes").append(nodeCollectionView.render().el);
  })();

}).call(this);

//# sourceMappingURL=App.map
