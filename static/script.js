class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    add(vector_to_add) {
        this.x += vector_to_add.x;
        this.y += vector_to_add.y;
    }
}

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
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.context = this.canvas.getContext('2d');
        this.users = [];
        
        // Start drawing
        this.drawLoop();
    }

    resize(width) {
        this.canvas.style.width = '95%';
        this.canvas.style.height = '95%';
        this.canvas.width = 0.95*width;
        this.canvas.height = this.canvas.width;
    }

    drawLoop() {
        // Da lahko uporabimo v loopu
        var chat = this;

        function loop() {
            // Prvo pobrisemo
            chat.context.clearRect(0, 0, chat.canvas.width, chat.canvas.height);
            
        }

        setInterval(function() {
            loop();
        }, 16.666);
    }
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
            if (square.classList.contains('map')) {
                chat.resize($(square).width());
            }
            //console.log($(square).width(), $(square).height());
        }
    }
    $(window).resize(formatPage);

    // write your functions here

    // End of Event Listeners, Function Declarations =======

    // Start of Code =======================================
    // Tukaj lahko klicete funkcije da jih testirate



    // formatiranje s pomocjo javascripta
    var chat = new Chat('tinyroom');
    formatPage();
    // End of Code =========================================

    var position = [2,3];
    var name = "Domen";
    var weather = "Sunny";
    var user1 = new User(position, name, weather);
    //user1.draw_avatar();
});
