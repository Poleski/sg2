$(document).ready(function(){

    // Main nav functionality

    var navLinks = $("nav a");
    var contentBlocks = $("#content article");
    var colorContainer = $("#color-container");
    var storedTheme = localStorage.getItem("theme");
    var portfolioContainer = $("#portfolio .portfolio-container");
    var portfolioItems = portfolioContainer.find(".portfolio-img");
    var portfolioModal = portfolioContainer.children(".portfolio-modal");
    var resize;

    navLinks.click(function(e) {
        e.preventDefault();
        var target = $(this).data("target");
        openTab(target);
    });

    function setParameter(obj) {
        var url = window.location.href.split('?')[0];
        var query = $.param(obj);
        window.history.pushState("object or string", "Title", url+"?"+query);
    }

    function getParameter(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function openTab(target) {
        var filter = "[data-target='" + target + "']";

        navLinks.removeClass("active").filter(filter).addClass("active").parent().addClass("active");
        contentBlocks.addClass("hidden");
        $("#" + target).removeClass("hidden");
        setParameter({"tab": target});

        if (portfolioModal.hasClass("active")) {
            closePortfolioModal();
        }
    }

    if (getParameter("tab")) {
        openTab(getParameter("tab"));
    }

    // Theme toggle function

    function themeToggle(color) {
        var toggle = $("#theme-toggle");
        var opposite = (color === "dark") ? "light" : "dark";

        if (toggle.data('theme') === color) {
            toggle.data('theme', opposite);
            colorContainer.html('<link rel="stylesheet" href="css/color-' + color + '.min.css" />');
            localStorage.setItem("theme", color);
        }
    }

    if (storedTheme && storedTheme !== "light") {
        themeToggle("dark");
    }

    $("#theme-toggle").click(function() {
        themeToggle($(this).data('theme'));
    });

    // Portfolio

    function setPortfolioItemsPos() {
        portfolioItems = portfolioContainer.find(".portfolio-img");
        portfolioItems.each(function() {
            var pos = $(this).position();
            $(this).attr("data-pos-x", pos.left).attr("data-pos-y", pos.top).css({top: pos.top, left: pos.left});
        })
    }

    setPortfolioItemsPos();

    function openPortfolioModal(activeItem) {
        var activeItemImg = portfolioItems.filter("[data-target='"+activeItem+"']");
        var activeItemContainer = portfolioModal.find("#" + activeItem);

        portfolioItems.removeClass("active moved");
        activeItemImg.addClass("active moved");

        $(".portfolio-item-details").removeClass("active");
        activeItemContainer.addClass("active");

        portfolioModal.addClass("active");
    }

    function closePortfolioModal() {
        var activeItemImg = portfolioItems.filter(".active");
        activeItemImg.removeClass("moved");

        setTimeout(function() {
            portfolioModal.removeClass("active");
            activeItemImg.removeClass("active");
        }, 300)
    }

    portfolioItems.each(function(){
        $(this).click(function() {
            if ($(this).hasClass("active") !== true) {
                var activeItem = $(this).data("target");
                openPortfolioModal(activeItem);
            }
        })
    });

    $(".modal-close", portfolioModal).click(closePortfolioModal);


    // Cached functions

    $(window).resize(function() {
        clearTimeout(resize);

        resize = setTimeout(function() {
            setPortfolioItemsPos();
        }, 100)
    })

});