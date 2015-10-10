(function ($) {
    Drupal.behaviors.ajax_image_style = {
        attach: function (context, settings) {
            s2hex = function(str) {
                out = "";
                for (var i=0, l=str.length; i<l; i++) out = out + str.charCodeAt(i).toString(16);
                return out;
            };

            $("div[picture]").each(function(i,e) {
                var $this = $(this);
                bp = $this.attr('picture');
                if (bp.length > 0) {
                    enc = s2hex(bp);
                    
                    style = $this.attr('pix-style');
                    if (style === undefined) style = 'default_picture';
    
                    layout = $this.attr('pix-layout');
                    if (layout === undefined) layout = 'cover';
    
                    size = $this.attr('pix-size');
                    if (size === undefined) size = "";
                    else {
                        if (size == "screen") size = '-'+screen.width+'x'+screen.height;
                        else if (size == "min") size = '-'+Math.min(screen.width, screen.height);
                        else if (size == "max") size = '-'+Math.max(screen.width, screen.height);
                        else size = '-'+size;
                    }
                    
                    $.get('/ajaxis/'+style+'-'+layout+size+'/' + enc, null, function(res) {
                    	/*
                        console.log(res);
                        console.log(res.result);
                        */
                        var opc = $this.css('opacity');
                        if (opc > 0) {
                            $this.data('opcty', opc);
                            $this.css('opacity', 0);
                        }
                        $('<img/>', $this).attr('src', res.url).load(function() {
                            $img = $(this);
                            $img.remove(); // prevent memory leaks as @benweet suggested
                            $this.css({
                                background:         "url("+res.url+") no-repeat center",
                                'background-size':  layout,
                            });
                            if ($this.data('opcty') > 0) {
                            	$this.animate({ opacity:$this.data('opcty') }, 1500);
                                $this.data('opcty', '');
                            }
                        });
                        /*
                        $this.css({
                            background:         "url("+res.url+") no-repeat center",
                            'background-size':  layout,
                        });
                        */
                    });
                }
            });
        }
    };
} (jQuery));