/**
 * Created by neo on 2016/10/19.
 */
;(function ($) {
    function _tab(element) {
        var tabBox = element;
        var tabNav = tabBox.find('.nav-tabs');
        var tabContent = tabBox.find('.tab-content');
        var bindEvnet = function () {
            tabNav.find('li').on('click',function () {
                tabNav.find('li.active').removeClass('active');
                $(this).addClass('active');
                var target = $(this).find('a').data("target");
                tabContent.find('.tab-pane.active').removeClass('active');
                tabContent.find('.tab-pane'+target).addClass('active');
            })
            tabNav.find('li').eq(0).trigger('click');
        }
        bindEvnet();
    }
    function tab() {
        this.each(function () {
            var $this = $(this);
            _tab($this);
        })
    }  
    $.fn["tab"] = tab;
})(jQuery)

$('.tab-box').tab();