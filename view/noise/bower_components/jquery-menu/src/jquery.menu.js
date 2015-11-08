/**
 * @param {Object} $ The jQuery library
 */
(function($) {

    /**
     * Define a jQuery object method called menu to initialize any menu on that selector.
     *
     * @param {Object} options (Optional)
     * @return {selector}
     */
    $.fn.menu = function(options) {

        /**
         * Extend default options with those provided.
         * @type {Object}
         * @private
         */
        var _opts = $.extend({}, $.fn.menu.defaults, options);

        /**
         * A container of delays of menu items closing.
         * The key is the menu item ID and the value is an object as follows:
         * {
         *  menuItemID: {
         *    element: menuItem,
         *    callback: function
         *  },
         *  menuItem2ID: {
         *    ...
         *  }
         * }
         * @type {Object}
         * @private
         */
        var _timer = {};

        /**
         * Get the identifier of the menu item
         *
         * @param {Object} menuItem
         * @return {string}
         * @private
         */
        var _getMenuItemID = function(menuItem) {
            // TODO find a better way to get an identifier of the menu item
            return $(menuItem).text().replace(/ |\n/g, '');
        };

        /**
         * Hide/Show menu item.
         *
         * @param {Object} menuItem
         * @param {boolean} isVisible If true then show the menu item, otherwise hide it.
         * @private
         */
        var _toggleMenuItem = function(menuItem, isVisible) {
            var subMenu = $(menuItem).find('.' + _opts.subMenuClass).first();
            if (isVisible) {
                $(menuItem).addClass(_opts.visibleMenuItemClass);
                // Show the sub menu of the menu item
                subMenu.show();
            }
            else {
                $(menuItem).removeClass(_opts.visibleMenuItemClass);
                // Hide the sub menu of the menu item
                subMenu.hide();
            }
        };

        return this.each(function() {
            var menu = this;
            $(menu).find('.' + _opts.menuItemClass).on('mouseenter', function(event) {
                var menuItem = this;

                // Prevents an immediate closing of the menu when the mouse goes out from the menu
                if (_timer[_getMenuItemID(menuItem)]
                        && _timer[_getMenuItemID(menuItem)].callback > 0) {
                    clearTimeout(_timer[_getMenuItemID(menuItem)].callback);
                }

                $.each(_timer, function(menuItemID, obj) {
                    if (menuItemID !== _getMenuItemID(menuItem)
                        && $(obj.element).find(menuItem).length == 0
                        && $(menuItem).find(obj.element).length == 0) {
                        _toggleMenuItem(obj.element);
                    }
                });

                // Show sub menu
                _toggleMenuItem(menuItem, true);
            }).on('mouseleave', function(event) {
                var menuItem = this;

                // If the mouse is out from the menu container
                if ($(menu).has(document.elementFromPoint(event.clientX, event.clientY)).length <= 0) {
                    _timer[_getMenuItemID(menuItem)] = {
                        element: menuItem,
                        callback: setTimeout(function() {
                            // Hide sub menu
                            _toggleMenuItem(menuItem);
                        }, _opts.delay)
                    };
                }
                // If the mouse is yet in menu container
                else {
                    // Hide sub menu
                    _toggleMenuItem(menuItem);
                }
            });
        });
    };

    /**
     * Plugin defaults - added as a property on our plugin function.
     *
     * @type {Object}
     */
    $.fn.menu.defaults = {

        /**
         * Delay (in milliseconds) of menu item closing
         *
         * @type {number}
         */
        delay: 300,

        /**
         * Class name of the sub menu.
         * @type {string}
         */
        subMenuClass: 'sub-menu',

        /**
         * Class name of the menu item.
         * @type {string}
         */
        menuItemClass: 'menu-item',

        /**
         * Class name of the visible menu item.
         * @type {string}
         */
        visibleMenuItemClass: 'is-menu-item-visible'
    };
}(jQuery));
