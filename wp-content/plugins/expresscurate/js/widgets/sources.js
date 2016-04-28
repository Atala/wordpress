var ExpressCurateSourcesWidget = (function ($) {
    var isSetup = false, $widget;
    var ADD_POST_SOURCE_URL = '?action=expresscurate_add_post_source',
        DELETE_POST_SOURCE_URL = '?action=expresscurate_delete_post_source';

    /*curate from content feed and bookmarks*/
    function addSources(list, dataElem) {
        var items = [];
        $.each(list, function (index, el) {
            items.push($(el).find(dataElem).text());
        });
        $('#expresscurate_bookmarks_curate_data').val(JSON.stringify(items));
        $('form#expresscurate_bookmarks_curate').submit();
        ga('expresscurate.send', 'event', 'button', 'click', 'curate');
    }

    function addNew() {
        var $elemToRotate = $('.addSourceActive div span span'),
            $input = $widget.find('.addSource input'),
            link = $input.val().trim(),
            postID = $('#post_ID').val(),
            itemsCount = $widget.find('ul>li').length,
            $existedLinks = $widget.find('.tooltip a'),
            existed = false;
        $existedLinks.each(function (index, val) {
            if ($(val).attr("href").replace(/\/\s*$/, "") === link.replace(/\/\s*$/, "")) {
                existed = true;
            }
        });
        if (link !== '') {
            if (!existed) {
                ExpressCurateUtils.startLoading($input, $elemToRotate);
                $.ajax({
                    type: 'POST',
                    url: ajaxurl + ADD_POST_SOURCE_URL,
                    data: {
                        url: link,
                        post_id: postID
                    }
                }).done(function (res) {
                    var data = $.parseJSON(res);
                    if (data.status === 'success') {
                        $.extend(data.result, {
                            'count': itemsCount + 1,
                            'data': JSON.stringify(data.result)
                        });
                        var liHTML = ExpressCurateUtils.getTemplate('sourceCollWidget', data.result);
                        $widget.find('ul li.addSource').before(liHTML);
                        $input.val('');
                    } else {
                        $widget.find('.errorM').text('Invalid URL').stop(true, true).animate({width: '310px'}, 400).find('input').focus();
                    }
                }).always(function () {
                    ExpressCurateUtils.endLoading($input, $elemToRotate);
                });
            } else {
                $widget.find('.errorM').text('URL already exists').stop(true, true).animate({width: '310px'}, 400).find('input').focus();
            }
        }
        $input.val('');
        ExpressCurateUtils.track('/sourcewidget/add');
    }

    function deleteSource(el) {
        var item = $(el).find('textarea').val(),
            postID = $('#post_ID').val();
        $.ajax({
            type: 'POST',
            url: ajaxurl + DELETE_POST_SOURCE_URL,
            data: {item: item, post_id: postID}
        }).success(function () {
            el.remove();
        });
        ExpressCurateUtils.track('/sourcewidget/delete');
    }

    function curate(el) {
        var permalinkPosition = $('#edit-slug-box').offset().top;
        $(document).scrollTop(permalinkPosition - 90);
        ExpresscurateDialog.openDialog($(el).find('.tooltip a').attr('href'));
        ExpressCurateUtils.track('/sourcewidget/curate');
    }

    function removeError() {
        var $error = $widget.find('.errorM');
        $error.stop(true, true).animate({width: '0px'},
            {
                duration: 400
            });
    }

    function showInfo(control) {
        var $deleteButton = control.find('.delete'),
            url = control.find('.tooltip a').attr('href'),
            $contentWrap = $('#content'),
            content = (($contentWrap.css("display") === "block") ? $contentWrap.val() : tinyMCE.get("content").getContent()),
        /*find curated post's url*/
            myRegExp = new RegExp('((cite=)|(data-curated-url=)|(data-cloned-url=))["\']' + url + '["\' ]', 'gmi');

        if (content.match(myRegExp)) {
            $deleteButton.addClass('expresscurate_displayNone');
        } else {
            $deleteButton.removeClass('expresscurate_displayNone').addClass('expresscurate_displayInlineBlock');
        }
    }

    function setupDom() {
        $widget = $('.expresscurate_sources_coll_widget');
    }

    function setupEvents() {
        var clickDisabled = false;

        /*hover*/
        $widget.on('hover', 'li.list', function () {
            var $this = $(this);
            showInfo($this);
        });

        /*add*/
        $('.expresscurate_sources_coll_widget .addSource .text').on('click', function () {
            var $elem = $(this).parents('.addSource');
            if (!$elem.hasClass('addSourceActive')) {
                removeError();
                $elem.addClass('addSourceActive').find('input').focus();
            }
        });

        $('html').on('click', function (e) {
            var $elem = $(e.target);
            if (!$elem.hasClass('addSource') && !$elem.parents().hasClass('addSource') && !$elem.hasClass('errorM')) {
                $widget.find('.addSource').removeClass('addSourceActive');
            }
        });

        $widget.keydown(function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                return false;
            }
        });

        $('.expresscurate_sources_coll_widget .addSource input').on('keyup', function (e) {
            if (e.keyCode === 13) {
                addNew();
            }
        });

        $widget.on('click', '.addSourceActive div span span', function () {
            if (clickDisabled) {
                return;
            }
            addNew();
            clickDisabled = true;
            setTimeout(function () {
                clickDisabled = false;
            }, 600);
        });

        /*error*/
        $widget.on('click', '.errorM, .errorM input', function () {
            removeError();
        });

        /*delete*/
        $widget.on('click touchend', 'li .delete', function () {
            var elem = $(this).parents('.expresscurate_sources_coll_widget ul>li');
            deleteSource(elem);
        });

        /*curate*/
        $widget.on('click touchend', 'li .expresscurate_curate', function () {
            curate($(this).parents('li.list'));
        });

        isSetup = true;
    }

    return {
        setup: function () {
            if (!isSetup) {
                $(document).ready(function () {
                    $.when(setupDom()).then(function () {
                        setupEvents();
                    });
                });
            }
        },
        addSources: addSources,
        addNew: addNew
    }
})(window.jQuery);
ExpressCurateSourcesWidget.setup();