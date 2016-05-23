(function (win, $) {
  $(function () {
    var PictureCollection = Backbone.Collection.extend({url: '/picture/json'});
    var ItemView          = Backbone.View.extend({
      tagName: 'div',
      className: 'item',
      render: function () {
        var flex = this.model.get('flex');
        if (!flex) {
          flex = Math.max((Math.random() * 2 + 1).toFixed(1), 1) + ''
          this.model.set('flex', flex)
        }
        this.$el
          .css({flex: flex})
          .html(
            $("<div class='inner'></div>")
              .css({backgroundImage: 'url("' + this.model.get('url') + '")'})
              .append($("<div class='title'>" + this.model.get('name') + "</div>"))
          )
        ;
        return this.$el;
      }
    });
    var pictures          = new PictureCollection();
    var Board             = Backbone.View.extend({
      el: '#board',
      className: "picture-board",
      events: {
        'click .load-more': 'loadMore'
      },

      page: 1,

      initialize: function () {
        this.collection = pictures;
        this.listenTo(this.collection, 'all', this.render);
        this.listenTo(this.collection, 'add', this.appendItem);
        this.collection.fetch({remove: false, data: {page: this.page}});
      },

      loadMore: function () {
        this.page = this.page + 1;
        this.collection.fetch({remove: false, data: {page: this.page}});
      },

      appendItem: function (item) {
        this.index = this.index + 1;
        this.$('.row:last-child').append(
          new ItemView({model: item}).render()
        );
        if (this.index >= 3) {
          this.$('.container').append('<div class="row"></div>');
          this.index = 0;
        }
      },

      render: function () {
        this.index = 0;
        this.$el.empty();
        this.$el.append('<div class="container"></div>');
        this.$('.container').append('<div class="row"></div>');
        this.collection.forEach(this.appendItem.bind(this));
        this.$el.append('<div class="load-more">加载更多</div>');
      }
    });

    new Board().render();
    $('#fileupload')
      .fileupload({
        url: '/picture/upload',
        sequentialUploads: true,
        formData: {csrfmiddlewaretoken: LFT.csrf_token},
      })
      .bind('fileuploadadd', function (e, data) {
        _.each(data.files, function (f) {
          var $statusbar = $('<div class="upload-statusbar" data-name="' + f.name + '"></div>');
          $("#uploadBox").show().append(
            $statusbar
              .append($('<div class="title"></div>').text(f.name))
              .append($('<div class="progress-bar"></div>').hide())
              .append($('<i class="fa fa-times close"></i>').click(function () {
                $statusbar.remove();
                if ($("#uploadBox .upload-statusbar").length == 0) $("#uploadBox").hide();
              }))
          );
        });
        this.addedCount = (this.addedCount || 0) + data.files.length;
        $("#uploadBox .global-status").text("(" + (this.doneCount || 0) + "/" + this.addedCount + ")");
      })
      .bind('fileuploadprogress', function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);

        _.each(data.files, function (f) {
          var $statusbar = $('div[data-name="' + f.name + '"]');
          $statusbar.find(".message").remove();
          $statusbar.find(".progress-bar").show().css({
            width: progress + '%'
          }).text(progress + '%');
        });
      })
      .bind('fileuploadfail', function (e, data) {
        var resp = data.response().jqXHR.responseJSON;
        _.each(data.files, function (f) {
          var $statusbar = $('div[data-name="' + f.name + '"]');
          $statusbar.find(".progress-bar").hide();
          $statusbar
            .addClass('error')
            .append($('<div class="message"></div>').text(resp.message));
        });
      })
      .bind('fileuploaddone', function (e, data) {
        var resp = data.response().jqXHR.responseJSON;
        pictures.unshift(resp.data);
        _.each(data.files, function (f) {
          $('div[data-name="' + f.name + '"]').remove();
        });
        if ($("#uploadBox .upload-statusbar").length == 0) $("#uploadBox").hide();
        this.doneCount = (this.doneCount || 0) + data.files.length;
        $("#uploadBox .global-status").text("(" + (this.doneCount || 0) + "/" + this.addedCount + ")");
      });
  });

})(this, jQuery);