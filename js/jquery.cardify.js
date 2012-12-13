// cardify.js

(function($) {

    $.cardify = function(element, options) {

        var defaults = {
            'numLines' : 14, 
            'chars'    : 70, 
            'className': 'threebyfive',
            'pageBreak': 1
        }

        var cardify = this;

        cardify.settings = {};
        cardify.currentCard = undefined;

        var $element   = $(element),
             element   = element,
            $container = $('<div />');

        cardify.init = function() {

            var lineCount = 0;
            cardify.settings = $.extend({}, defaults, options);
            $container.addClass(cardify.settings['className']);
            $element.after($container);
            createCard();

            var increaseLineCount = function() {
                
                if ( lineCount % cardify.settings.numLines == (cardify.settings.numLines - 1) )
                    createCard();

                lineCount++;
            };

            var parseElements = function() {
                
                var nodeName = this.nodeName.toLowerCase();
                
                var parseLines = function(text, pre, post) {                    
                    var lines = wordwrap(text);
                    pre = pre || '';
                    post = post || '';

                    $.each(lines, function() {
                        cardify.currentCard.append(pre + this + post + '<br />');
                        increaseLineCount();
                    });
                };

                switch(nodeName) {

                    case "ul":
                        $(this).find('li').each(function() {
                            parseLines($(this).text())
                        });
                        break;

                    case "p":
                    case "div":
                        parseLines($(this).text())
                        break;

                    case "h4":
                    case "h3":
                    case "h2":
                    case "h1":
                        parseLines($(this).text(), '<strong>', '</strong>');

                        break;

                }

                cardify.currentCard.append('<br />');
                increaseLineCount();
                $container
                    .children(':nth-child(' + cardify.settings.pageBreak + 'n+1)')
                    .addClass('page-break')
                    .first().removeClass('page-break');
            };

            $element
                .find('p, ul, h1, h2, h3, h4')
                .each(parseElements);

        }



        cardify.refresh = function(newopts) {
            cardify.settings = {};
            options = newopts;
            $container.empty().removeClass();
            cardify.init();
        }

        function createCard() {
            var $card = $('<div class="cardify-card" />');
            cardify.currentCard = $card;
            $container.append($card);
        }

        function wordwrap( str, width, cut ) {
             width = width || cardify.settings.chars || 75;
             cut = cut || false;

             if (!str) { return str; }

             var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');

             return str.match( RegExp(regex, 'g') );
        }

        cardify.init();

    }

    $.fn.cardify = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('cardify')) {
                var cardify = new $.cardify(this, options);
                $(this).data('cardify', cardify);
            }
        });

    }

	

})(jQuery);
