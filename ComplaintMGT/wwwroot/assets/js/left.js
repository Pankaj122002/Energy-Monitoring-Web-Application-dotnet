
document.querySelector(".menu_button").addEventListener("click", function () {
    expandCollapseMenu();
});

function expandCollapseMenu() {
    const sidebarMenu = document.querySelector(".sidebar-menu");
    sidebarMenu.classList.toggle("active");
    let contentArea = document.querySelector(".main-box");
    if (contentArea == null || contentArea == undefined)
        contentArea = document.querySelector(".content-area");
    const footer = document.querySelector(".footer");
    if (sidebarMenu.classList.contains("active")) {
        // If sidebar-menu is active, increase left margin of .content-area by 260px
        contentArea.style.paddingLeft = "15.5%";
        footer.style.paddingLeft = "15.5%";
        contentArea.style.overflow = 'hidden';


    } else {
        // If sidebar-menu is not active, reset left margin of .content-area to 0
        contentArea.style.paddingLeft = "0";
        footer.style.paddingLeft = "0";

    }
}

document.addEventListener("DOMContentLoaded", function () {

   // expandCollapseMenu();
    document.querySelectorAll('.lBar .nav-link').forEach(function (element) {

        element.addEventListener('click', function (e) {

            let nextEl = element.nextElementSibling;
            let parentEl = element.parentElement;

            if (nextEl) {
                e.preventDefault();
                let mycollapse = new bootstrap.Collapse(nextEl);

                if (nextEl.classList.contains('show')) {
                    mycollapse.hide();
                } else {
                    mycollapse.show();
                    // find other submenus with class=show
                    var opened_submenu = parentEl.parentElement.querySelector('.submenu.show');
                    // if it exists, then close all of them
                    if (opened_submenu) {
                        new bootstrap.Collapse(opened_submenu);
                    }

                }
            }

        });
    })

});




/*document.querySelector(".menu_button").addEventListener("click", function() {
  document.querySelector(".sidebar-menu").classList.toggle("active");
});

document.querySelectorAll(".sidebar .links .link a").forEach(function(link) {
  link.addEventListener("click", function(e) {
    if (e.target.parentNode.children.length > 1) {
      e.target.parentNode.classList.toggle("active");
    }
  });
});
*/


/*document.querySelector(".sidebar-menu .menu_button").addEventListener("click",function(){
  document.querySelector(".sidebar-menu").classList.toggle("active");
});


document.querySelectorAll(".sidebar-menu .sidebar .links .link a").forEach(function(link){
  link.addEventListener("click",function(e){
    if(e.target.parentNode.children.length >1){e.target.parentNode.classList.toggle("active");
    }
  });
});

const sidebarMenu = document.querySelector(".sidebar-menu");
if (sidebarMenu) {
  sidebarMenu.classList.toggle("active");
} else {
  console.error("Sidebar menu not found!");
}
*/





