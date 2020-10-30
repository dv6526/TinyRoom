$(function() {
    // Event Listeners, Function Declarations ==============
    $(".hamburger .fa").click(function(){
        $(".wrapper").addClass("active")
    })

    $(".wrapper .sidebar .close").click(function(){
        $(".wrapper").removeClass("active")
    })

    function fillCanvas(canvas) {
        let context = canvas[0].getContext('2d');
        context.fillStyle = '#FF0000';
        context.fillRect(0, 0, canvas.width(), canvas.height());
    }

    function formatPage() {
        let squares = $('.square-content');
        //console.log(squares);
        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            $(square).height($(square).width());
            console.log($(square).width(), $(square).height());
        }
    }
    $(window).resize(formatPage);

    // write your functions here

    // End of Event Listeners, Function Declarations =======

    // Start of Code =======================================
    // Tukaj lahko klicete funkcije da jih testirate



    // formatiranje s pomocjo javascripta
    formatPage();
    // End of Code =========================================
    
});
