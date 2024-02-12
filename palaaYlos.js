document.addEventListener("DOMContentLoaded", function(){
    const sivuAlkuun = document.getElementById("palaaYlos");
    const odotusKorkeus = window.innerHeight / 3;

    window.onscroll = function () {
        if (document.body.scrollTop > odotusKorkeus || document.documentElement.scrollTop > odotusKorkeus){
            sivuAlkuun.style.opacity = "1";
        } else {
            sivuAlkuun.style.opacity = "0";
        }
    };

    sivuAlkuun.addEventListener("click", function(){
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
