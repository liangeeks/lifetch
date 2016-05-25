import PictureModel from './PictureModel';
export default Backbone.Collection.extend({
    model: PictureModel,
    url: '/picture/json',
    page: 1,
    modelId: function(attrs) {
        return `pic-${attrs.id}`;
    },
    more() {
        this.fetch({
            remove: false,
            data: {
                page: this.page
            }
        });
        this.page = this.page + 1;
    }
});
