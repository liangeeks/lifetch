export default Backbone.View.extend({
    events: {
        'click .backup': 'hide',
        'click .show-prev': 'handlePrev',
        'click .show-next': 'handleNext',
    },
    initialize() {
        this.listenTo(this.model, 'change', this.show.bind(this));
        $(window).on("keydown", this.handleKeypress.bind(this));
    },
    handleKeypress({keyCode}) {

        switch (keyCode) {
            // Left
            case 37:
                this.handlePrev();
                break;
            // Right
            case 39:
                this.handleNext();
                break;
            default:
                break;
        }
    },
    handlePrev() {
        if (!this.model.id) return;
        var index = -1;
        this.collection.forEach((item, i)=>{
            if (this.model.id == item.id) index = i;
        });
        if (index > 0)
            this.model.set(this.collection.at(index - 1).toJSON());

    },
    handleNext() {
        if (!this.model.id) return;
        var index = -1;
        this.collection.forEach((item, i)=>{
            if (this.model.id == item.id) index = i;
        });
        if (index < this.collection.size() - 1)
            this.model.set(this.collection.at(index + 1).toJSON());
    },
    show() {

        let url = this.model.get('url');
        if (!url) return this.hide();
        this.$el.html(
            `
                <div class='backup'></div>
                <div class='image-container'>
                    <img src="${url}"/>
                </div>
                <span class='show-prev switch-toggle'><i class='fa fa-chevron-left'></i></span>
                <span class='show-next switch-toggle'><i class='fa fa-chevron-right'></i></span>
            `
        ).show();
        $('body').css({overflow: 'hidden'});

    },
    hide() {
        this.model.clear();
        this.$el.empty().hide();
        $('body').css({overflow: 'initial'});
    },
    render() {

    }
});
