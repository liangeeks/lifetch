import 'blueimp-file-upload/css/jquery.fileupload.css';
import '../css/index.css';

import PictureModel from './PictureModel';
import PictureCollection from './PictureCollection';
import ItemView from './ItemView';
import ExpandView from './ExpandView';

window.LFT.expandModel = new PictureModel();


var pictures = new PictureCollection();
var Board = Backbone.View.extend({
    className: "picture-board",
    events: {
        'click .load-more': 'loadMore'
    },

    initialize: function() {
        this.collection = pictures;
        this.listenTo(this.collection, 'all',
            this.render);
        this.listenTo(this.collection, 'add',
            this.appendItem);
        this.collection.more();
    },

    loadMore: function() {
        this.collection.more();
    },

    appendItem: function(item) {
        this.index = this.index + 1;
        this.$('.row:last-child').append(
            new ItemView({
                model: item
            }).render()
        );
        if (this.index >= 3) {
            this.$('.container').append(
                '<div class="row"></div>');
            this.index = 0;
        }
    },

    render: function() {
        this.index = 0;
        this.$el.empty();
        this.$el.append(
            '<div class="container"></div>'
        );
        this.$('.container').append(
            '<div class="row"></div>');
        this.collection.forEach(this.appendItem
            .bind(this));
        this.$el.append(
            '<div class="load-more">加载更多</div>'
        );
    }
});

new Board({el: $('#board')}).render();
new ExpandView({
    model: window.LFT.expandModel,
    collection: pictures,
    el: $('#expand')
}).render();


$('#fileupload')
    .fileupload({
        url: '/picture/upload',
        sequentialUploads: true,
        formData: {
            csrfmiddlewaretoken: LFT.csrf_token
        },
    })
    .bind('fileuploadadd', function(e, data) {
        _.each(data.files, function(f) {
            var $statusbar = $(
                `<div class="upload-statusbar" data-name="${f.name}"></div>`);
            $("#uploadBox").show().append(
                $statusbar
                .append($(
                    '<div class="title"></div>'
                ).text(f.name))
                .append($(
                    '<div class="progress-bar"></div>'
                ).hide())
                .append($(
                    '<i class="fa fa-times close"></i>'
                ).click(function() {
                    $statusbar.remove();
                    if ($(
                            "#uploadBox .upload-statusbar"
                        ).length ==
                        0) $(
                        "#uploadBox"
                    ).hide();
                }))
            );
        });
        this.addedCount = (this.addedCount || 0) + data
            .files.length;
        $("#uploadBox .global-status").text("(" + (this
                .doneCount || 0) + "/" + this.addedCount +
            ")");
    })
    .bind('fileuploadprogress', function(e, data) {
        var progress = parseInt(data.loaded / data.total *
            100, 10);

        _.each(data.files, function(f) {
            var $statusbar = $(
                'div[data-name="' + f.name +
                '"]');
            $statusbar.find(".message").remove();
            $statusbar.find(".progress-bar").show()
                .css({
                    width: progress + '%'
                }).text(progress + '%');
        });
    })
    .bind('fileuploadfail', function(e, data) {
        var resp = data.response().jqXHR.responseJSON;
        _.each(data.files, function(f) {
            var $statusbar = $(
                'div[data-name="' + f.name +
                '"]');
            $statusbar.find(".progress-bar").hide();
            $statusbar
                .addClass('error')
                .append($(
                    '<div class="message"></div>'
                ).text(resp.message));
        });
    })
    .bind('fileuploaddone', function(e, data) {
        var resp = data.response().jqXHR.responseJSON;
        pictures.unshift(resp.data);
        _.each(data.files, function(f) {
            $('div[data-name="' + f.name + '"]')
                .remove();
        });
        if ($("#uploadBox .upload-statusbar").length ==
            0) $("#uploadBox").hide();
        this.doneCount = (this.doneCount || 0) + data.files
            .length;
        $("#uploadBox .global-status").text("(" + (this
                .doneCount || 0) + "/" + this.addedCount +
            ")");
    });
