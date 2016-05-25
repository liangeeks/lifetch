export default Backbone.View.extend({
    tagName: 'div',
    className: 'item',
    events: {
        'mouseenter .inner': 'handleMouseEnterInner',
        'mouseleave .inner': 'handleMouseLeaveInner',
        'click .inner': 'handleClickInner',
    },
    handleMouseEnterInner() {
        this.showTitle();
    },
    handleMouseLeaveInner() {
        this.hideTitle();
    },
    handleClickInner() {
        window.LFT.expandModel.set(this.model.toJSON());
    },
    showTitle() {
        this.$('.title').animate({
            padding: 10,
            height: 40
        }, 'fast')
    },
    hideTitle() {
        this.$('.title').css({
            height: 0,
            padding: '0 10px',
            overflow: 'hidden'
        });
    },
    render: function() {
        var flex = this.model.get('flex');
        if (!flex) {
            flex = Math.max((Math.random() * 2 +
                1).toFixed(1), 1) + ''
            this.model.set('flex', flex)
        }
        this.$el
            .css({
                flex: flex
            })
            .html(`
                <div class='inner' style='background-image: url("${this.model.get('url')}")'>
                    <div class='title'>${this.model.get('name')}</div>
                </div>
            `);
        this.hideTitle();
        return this.$el;
    }
});
