/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function filtroMenuF() {
    var parent = $('.dropdown-menu').parent();
    if (parent.hasClass('open')) {
        parent.removeClass('open');
    } else {
        parent.addClass('open');
    }
}

function resizeGrid(gridElement) {
    var dataHeader = gridElement.find(".k-grid-header-wrap");
    var dataArea = gridElement.find(".k-grid-content");
    var dataAreaLock = gridElement.find(".k-grid-content-locked");
    var totalHeight = 0;
    gridElement.parent().children().each(function () {
        totalHeight += $(this).outerHeight(true); // true = include margins
    });
    var newHeight;
    var others = gridElement.parent().height() - gridElement.height() + 60;
    if (gridElement.parent().css('min-height') === '100%') {
        newHeight = gridElement.parent().parent().find(".main-sidebar")[0].clientHeight - others;
    } else {
        others = totalHeight - gridElement.height() + 50;
        newHeight = parseInt(gridElement.parent().css('min-height').replace('px', '')) - others;
    }
    var diff = gridElement.innerHeight() - dataArea.innerHeight();
    gridElement.height(newHeight);
    dataArea.height(newHeight - diff);
    if (dataAreaLock) {
        dataArea.width(gridElement.width() - dataAreaLock.width());
        dataHeader.width(gridElement.width() - dataAreaLock.width() - 17);
        dataAreaLock.height(newHeight - diff);
    } else {
        dataHeader.width(gridElement.width() - 17);
        dataArea.width(gridElement.width());
    }
}

function resizeGridO(gridElement) {
    var dataArea = gridElement.find(".k-grid-content");
    var newHeight = gridElement.parent().innerHeight() - 2;
    var diff = gridElement.innerHeight() - dataArea.innerHeight();
    var total = $(window).innerHeight() - 50;

    gridElement.height(newHeight);
    dataArea.height(newHeight - diff);
}

function resizeGridM(gridName, other) {
    //Define Elements Needed
    var header = $(".main-header");
    var content = $(".content-wrapper");
    var grid = $(gridName);

    other = other ? other : 0;
    //Other variables
    var minimumAcceptableGridHeight = 250; //This is roughly 5 rows 
    var otherElementsHeight = 0;

    //Get Window Height 
    var windowHeight = $(window).innerHeight();

    //Get Header Height if its existing
    var hasHeader = header.length;
    var headerHeight = hasHeader ? header.outerHeight(true) : 0;

    //Get the Grid Element and Areas Inside It
    var contentArea = grid.find(".k-grid-content").first();  //This is the content Where Grid is located
    var contentAreaLock = grid.find(".k-grid-content-locked").first();
    var otherGridElements = grid.children().not(".k-grid-content").not(".k-grid-content-locked"); //This is anything ather than the Grid iteslf like header, commands, etc

    //Calcualte all Grid elements height
    otherGridElements.each(function () {
        otherElementsHeight += $(this).outerHeight(true);
    });

    otherElementsHeight = otherElementsHeight === 0 ? 71 : otherElementsHeight;
    //Get other elements same level as Grid
    var parentDiv = grid.parent("div");

    var hasMainContent = parentDiv.length;
    if (hasMainContent) {
        var paretn = grid, son = grid;
        while (paretn[0] !== content[0]) {
            paretn = paretn.parent();
            var otherSiblingElements = paretn.children()
                    .not(gridName)
                    .not("script")
                    .not("style");

            //Calculate all Sibling element height
            otherSiblingElements.each(function () {
                if ($(this)[0] !== son[0]) {
                    otherElementsHeight += $(this)[0].clientHeight;
                }
            });
            son = paretn;
        }
    } else {
        otherElementsHeight += 110;
    }

    //Padding you want to apply below your page
    var bottomPadding = 60;

    //Check if Calculated height is below threshold
    var calculatedHeight = windowHeight - headerHeight - otherElementsHeight - bottomPadding - other;
    var finalHeight = calculatedHeight < minimumAcceptableGridHeight ? minimumAcceptableGridHeight : calculatedHeight;

//    if (contentArea.length > 1) {
//        alert("mas");
//    }
//
//    for (var i = 0; i < contentArea.length; i++) {
//        if (i !== 0) {
//            delete contentArea[i];
//        }
//    }

    //Apply the height for the content area
    contentArea.height(finalHeight);
    contentAreaLock ? contentAreaLock.height(finalHeight) : '';
}
