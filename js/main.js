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
        setParameter([{"tab": target}]);
    });

    function setParameter(queryArray) {
        var url = window.location.href.split('?')[0];
        var query = [];
        for (var i in queryArray) {
            query.push($.param(queryArray[i]));
        }
        var queryString = query.join("&");
        window.history.pushState("object or string", "Title", url+"?"+queryString);
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

        if (portfolioModal.hasClass("active")) {
            closePortfolioModal();
        }
    }

    if (getParameter("tab")) {
        openTab(getParameter("tab"));

        if (getParameter("tab") === "portfolio" && getParameter("item")) {
            openPortfolioModal(getParameter("item"));
        } else {
            setParameter([{"tab": getParameter("tab")}]);
        }
    }

    // Theme toggle function

    function themeToggle(color) {
        var toggle = $("#theme-toggle");
        var opposite = (color === "dark") ? "light" : "dark";

        if (toggle.data('theme') === color) {
            toggle.data('theme', opposite);
            document.getElementById(color + '-styles').disabled = false;
            document.getElementById(opposite + '-styles').disabled = true;
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

    function setPortfolioItemsPos(activeItem) {
        portfolioItems = portfolioContainer.find(".portfolio-img");

        if (activeItem) {
            activeItem.attr("data-pos-x", activeItem.position().left).attr("data-pos-y", activeItem.position().top).css({top: activeItem.position().top, left: activeItem.position().left});
        } else {
            portfolioItems.each(function() {
                var pos = $(this).position();
                $(this).attr("data-pos-x", pos.left).attr("data-pos-y", pos.top).css({top: pos.top, left: pos.left});
            })
        }

    }

    setPortfolioItemsPos();

    function openPortfolioModal(activeItem) {
        setParameter([{"tab": "portfolio"}, {"item": activeItem}]);
        var activeItemImg = portfolioItems.filter("[data-target='"+activeItem+"']");
        var activeItemContainer = portfolioModal.find("#" + activeItem);

        portfolioItems.removeClass("active moved");
        activeItemImg.addClass("active moved");

        $(".portfolio-item-details").removeClass("active");
        activeItemContainer.addClass("active");

        portfolioModal.addClass("active");
    }

    function closePortfolioModal() {
        setParameter([{"tab": "portfolio"}]);
        var activeItemImg = portfolioItems.filter(".active");
        activeItemImg.removeClass("moved");

        setTimeout(function() {
            portfolioModal.removeClass("active");
            activeItemImg.removeClass("active");
            setPortfolioItemsPos(activeItemImg);
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

    $(".no-click").click(function(e) {
        e.preventDefault();
    });

    $(".link-trigger").click(function(e) {
        e.preventDefault();
        navLinks.filter("[data-target='" + $(this).data("target") + "']").trigger("click");
    });


    // Cached functions

    $(window).resize(function() {
        clearTimeout(resize);

        resize = setTimeout(function() {
            setPortfolioItemsPos();
        }, 100)
    })

});

// Preloader

$(window).on("load", function() {
    $("#preloader").hide();
});