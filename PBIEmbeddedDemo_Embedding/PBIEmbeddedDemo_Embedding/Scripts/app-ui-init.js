$(function () {
  $(".navbar-expand-toggle").click(function () {
    $(".app-container").toggleClass("expanded");
    return $(".navbar-expand-toggle").toggleClass("fa-rotate-90");
  });
  return $(".navbar-right-expand-toggle").click(function () {
    $(".navbar-right").toggleClass("expanded");
    return $(".navbar-right-expand-toggle").toggleClass("fa-rotate-90");
  });
});

$(function () {
  return $('select').select2();
});

$(function () {
  return $('.toggle-checkbox').bootstrapSwitch({
    size: "small"
  });
});

$(function () {
  return $('.match-height').matchHeight();
});

$(function () {
  return $('.datatable').DataTable({
    "dom": '<"top"fl<"clear">>rt<"bottom"ip<"clear">>'
  });
});

$(function () {
  return $(".side-menu .nav .dropdown").on('show.bs.collapse', function () {
    return $(".side-menu .nav .dropdown .collapse").collapse('hide');
  });
});

$("input:radio[name=radio-navbar]").bind("click", function() {
  var value;
  value = $(this).val();
  if (value === "default") {
    return $("#navbar").addClass("navbar-default").removeClass("navbar-inverse");
  } else if (value === "inverse") {
    return $("#navbar").removeClass("navbar-default").addClass("navbar-inverse");
  }
});

$("input:radio[name=radio-sidebar]").bind("click", function() {
  var value;
  value = $(this).val();
  if (value === "default") {
    return $("#sidebar").removeClass("sidebar-inverse");
  } else if (value === "inverse") {
    return $("#sidebar").addClass("sidebar-inverse");
  }
});

$("input:radio[name=radio-color]").bind("click", function() {
  var value;
  value = $(this).val();
  if (value === "blue") {
    return $("body").removeClass("flat-green").addClass("flat-blue");
  } else if (value === "green") {
    return $("body").removeClass("flat-blue").addClass("flat-green");
  }
});
