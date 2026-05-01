/*var activeToggleId = 'flexSwitchCheckDefault1';*/

/*document.addEventListener("DOMContentLoaded", function () {
 $('#flexSwitchCheckDefault1').prop('checked',true)
});*/



document.querySelector(".qLinks-button").addEventListener("click", function() {
  const rightBar = document.querySelector(".quick-links");
  rightBar.style.display = "block";
  var box = document.querySelector('.main-box');
  if(rightBar.style.display = "block")
  {
    rightBar.style.zIndex = '1000';
    box.style.zIndex = '999';
    box.style.opacity = '.2';
  }
});

document.getElementById('flexSwitchCheckDefault1').addEventListener("click", function() {
  const g1 = document.getElementById('chart-container1');
  const h1 = document.getElementById('h1');
  if(h1.style.display === 'block'){
    h1.style.display === 'none';
    g1.style.display === 'none';
  }
  else{
    h1.style.display === 'block';
    g1.style.display === 'block';
  }
});

document.querySelector(".X").addEventListener("click", function() {
  const rightBar = document.querySelector(".quick-links");
  rightBar.style.display = "none";
  var box = document.querySelector('.main-box');
  if(rightBar.style.display = "none")
  {
    rightBar.style.zIndex = '0';
    box.style.zIndex = '0';
    box.style.opacity = '1';
  }
});

document.querySelector(".filter-button").addEventListener("click", function() {
  const rightBar = document.querySelector(".filter-box");
  rightBar.style.display = "block";
  var box = document.querySelector('.main-box');
  if(rightBar.style.display = "block")
  {
    rightBar.style.zIndex = '1000';
    box.style.zIndex = '999';
    box.style.opacity = '.2';
  }

});

document.querySelector(".X1").addEventListener("click", function() {
  const rightBar = document.querySelector(".filter-box");
  rightBar.style.display = "none";
  var box = document.querySelector('.main-box');
  if(rightBar.style.display = "none")
  {
    rightBar.style.zIndex = '0';
    box.style.zIndex = '0';
    box.style.opacity = '1';
  }
});

document.getElementById("home-tab").addEventListener("click", function() {
  const page1 = document.querySelector(".page1");
  const page2 = document.querySelector(".page2");
  const page3 = document.querySelector(".page3");
  const page4 = document.querySelector(".page4");
  page1.style.display = "block";
  page2.style.display = "none";
  page3.style.display = "none";
  page4.style.display = "none";
});

document.getElementById("profile-tab").addEventListener("click", function() {
  const page1 = document.querySelector(".page1");
  const page2 = document.querySelector(".page2");
  const page3 = document.querySelector(".page3");
  const page4 = document.querySelector(".page4");
  page1.style.display = "none";
  page2.style.display = "block";
  page3.style.display = "none";
  page4.style.display = "none";
});

document.getElementById("contact-tab").addEventListener("click", function() {
  const page1 = document.querySelector(".page1");
  const page2 = document.querySelector(".page2");
  const page3 = document.querySelector(".page3");
  const page4 = document.querySelector(".page4");
  page1.style.display = "none";
  page2.style.display = "none";
  page3.style.display = "block";
  page4.style.display = "none";
});

document.getElementById("ops-tab").addEventListener("click", function() {
  const page1 = document.querySelector(".page1");
  const page2 = document.querySelector(".page2");
  const page3 = document.querySelector(".page3");
  const page4 = document.querySelector(".page4");
  page1.style.display = "none";
  page2.style.display = "none";
  page3.style.display = "none";
  page4.style.display = "block";
});






