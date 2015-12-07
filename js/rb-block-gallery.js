/*!
 * RB Block-gallery
 * ver. 0.5 beta
 * JQuery plugin that creates gallery from images (and optionally) text blocks, placed in equal rectangular block.
 * 
 * Copyright (c) 2015 Marek Kędzierski
 * License: MIT
 * 
 * Based on jQuery plugin boilerplate by @ajpiano and @addyosmani
 */

/*
 * 
 * Usage:
    $(document).ready(function() {
        $('#gallery').RBblockGallery();
    });
 * 
 * 
 * TODO: 
 * - preloader
 * - situation when at the end is/are elements outer of column
 * - change responsiviely amount of columns
 * - for mobile: when gallery is too long (slider, overflow with auto?)
 * 
 */

;(function ($, window, document, undefined) {

    // Default options
    var RBblockGallery = 'RBblockGallery',
        defaults = {
            columns: 3,
            preloader: false,
            preloaderPath: '../images/rbpreloader.gif'
        };

    // Constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = RBblockGallery;

        this.init();
    }

    Plugin.prototype = {

        init: function () {
            if (12 % (this.options.columns) !== 0) {
                console.log('RB Block-Gallery: wrong number of columns');
            }
            
            this.build();
            
            var that = this;
            $(window).load(function(){
                if(that.rwd() === false) {
                    that.measure();
                    that.applyHeight();
                    that.addImgClasses();
                }
            });
            $(window).resize(function(){
                if(that.rwd() === false) {
                    that.measure();
                    that.applyHeight();
                    that.addImgClasses();
                }
            });
        },

        build: function () {
            $('body').prepend('<div id="mobile-check"></div>');
            mobileCheck = $('#mobile-check');
            
            RBbg = $(this.element);
            RBbg.addClass('rbblockgallery');
            RBbg.children().wrap('<div class="rbblockgallery-item"></div>');
            RBitems = $('.rbblockgallery-item');
            
            if ((this.options.preloader) === true) {
                RBbg.prepend('<div class="rb-preloader"><img src="' + this.options.preloaderPath + '" alt="preloader" /></div>');
            }
            
            var column = [];
            var columnCount = 1;
            columnAmount = RBitems.length / this.options.columns;
            var btstrpClassCount = 12 / this.options.columns;

            RBitems.each(function(i, item) {
                var $item = $(item);
                column.push(item);
                
                if(column.length === columnAmount) {
                    $(column).wrapAll('<div class="rb-column-' + columnCount + ' col-md-' + btstrpClassCount + ' col-sm-' + btstrpClassCount + ' col-xs-12"></div>');
                    column = [];
                    columnCount++;
                }
            });
            
            RBcolumns = $('div[class^="rb-column"], div[class*="rb-column"]');
        }, 
        
        rwd: function () {
            if(mobileCheck.css('float') === 'left') {
                RBbg.css({height: 'auto'});
                RBitems.css({height: 'auto'});
                RBitems.removeClass('cropToV cropToH');
                        
                return true;
            } else {
                return false;
            }
        }, 
        
        measure: function () {
            RBitems.removeClass('cropToV cropToH');
            
            maxHeight = -1;
            RBbg.css({height: 'auto'});
            RBitems.css({height: 'auto'});
            
            RBcolumns.each(function() {
                if ($(this).outerHeight() > maxHeight) {
                    maxHeight = $(this).outerHeight(true);
                }
            });

            RBbg.outerHeight(maxHeight);
        },
        
        applyHeight: function () {
            RBimages = $();
            RBnotImages = $();
            
            RBcolumns.each(function() {
                var heightSum = 0;
                var heightToApply = 0;
                RBcurrItems = $(this).children();
                $(this).children().each(function() {
                    if($(this).children().is('img')) {
                        RBimages = RBimages.add($(this));
                    } else {
                        RBnotImages = RBnotImages.add($(this));
                    }
                    heightSum += $(this).outerHeight(true);
                }); 
                heightToApply = Math.round((maxHeight - heightSum) / RBimages.length);
                
                RBimages.each(function() {
                    $(this).height($(this).height() + heightToApply );
                });
                
                RBcurrItems = $();
                RBimages = $();
                RBnotImages = $();
            });
        }, 
        
        addImgClasses: function () {
            RBitems.children().each(function() {
                if($(this).is('img')) {
                    if($(this).height() < $(this).parent().height()) {
                        $(this).parent().addClass('cropToV');
                    } else if($(this).height() > $(this).parent().height()) {
                        $(this).parent().addClass('cropToH');
                    }
                }
            });
        }
    };

    // Plugin wrapper around the constructor preventing against multiple instantiations
    $.fn[RBblockGallery] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + RBblockGallery)) {
                $.data(this, 'plugin_' + RBblockGallery,
                new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);