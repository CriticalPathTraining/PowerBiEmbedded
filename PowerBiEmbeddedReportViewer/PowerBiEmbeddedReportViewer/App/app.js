/// <reference path="jquery-3.1.1.js" />
/// <reference path="powerbi.js" />

var leftNavCollapsed = window.leftNavCollapsed;

$(function () {

  InitializeUI();

  var reportConfig = {
    settings: {
      filterPaneEnabled: false,
      navContentPaneEnabled: false
    }
  };

  var reportContainer = document.getElementById("pbi-report");

  if (reportContainer) {
    var report = powerbi.embed(reportContainer, reportConfig);

    var pages = [];
    var currentPageIndex = 0;
    var currentPage = null;
  
    report.on('loaded', function () {
      report.getPages().then(
          function (reportPages) {
            // assign report pages collection to pages array
            pages = reportPages;
            // initialize UI to radio button for each report page
            loadReportPages(pages);
          });
    });

    report.on('pageChanged', function (e) {
      currentPage = e.detail.newPage;

      setActiveReportPage(currentPage);

      currentPageIndex = pages.findIndex(function (el) {
        return el.name === e.detail.newPage.name;
      });

    });


    function changePage(direction) {
      var nextPageIndex = currentPageIndex + direction;
      if (nextPageIndex < 0) nextPageIndex = pages.length - 1;
      if (nextPageIndex >= pages.length) nextPageIndex = 0;
      pages[nextPageIndex].setActive();
    }

    $('#setting-shownav').on('change', function (e) { updateSetting(e, 'navContentPaneEnabled'); });
    $('#setting-showfilterpane').on('change', function (e) { updateSetting(e, 'filterPaneEnabled'); });
    $('#goto-prev-page').on('click', function () { changePage(-1); });
    $('#goto-next-page').on('click', function () { changePage(1); });

    function updateSetting(e, settingName) {
      var settings = {};
      settings[settingName] = e.target.checked;
      report.updateSettings(settings);
    }

  }

});

function InitializeUI() {

  $("#navigation-toggle").click(onNavigationToggle);

  $("#reportsMenu a").click(onRequestReport);
  
  $("#report-elements").hide();

  $(".leftNavIcon").click(onNavigationToggle);
  $("#print-report-page").click(printReportPage);
    

  setNavigation();

  $(window).resize(resizeNavigationPane);
  resizeNavigationPane();

}

function resizeNavigationPane() {
  var windowHeight = $(window).height();
  var bannerHeight = $("#banner").height();
  $("#left-nav").height(windowHeight - bannerHeight);
}

function onNavigationToggle() {
  leftNavCollapsed = !leftNavCollapsed;
  setNavigation();

}

function setNavigation() {
  if (leftNavCollapsed) {
    console.log("Collpase");
    $("#left-nav").addClass("navigationPaneCollapsed");
    $("#content-body").addClass("contentBodyNavigationCollapsed");
    $("#navigation-toggle").addClass("fa-arrow-left").removeClass("fa-mail-reply");
    $(".leftNavItem").addClass("leftNavHide").hide();
  }
  else {
    console.log("Expand");
    $("#left-nav").removeClass("navigationPaneCollapsed");
    $("#content-body").removeClass("contentBodyNavigationCollapsed");
    $("#navigation-toggle").addClass("fa-mail-reply").toggleClass("fa-arrow-left");
    $(".leftNavItem").removeClass("leftNavHide").show();
  }
}

function onRequestReport() {
  $("#report-elements").hide();
  $("#report-loading-message").show();
}

function loadReportPages(pages) {

  var pageNavigation = $("#page-navigation");
  pageNavigation.empty();
  for (var index = 0; index < pages.length; index++) {
    pageNavigation.append(
      $("<li>")
        .append($('<a href="javascript:;" >')
        .text(pages[index].displayName))
        .click(function (e) {
          pages.find(function (page) { return page.displayName === e.target.text }).setActive();
        }));


    $("#report-loading-message").hide();
    $("#report-elements").show();
  }
}

function setActiveReportPage(page) {
  // update page name in title area
  $("#reportTitleInTitleArea").html("&nbsp; > &nbsp;" + page.displayName);
  // update page links to reflect which page is active
  var pageLinks = $("#page-navigation a");
  pageLinks.each(function (index, value) {
    if ($(this).text() === page.displayName) {
      $(this).parent().addClass("activePage");
    }
    else {
      $(this).parent().removeClass("activePage");
    }
  });
}

function printReportPage() {
  window.print();
}