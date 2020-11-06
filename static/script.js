

class User {
       
    constructor(position, name, weather) {
        this.sprite_wh = 60;
        this.position = position;
        this.name = name;
        this.weather = weather;
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.sprite_wh;
        this.canvas.height = this.sprite_wh;
        
    }

    draw_avatar() {
        var img=document.createElement('img');
        img.src='static/avatar.png';
        var user = this;
        img.onload = function () {
            var ctx = (user.canvas).getContext('2d');
            ctx.drawImage(img,0,0,user.sprite_wh,user.sprite_wh);

        }

    }
    
}

class Chat {
    
}

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

    var position = [2,3];
    var name = "Domen";
    var weather = "Sunny";
    var user1 = new User(position, name, weather);
    //user1.draw_avatar();
});
